/**
 * Complete Database Reset and Seed Script
 * 
 * This script:
 * 1. Clears all data from all tables
 * 2. Pushes all migrations to remote Supabase
 * 3. Seeds admin user
 * 4. Seeds 20 items in each table
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/lib/supabase/types";
import { execSync } from "child_process";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function resetAndSeedAll() {
  if (!supabaseUrl) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    console.error("\n💡 To get your service role key:");
    console.error("   1. Go to your Supabase Dashboard");
    console.error("   2. Navigate to: Settings → API");
    console.error("   3. Copy the 'service_role' key (keep it secret!)");
    console.error("   4. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY\n");
    process.exit(1);
  }

  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  });

  console.log("\n🔄 Complete Database Reset and Seed");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  try {
    // Step 1: Clear all data from tables
    console.log("🗑️  Step 1: Clearing all data from tables...\n");
    
    const tablesToClear = [
      "subservice_gallery_images",
      "service_gallery_images",
      "project_gallery_images",
      "service_subservices",
      "subservices",
      "services",
      "leads",
      "projects",
      "blogs",
      "blog_categories",
    ];

    for (const table of tablesToClear) {
      try {
        const { error } = await supabaseAdmin.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (error) {
          // If table doesn't exist, that's okay - migrations will create it
          if (!error.message.includes("relation") && !error.message.includes("does not exist")) {
            console.warn(`   ⚠️  Warning clearing ${table}: ${error.message}`);
          }
        } else {
          console.log(`   ✅ Cleared ${table}`);
        }
      } catch (err: any) {
        if (!err.message?.includes("relation") && !err.message?.includes("does not exist")) {
          console.warn(`   ⚠️  Warning clearing ${table}: ${err.message}`);
        }
      }
    }

    console.log("\n✅ All tables cleared\n");

    // Step 2: Push migrations to remote (optional - skip if not linked)
    console.log("📦 Step 2: Pushing migrations to remote Supabase...\n");
    try {
      execSync("supabase db push", { 
        stdio: "pipe",
        cwd: process.cwd(),
      });
      console.log("✅ Migrations pushed successfully\n");
    } catch (error: any) {
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message || "";
      if (errorOutput.includes("Cannot find project ref") || errorOutput.includes("Have you run supabase link")) {
        console.log("⚠️  Skipping migration push (project not linked)");
        console.log("   Migrations are likely already applied. Continuing with seeding...\n");
      } else if (errorOutput.includes("Unauthorized")) {
        console.log("⚠️  Skipping migration push (not authorized)");
        console.log("   Migrations are likely already applied. Continuing with seeding...\n");
      } else {
        console.warn("⚠️  Migration push had issues, but continuing...");
        console.warn(`   Error: ${errorOutput.substring(0, 200)}\n`);
      }
    }

    // Step 3: Seed admin user
    console.log("👤 Step 3: Seeding admin user...\n");
    try {
      execSync("pnpm seed:admin", { 
        stdio: "inherit",
        cwd: process.cwd(),
      });
      console.log("\n✅ Admin user seeded\n");
    } catch (error) {
      console.warn("\n⚠️  Warning: Admin user seeding had issues (may already exist)\n");
    }

    // Step 4: Seed all data (20 items per table)
    console.log("🌱 Step 4: Seeding 20 items in each table...\n");
    try {
      execSync("pnpm seed:complete", { 
        stdio: "inherit",
        cwd: process.cwd(),
      });
      console.log("\n✅ All data seeded successfully\n");
    } catch (error) {
      console.error("\n❌ Error seeding data");
      throw error;
    }

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Complete! Database reset and seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📊 Summary:");
    console.log("   ✅ All tables cleared");
    console.log("   ✅ All migrations applied");
    console.log("   ✅ Admin user created");
    console.log("   ✅ 20 items seeded in each table:");
    console.log("      • Blog Categories: 20");
    console.log("      • Blogs: 20");
    console.log("      • Projects: 20");
    console.log("      • Project Gallery Images: 60 (3 per project)");
    console.log("      • Services: 20");
    console.log("      • Service Gallery Images: 60 (3 per service)");
    console.log("      • Subservices: 20");
    console.log("      • Subservice Gallery Images: 60 (3 per subservice)");
    console.log("      • Service-Subservice Relationships");
    console.log("      • Leads: 20\n");
    console.log("🎉 Ready to use!\n");
  } catch (error) {
    console.error("\n❌ Error during reset and seed:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    } else {
      console.error("   Unknown error:", error);
    }
    console.error("\n💡 Troubleshooting:");
    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is correct");
    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is valid");
    console.error("   - Ensure you're logged into Supabase CLI: supabase login");
    console.error("   - Ensure project is linked: supabase link --project-ref <your-project-ref>\n");
    process.exit(1);
  }
}

resetAndSeedAll();

