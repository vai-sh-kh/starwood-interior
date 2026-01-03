/**
 * Seed Blog Categories Script
 * Adds 12 blog categories to the database
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Error: Missing required environment variables");
  console.error("   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const blogCategories = [
  { name: "Architecture", slug: "architecture" },
  { name: "Interior Design", slug: "interior-design" },
  { name: "Construction", slug: "construction" },
  { name: "Renovation", slug: "renovation" },
  { name: "Landscaping", slug: "landscaping" },
  { name: "Sustainability", slug: "sustainability" },
  { name: "Design Trends", slug: "design-trends" },
  { name: "Project Showcase", slug: "project-showcase" },
  { name: "Tips & Guides", slug: "tips-guides" },
  { name: "Materials", slug: "materials" },
  { name: "Technology", slug: "technology" },
  { name: "Industry News", slug: "industry-news" },
];

async function seedBlogCategories() {
  console.log("\n🌱 Seeding Blog Categories");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let successCount = 0;
  let skipCount = 0;

  for (const category of blogCategories) {
    const { data, error } = await supabase
      .from("blog_categories")
      .upsert(
        {
          name: category.name,
          slug: category.slug,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: true,
        }
      )
      .select();

    if (error) {
      console.error(`❌ Error inserting ${category.name}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${category.name}`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${category.name} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`📊 Total: ${blogCategories.length}\n`);
}

seedBlogCategories().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

