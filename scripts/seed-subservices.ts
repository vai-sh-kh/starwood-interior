/**
 * Seed Subservices Script
 * Adds 12 subservices with images to the database
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

// Subservices with their parent service slugs
const subservices = [
  {
    title: "Custom Home Design",
    slug: "custom-home-design",
    description: "Bespoke residential home design tailored to your lifestyle and preferences.",
    content: "<p>Our custom home design service creates unique residential properties that perfectly match your vision. We work closely with you to understand your needs, lifestyle, and aesthetic preferences.</p><p>From initial concept to detailed construction documents, we guide you through every step of the design process.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "residential-architecture",
    is_new: true,
    meta_title: "Custom Home Design - Bespoke Residential",
    meta_description: "Bespoke custom home design services tailored to your lifestyle and preferences.",
  },
  {
    title: "Home Addition Design",
    slug: "home-addition-design",
    description: "Expert design services for home additions and extensions.",
    content: "<p>Expand your living space with our home addition design services. We create seamless additions that blend with your existing home while providing the extra space you need.</p><p>Whether you need more bedrooms, a larger kitchen, or a home office, we design additions that enhance your home's functionality and value.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "residential-architecture",
    is_new: false,
    meta_title: "Home Addition Design - Expand Your Space",
    meta_description: "Expert design services for home additions and extensions.",
  },
  {
    title: "Color Consultation",
    slug: "color-consultation",
    description: "Professional color consultation to create harmonious color schemes for your space.",
    content: "<p>Color has a powerful impact on mood and atmosphere. Our color consultation service helps you choose the perfect color palette for your home or commercial space.</p><p>We consider lighting, architecture, and your personal style to create color schemes that enhance your space and reflect your personality.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "interior-design",
    is_new: true,
    meta_title: "Color Consultation - Perfect Color Schemes",
    meta_description: "Professional color consultation services for harmonious color schemes.",
  },
  {
    title: "Furniture Selection",
    slug: "furniture-selection",
    description: "Curated furniture selection services to furnish your space beautifully.",
    content: "<p>Finding the right furniture can be overwhelming. Our furniture selection service takes the guesswork out of furnishing your space. We curate pieces that match your style, fit your space, and meet your budget.</p><p>From sourcing to delivery and styling, we handle every aspect of furnishing your home or office.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "interior-design",
    is_new: false,
    meta_title: "Furniture Selection - Curated Furnishings",
    meta_description: "Professional furniture selection services to beautifully furnish your space.",
  },
  {
    title: "Lighting Design",
    slug: "lighting-design",
    description: "Expert lighting design to create ambiance and functionality in your spaces.",
    content: "<p>Lighting is one of the most important elements of interior design. Our lighting design service creates layered lighting schemes that enhance ambiance, improve functionality, and highlight architectural features.</p><p>We design lighting for residential and commercial spaces, considering both aesthetics and energy efficiency.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "interior-design",
    is_new: true,
    meta_title: "Lighting Design - Ambient & Functional",
    meta_description: "Expert lighting design services to create perfect ambiance and functionality.",
  },
  {
    title: "Retail Space Design",
    slug: "retail-space-design",
    description: "Commercial retail design services to create engaging shopping experiences.",
    content: "<p>Retail spaces need to attract customers and encourage sales. Our retail design services create environments that reflect your brand, enhance the shopping experience, and drive business results.</p><p>From boutique stores to large retail chains, we design spaces that connect with customers and support your business goals.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "commercial-architecture",
    is_new: false,
    meta_title: "Retail Space Design - Engaging Shopping",
    meta_description: "Commercial retail design services to create engaging shopping experiences.",
  },
  {
    title: "Restaurant Design",
    slug: "restaurant-design",
    description: "Hospitality design services for restaurants, cafes, and dining establishments.",
    content: "<p>Restaurant design is about creating memorable dining experiences. Our restaurant design services consider flow, ambiance, and functionality to create spaces where guests want to return.</p><p>We design everything from intimate cafes to upscale restaurants, always focusing on the guest experience and operational efficiency.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "commercial-architecture",
    is_new: true,
    meta_title: "Restaurant Design - Memorable Dining",
    meta_description: "Hospitality design services for restaurants and dining establishments.",
  },
  {
    title: "Outdoor Kitchen Design",
    slug: "outdoor-kitchen-design",
    description: "Custom outdoor kitchen design for al fresco dining and entertaining.",
    content: "<p>Extend your living space outdoors with a custom outdoor kitchen. Our outdoor kitchen design service creates functional, beautiful spaces for cooking and entertaining in your backyard.</p><p>We design outdoor kitchens that work with your climate, lifestyle, and entertaining needs, creating the perfect space for outdoor dining.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "landscape-design",
    is_new: false,
    meta_title: "Outdoor Kitchen Design - Al Fresco Living",
    meta_description: "Custom outdoor kitchen design services for outdoor dining and entertaining.",
  },
  {
    title: "Home Office Design",
    slug: "home-office-design",
    description: "Productive home office design for remote work and productivity.",
    content: "<p>Create a productive home office with our specialized design services. We design home offices that support focus, creativity, and work-life balance.</p><p>From dedicated office rooms to flexible workspaces, we create home offices that enhance your productivity and reflect your professional style.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "home-renovation",
    is_new: true,
    meta_title: "Home Office Design - Productive Workspaces",
    meta_description: "Productive home office design services for remote work and productivity.",
  },
  {
    title: "Wine Cellar Design",
    slug: "wine-cellar-design",
    description: "Luxury wine cellar design for wine enthusiasts and collectors.",
    content: "<p>Store and display your wine collection in style with our custom wine cellar design services. We create wine cellars that combine proper storage conditions with beautiful design.</p><p>From small wine closets to expansive cellars, we design spaces that protect your collection while creating an impressive display.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "luxury-home-design",
    is_new: false,
    meta_title: "Wine Cellar Design - Luxury Storage",
    meta_description: "Luxury wine cellar design services for wine enthusiasts and collectors.",
  },
  {
    title: "Home Theater Design",
    slug: "home-theater-design",
    description: "Immersive home theater design for the ultimate entertainment experience.",
    content: "<p>Create the ultimate entertainment space with our home theater design services. We design home theaters that rival commercial cinemas, with perfect acoustics, optimal viewing angles, and luxurious comfort.</p><p>From dedicated theater rooms to multi-purpose media spaces, we create entertainment environments that enhance your movie-watching experience.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "luxury-home-design",
    is_new: true,
    meta_title: "Home Theater Design - Ultimate Entertainment",
    meta_description: "Immersive home theater design services for the ultimate entertainment experience.",
  },
  {
    title: "Garden Design",
    slug: "garden-design",
    description: "Beautiful garden design to create stunning outdoor landscapes.",
    content: "<p>Transform your outdoor space with our garden design services. We create beautiful, functional gardens that reflect your style and enhance your property.</p><p>From formal gardens to natural landscapes, we design outdoor spaces that provide beauty, privacy, and enjoyment throughout the seasons.</p>",
    image: "/images/service-detail.png",
    status: "published",
    parent_service_slug: "landscape-design",
    is_new: false,
    meta_title: "Garden Design - Stunning Landscapes",
    meta_description: "Beautiful garden design services to create stunning outdoor landscapes.",
  },
];

async function seedSubservices() {
  console.log("\n🌱 Seeding Subservices");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // First, fetch all services to get their IDs
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, slug");

  if (servicesError) {
    console.error("❌ Error fetching services:", servicesError.message);
    process.exit(1);
  }

  const serviceMap = new Map(services?.map((s) => [s.slug, s.id]) || []);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const subservice of subservices) {
    const parentServiceId = serviceMap.get(subservice.parent_service_slug);

    if (!parentServiceId) {
      console.error(`❌ Parent service not found: ${subservice.parent_service_slug} for ${subservice.title}`);
      errorCount++;
      continue;
    }

    const { data, error } = await supabase
      .from("subservices")
      .upsert(
        {
          title: subservice.title,
          slug: subservice.slug,
          description: subservice.description,
          content: subservice.content,
          image: subservice.image,
          status: subservice.status,
          parent_service_id: parentServiceId,
          is_new: subservice.is_new,
          meta_title: subservice.meta_title,
          meta_description: subservice.meta_description,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error(`❌ Error inserting ${subservice.title}:`, error.message);
      errorCount++;
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${subservice.title} (Parent: ${subservice.parent_service_slug})`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${subservice.title} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total: ${subservices.length}\n`);
}

seedSubservices().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

