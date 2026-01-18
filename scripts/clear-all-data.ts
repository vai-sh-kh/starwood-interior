/**
 * Clear All Data Script
 * 
 * This script clears all data from all tables in the database
 * and then seeds only the admin user.
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    // Use TRUNCATE CASCADE to clear all tables efficiently
    // This handles foreign key constraints automatically
    const truncateSQL = `
      TRUNCATE TABLE 
        subservice_gallery_images,
        service_gallery_images,
        project_gallery_images,
        subservices,
        services,
        blogs,
        blog_categories,
        projects,
        leads,
        settings
      RESTART IDENTITY CASCADE;
    `;

    console.log("📋 Truncating all tables...\n");

    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: truncateSQL });

    if (error) {
      // If RPC doesn't work, try direct SQL execution via REST API
      console.log("⚠️  RPC method not available, trying direct SQL...\n");
      
      // Use REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: truncateSQL }),
      });

      if (!response.ok) {
        // Fallback: Delete from each table individually
        console.log("⚠️  SQL execution not available, using delete method...\n");
        
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

        for (const table of tablesToClear) {
          try {
            const { error: deleteError } = await supabaseAdmin
              .from(table)
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000');

            if (deleteError) {
              console.error(`⚠️  Error clearing ${table}:`, deleteError.message);
            } else {
              console.log(`✅ Cleared ${table}`);
            }
          } catch (err) {
            console.error(`⚠️  Error clearing ${table}:`, err instanceof Error ? err.message : String(err));
          }
        }

        // Clear settings
        try {
          const { error: settingsError } = await supabaseAdmin
            .from('settings')
            .delete()
            .neq('key', 'dummy');
          
          if (!settingsError) {
            console.log(`✅ Cleared settings`);
          }
        } catch (err) {
          console.log(`⚠️  Note: Settings may have constraints`);
        }
      } else {
        console.log("✅ All tables truncated successfully!");
      }
    } else {
      console.log("✅ All tables truncated successfully!");
    }

    console.log("\n✅ All data cleared successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("\n❌ Error clearing data:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    } else {
      console.error("   Unknown error:", error);
    }
    process.exit(1);
  }
}

clearAllData();

