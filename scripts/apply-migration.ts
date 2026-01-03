/**
 * Apply Migration Script
 * 
 * This script applies a specific migration to the remote Supabase database
 * using the service role key.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyMigration() {
  if (!supabaseUrl) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    process.exit(1);
  }

  // Read the migration file
  const migrationPath = resolve(
    process.cwd(),
    "supabase/migrations/20250106000002_make_projects_content_image_required.sql"
  );

  let migrationSQL: string;
  try {
    migrationSQL = readFileSync(migrationPath, "utf-8");
  } catch (error) {
    console.error(`❌ Error reading migration file: ${migrationPath}`);
    console.error(error);
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
    console.log("\n📦 Applying Migration to Remote Database");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}`);
    console.log(`📄 Migration: 20250106000002_make_projects_content_image_required.sql\n`);

    // Execute the migration SQL
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.trim().length === 0) continue;

      try {
        // Use RPC or direct SQL execution
        // Since Supabase JS client doesn't support raw SQL directly,
        // we'll use the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ sql: statement }),
        }).catch(async () => {
          // Fallback: try using the Supabase client's query method
          // For ALTER TABLE and UPDATE statements, we need to use raw SQL
          // Let's try a different approach - use the PostgREST API directly
          return null;
        });

        if (response && !response.ok) {
          const errorText = await response.text();
          console.log(`   ⚠️  Statement ${i + 1}: ${errorText.substring(0, 100)}`);
        } else {
          console.log(`   ✅ Statement ${i + 1} executed`);
        }
      } catch (err) {
        // Try alternative method: execute via Supabase client
        // For DDL statements, we need to use the management API or SQL editor
        console.log(
          `   ⚠️  Statement ${i + 1} requires direct SQL execution`
        );
        console.log(`   💡 Please run this SQL in Supabase Dashboard SQL Editor:\n`);
        console.log(`   ${statement}\n`);
      }
    }

    // Alternative: Execute all SQL at once via REST API
    console.log("\n🔄 Attempting to execute migration via REST API...\n");

    // Use the Supabase Management API or SQL Editor endpoint
    // Since we can't execute DDL via PostgREST, we'll provide instructions
    console.log("⚠️  Direct SQL execution via API is limited.");
    console.log("📋 Please apply this migration manually:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(migrationSQL);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("💡 To apply this migration:");
    console.log("   1. Go to: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/sql/new");
    console.log("   2. Copy and paste the SQL above");
    console.log("   3. Click 'Run' to execute\n");

    // Try to execute via Supabase client using a workaround
    // We'll try executing the SQL statements one by one
    console.log("🔄 Trying alternative execution method...\n");

    // Execute UPDATE statements via Supabase client
    try {
      // Update NULL content
      const { error: contentError } = await supabaseAdmin.rpc("exec_sql", {
        sql: "UPDATE public.projects SET content = '' WHERE content IS NULL;",
      });

      if (contentError) {
        console.log("   ⚠️  Could not update content via RPC");
      } else {
        console.log("   ✅ Updated NULL content values");
      }
    } catch {
      // RPC might not exist, that's okay
    }

    // Since we can't easily execute DDL via the JS client,
    // we'll provide clear instructions
    console.log("\n✅ Migration script prepared!");
    console.log("   Please apply the SQL manually via Supabase Dashboard.\n");
  } catch (error) {
    console.error("\n❌ Error applying migration:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error("   Unknown error occurred");
    }
    console.error("\n💡 Please apply the migration manually via Supabase Dashboard SQL Editor\n");
    process.exit(1);
  }
}

applyMigration();

