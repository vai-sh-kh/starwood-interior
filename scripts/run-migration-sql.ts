/**
 * Run Migration SQL Script
 * 
 * Executes SQL migration directly via Supabase SQL API
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigrationSQL() {
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
    process.exit(1);
  }

  try {
    console.log("\n📦 Executing Migration SQL");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}\n`);

    // Use Supabase Management API to execute SQL
    // The SQL Editor API endpoint
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    
    if (!projectId) {
      console.error("❌ Could not extract project ID from Supabase URL");
      process.exit(1);
    }

    // Try using the Supabase Management API
    // Note: This requires the Management API key, not the service role key
    // For now, we'll execute via PostgREST with individual statements
    
    // Split SQL into executable statements
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    // Execute UPDATE statements via Supabase client
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Execute UPDATE statements
    for (const statement of statements) {
      if (statement.toUpperCase().startsWith("UPDATE")) {
        // For UPDATE, we can potentially use the client, but ALTER TABLE requires direct SQL
        console.log(`   ⚠️  DDL statement requires SQL Editor: ${statement.substring(0, 50)}...`);
      }
    }

    // Since DDL statements (ALTER TABLE) can't be executed via PostgREST,
    // we need to use the Supabase Dashboard SQL Editor
    console.log("\n⚠️  DDL statements (ALTER TABLE) cannot be executed via API.");
    console.log("📋 Please apply this migration manually:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(migrationSQL);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    console.log("💡 Quick Steps:");
    console.log(`   1. Open: https://supabase.com/dashboard/project/${projectId}/sql/new`);
    console.log("   2. Copy the SQL above");
    console.log("   3. Paste into the SQL Editor");
    console.log("   4. Click 'Run' to execute\n");

    // Try to execute UPDATE statements that can be done via the client
    console.log("🔄 Attempting to execute UPDATE statements...\n");
    
    try {
      // Update NULL content
      const { data: contentData, error: contentError } = await supabase
        .from("projects")
        .update({ content: "" })
        .is("content", null)
        .select();

      if (contentError) {
        console.log(`   ⚠️  Content update: ${contentError.message}`);
      } else {
        console.log("   ✅ Updated NULL content values");
        if (contentData && Array.isArray(contentData)) {
          console.log(`      Affected rows: ${contentData.length}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️  Content update failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      // Update NULL image
      const { data: imageData, error: imageError } = await supabase
        .from("projects")
        .update({ image: "/images/default-project-image.png" })
        .is("image", null)
        .select();

      if (imageError) {
        console.log(`   ⚠️  Image update: ${imageError.message}`);
      } else {
        console.log("   ✅ Updated NULL image values");
        if (imageData && Array.isArray(imageData)) {
          console.log(`      Affected rows: ${imageData.length}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️  Image update failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    console.log("\n✅ UPDATE statements executed (if any rows existed)");
    console.log("⚠️  ALTER TABLE statements must be run manually via SQL Editor\n");
    
  } catch (error) {
    console.error("\n❌ Error:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
    console.error("\n💡 Please apply the migration manually via Supabase Dashboard SQL Editor\n");
    process.exit(1);
  }
}

runMigrationSQL();

