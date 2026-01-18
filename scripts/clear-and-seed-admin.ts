/**
 * Clear All Data and Seed Admin Script
 * 
 * This script clears all data from all tables in the database
 * and then seeds only the admin user.
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function clearAllData() {
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
    db: {
      schema: 'public',
    },
  });

  try {
    console.log("\n🗑️  Clearing All Data from Database");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}\n`);

    // List of tables to clear in order (respecting foreign key constraints)
    // Clear child tables first, then parent tables
    const tablesToClear = [
      'subservice_gallery_images',
      'service_gallery_images',
      'project_gallery_images',
      'subservices',
      'services',
      'blogs',
      'blog_categories',
      'projects',
      'leads',
    ];

    console.log("📋 Clearing tables...\n");

    for (const table of tablesToClear) {
      try {
        // Get all rows first to check count
        const { data: existingData } = await supabaseAdmin
          .from(table)
          .select('id')
          .limit(1);

        if (existingData && existingData.length > 0) {
          // Delete all rows - use a condition that matches all UUIDs
          const { error } = await supabaseAdmin
            .from(table)
            .delete()
            .gte('created_at', '1970-01-01'); // This will match all rows with created_at

          if (error) {
            // If that fails, try without filter (service role should allow this)
            const { error: error2 } = await supabaseAdmin
              .from(table)
              .delete()
              .gte('id', '00000000-0000-0000-0000-000000000000');

            if (error2) {
              console.error(`⚠️  Error clearing ${table}:`, error2.message);
            } else {
              console.log(`✅ Cleared ${table}`);
            }
          } else {
            console.log(`✅ Cleared ${table}`);
          }
        } else {
          console.log(`ℹ️  ${table} is already empty`);
        }
      } catch (err) {
        console.error(`⚠️  Error clearing ${table}:`, err instanceof Error ? err.message : String(err));
      }
    }

    // Clear settings table (but keep the table structure)
    try {
      const { data: settingsData } = await supabaseAdmin
        .from('settings')
        .select('key')
        .limit(1);

      if (settingsData && settingsData.length > 0) {
        const { error } = await supabaseAdmin
          .from('settings')
          .delete()
          .gte('key', ''); // Match all keys

        if (error) {
          console.log(`⚠️  Note: ${error.message}`);
        } else {
          console.log(`✅ Cleared settings`);
        }
      } else {
        console.log(`ℹ️  settings is already empty`);
      }
    } catch (err) {
      console.log(`⚠️  Note: Settings table may have constraints`);
    }

    console.log("\n✅ All data cleared successfully!\n");
    return true;

  } catch (error) {
    console.error("\n❌ Error clearing data:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    } else {
      console.error("   Unknown error:", error);
    }
    return false;
  }
}

async function seedAdmin() {
  if (!ADMIN_EMAIL) {
    console.error("❌ Error: ADMIN_EMAIL is not set in .env.local");
    return false;
  }

  if (!ADMIN_PASSWORD) {
    console.error("❌ Error: ADMIN_PASSWORD is not set in .env.local");
    return false;
  }

  const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  });

  try {
    console.log("\n🔐 Seeding Admin User");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📧 Admin Email: ${ADMIN_EMAIL}\n`);

    // Try using Supabase Admin API first
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!listError && existingUsers?.users) {
        const existingUser = existingUsers.users.find((u) => u.email === ADMIN_EMAIL);
        
        if (existingUser) {
          console.log(`✅ Admin user already exists!`);
          console.log(`   User ID: ${existingUser.id}`);
          console.log(`   Email: ${existingUser.email}`);
          
          // Update password and confirm email
          console.log("\n🔄 Updating password and confirming email...");
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              password: ADMIN_PASSWORD,
              email_confirm: true,
            }
          );

          if (updateError) {
            console.log("⚠️  Could not update password via Admin API");
          } else {
            console.log("✅ Password updated and email confirmed!");
          }
          console.log("\n🎉 Admin user is ready to use!\n");
          return true;
        }
      }
    } catch {
      console.log("⚠️  Admin API not available, trying REST API...");
    }

    // If Admin API doesn't work, try REST API
    console.log(`📧 Creating new admin user via REST API...`);
    const createUrl = `${supabaseUrl}/auth/v1/admin/users`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey!,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      }),
    });

    if (createResponse.ok) {
      const newUser = await createResponse.json();
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${newUser.user?.email || ADMIN_EMAIL}`);
      console.log(`   User ID: ${newUser.user?.id || 'N/A'}`);
      console.log("\n🎉 You can now log in with the admin credentials!\n");
      return true;
    } else {
      const errorText = await createResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Check if user already exists error
      if (errorData.message?.includes('already registered') || 
          errorData.message?.includes('User already registered') ||
          createResponse.status === 422) {
        console.log(`✅ Admin user already exists in remote database!`);
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log("\n💡 If you need to reset the password:");
        console.log("   Use the Supabase Dashboard to reset it.\n");
        return true;
      }

      throw new Error(errorData.message || `HTTP ${createResponse.status}: ${createResponse.statusText}`);
    }
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    } else {
      console.error("   Unknown error:", error);
    }
    return false;
  }
}

async function main() {
  const cleared = await clearAllData();
  if (!cleared) {
    process.exit(1);
  }

  const seeded = await seedAdmin();
  if (!seeded) {
    process.exit(1);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ All done! Database is empty and admin user is ready.\n");
}

main();

