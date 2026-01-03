/**
 * Database Cleanup Script
 * 
 * This script removes ALL data from:
 * - Authentication users (auth.users)
 * - All public schema tables
 * 
 * WARNING: This will delete all data! Use with caution.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function cleanupDatabase() {
  if (!supabaseUrl) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    process.exit(1);
  }

  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log("\n🗑️  Database Cleanup (Remote Database)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}\n`);
    console.log("⚠️  WARNING: This will delete ALL data from:");
    console.log("   - Authentication users (auth.users)");
    console.log("   - All public schema tables\n");

    // Delete all data from public tables (in correct order to respect foreign keys)
    console.log("🧹 Cleaning public schema tables...\n");
    
    const tablesToClean = [
      'subservice_gallery_images',
      'service_gallery_images',
      'project_gallery_images',
      'service_subservices',
      'subservices',
      'services',
      'projects',
      'blogs',
      'blog_categories',
      'leads',
    ];

    for (const table of tablesToClean) {
      try {
        // Delete all rows from the table
        const { error, count } = await supabaseAdmin
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          // Table might not exist or be empty, continue
          if (error.code === 'PGRST116') {
            console.log(`   ℹ️  ${table}: Table doesn't exist or is empty`);
          } else {
            console.log(`   ⚠️  ${table}: ${error.message}`);
          }
        } else {
          console.log(`   ✅ Cleaned: ${table}${count ? ` (${count} rows)` : ''}`);
        }
      } catch (err) {
        console.log(`   ⚠️  ${table}: ${err instanceof Error ? err.message : 'Skipped'}`);
      }
    }

    // Clean settings table (delete all, defaults will be recreated by migrations)
    try {
      const { error, count } = await supabaseAdmin
        .from('settings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`   ℹ️  settings: Table doesn't exist or is empty`);
        } else {
          console.log(`   ⚠️  settings: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Cleaned: settings${count ? ` (${count} rows)` : ''} (defaults will be recreated)`);
      }
    } catch (err) {
      console.log(`   ⚠️  settings: Skipped`);
    }

    // Delete all authentication users
    console.log("\n🧹 Cleaning authentication users...\n");
    
    let deletedCount = 0;
    let errorCount = 0;
    
    try {
      // Try Admin API first
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!listError && users?.users && users.users.length > 0) {
        console.log(`   Found ${users.users.length} user(s) to delete...\n`);
        
        for (const user of users.users) {
          try {
            const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
            if (deleteError) {
              console.log(`   ⚠️  ${user.email}: ${deleteError.message}`);
              errorCount++;
            } else {
              console.log(`   ✅ Deleted: ${user.email}`);
              deletedCount++;
            }
          } catch (err) {
            console.log(`   ⚠️  ${user.email}: ${err instanceof Error ? err.message : 'Failed to delete'}`);
            errorCount++;
          }
        }
      } else if (listError) {
        // If Admin API fails, try REST API
        console.log("   ⚠️  Admin API failed, trying REST API...");
        
        const authUrl = `${supabaseUrl}/auth/v1/admin/users`;
        const response = await fetch(authUrl, {
          method: 'GET',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const usersData = await response.json();
          if (usersData.users && usersData.users.length > 0) {
            console.log(`   Found ${usersData.users.length} user(s) to delete...\n`);
            
            for (const user of usersData.users) {
              try {
                const deleteUrl = `${supabaseUrl}/auth/v1/admin/users/${user.id}`;
                const deleteResponse = await fetch(deleteUrl, {
                  method: 'DELETE',
                  headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`,
                  },
                });
                
                if (deleteResponse.ok) {
                  console.log(`   ✅ Deleted: ${user.email}`);
                  deletedCount++;
                } else {
                  const errorText = await deleteResponse.text();
                  console.log(`   ⚠️  ${user.email}: HTTP ${deleteResponse.status}`);
                  errorCount++;
                }
              } catch (err) {
                console.log(`   ⚠️  ${user.email}: ${err instanceof Error ? err.message : 'Failed'}`);
                errorCount++;
              }
            }
          } else {
            console.log("   ℹ️  No users found to delete");
          }
        } else {
          console.log(`   ⚠️  Could not access users via REST API (HTTP ${response.status})`);
          console.log("   💡 You may need to delete users manually via Supabase Dashboard");
          console.log("      Dashboard: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users");
        }
      } else {
        console.log("   ℹ️  No users found to delete");
      }
      
      if (deletedCount > 0) {
        console.log(`\n   ✅ Successfully deleted ${deletedCount} user(s)`);
      }
      if (errorCount > 0) {
        console.log(`   ⚠️  Failed to delete ${errorCount} user(s)`);
        console.log("   💡 You may need to delete remaining users manually via Supabase Dashboard");
      }
    } catch (error) {
      console.log("   ⚠️  Error cleaning users:", error instanceof Error ? error.message : 'Unknown error');
      console.log("   💡 You may need to delete users manually via Supabase Dashboard");
      console.log("      Dashboard: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users");
    }

    console.log("\n✅ Database cleanup completed!");
    console.log("   All data has been removed from public tables and authentication.\n");
    
  } catch (error) {
    console.error("\n❌ Error during cleanup:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error("   Unknown error occurred");
    }
    process.exit(1);
  }
}

cleanupDatabase();

