/**
 * Seed Service-Subservices Relationships Script
 * Links subservices to services to create relationships
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

// Define relationships: service_slug -> [subservice_slugs]
const relationships = [
  {
    service_slug: "residential-architecture",
    subservice_slugs: ["custom-home-design", "home-addition-design"],
  },
  {
    service_slug: "interior-design",
    subservice_slugs: ["color-consultation", "furniture-selection", "lighting-design"],
  },
  {
    service_slug: "commercial-architecture",
    subservice_slugs: ["retail-space-design", "restaurant-design"],
  },
  {
    service_slug: "home-renovation",
    subservice_slugs: ["home-office-design", "outdoor-kitchen-design"],
  },
  {
    service_slug: "landscape-design",
    subservice_slugs: ["garden-design", "outdoor-kitchen-design"],
  },
  {
    service_slug: "luxury-home-design",
    subservice_slugs: ["wine-cellar-design", "home-theater-design"],
  },
  {
    service_slug: "kitchen-design",
    subservice_slugs: ["outdoor-kitchen-design"],
  },
  {
    service_slug: "bathroom-design",
    subservice_slugs: ["color-consultation", "lighting-design"],
  },
];

async function seedServiceSubservices() {
  console.log("\n🌱 Seeding Service-Subservices Relationships");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Fetch all services and subservices
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, slug");

  const { data: subservices, error: subservicesError } = await supabase
    .from("subservices")
    .select("id, slug");

  if (servicesError || subservicesError) {
    console.error("❌ Error fetching services or subservices:", servicesError || subservicesError);
    process.exit(1);
  }

  const serviceMap = new Map(services?.map((s) => [s.slug, s.id]) || []);
  const subserviceMap = new Map(subservices?.map((s) => [s.slug, s.id]) || []);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const relationship of relationships) {
    const serviceId = serviceMap.get(relationship.service_slug);
    if (!serviceId) {
      console.error(`❌ Service not found: ${relationship.service_slug}`);
      errorCount++;
      continue;
    }

    for (let i = 0; i < relationship.subservice_slugs.length; i++) {
      const subserviceSlug = relationship.subservice_slugs[i];
      const subserviceId = subserviceMap.get(subserviceSlug);

      if (!subserviceId) {
        console.error(`❌ Subservice not found: ${subserviceSlug}`);
        errorCount++;
        continue;
      }

      const { data, error } = await supabase
        .from("service_subservices")
        .upsert(
          {
            service_id: serviceId,
            subservice_id: subserviceId,
            display_order: i,
          },
          {
            onConflict: "service_id,subservice_id",
            ignoreDuplicates: true,
          }
        )
        .select();

      if (error) {
        console.error(
          `❌ Error linking ${relationship.service_slug} -> ${subserviceSlug}:`,
          error.message
        );
        errorCount++;
      } else if (data && data.length > 0) {
        console.log(`✅ Linked: ${relationship.service_slug} -> ${subserviceSlug}`);
        successCount++;
      } else {
        console.log(`⏭️  Skipped: ${relationship.service_slug} -> ${subserviceSlug} (already exists)`);
        skipCount++;
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total relationships processed\n`);
}

seedServiceSubservices().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

