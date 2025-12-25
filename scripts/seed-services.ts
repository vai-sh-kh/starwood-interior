/**
 * Services Seeding Script
 * 
 * This script creates 50 sample services in the database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sample service data
const serviceTitles = [
  "Complete Home Renovation",
  "Kitchen Design & Remodeling",
  "Bathroom Renovation",
  "Living Room Design",
  "Bedroom Makeover",
  "Home Office Design",
  "Interior Space Planning",
  "Color Consultation",
  "Furniture Selection & Styling",
  "Lighting Design",
  "Custom Cabinetry Design",
  "Flooring Solutions",
  "Window Treatment Design",
  "Wall Finishing & Paint",
  "Home Staging Services",
  "Commercial Interior Design",
  "Sustainable Design Solutions",
  "Luxury Interior Design",
  "Minimalist Design Services",
  "Traditional Design Revival",
  "Modern Contemporary Design",
  "Scandinavian Design",
  "Industrial Loft Design",
  "Coastal Home Design",
  "Rustic Farmhouse Design",
  "Smart Home Integration",
  "Outdoor Living Space Design",
  "Home Theater Design",
  "Wine Cellar Design",
  "Walk-in Closet Design",
  "Mudroom Organization",
  "Laundry Room Design",
  "Pantry Organization",
  "Home Gym Design",
  "Meditation Space Design",
  "Kids Room Design",
  "Nursery Design",
  "Guest Room Styling",
  "Dining Room Design",
  "Entryway Design",
  "Basement Finishing",
  "Attic Conversion",
  "Multi-Generational Home Design",
  "Accessible Design Solutions",
  "Eco-Friendly Interior Design",
  "Vintage & Retro Design",
  "Art Deco Interior Design",
  "Bohemian Style Design",
  "Mid-Century Modern Design",
  "Transitional Design",
  "Contemporary Luxury Design"
];

const serviceDescriptions = [
  "Transform your entire home with our comprehensive renovation services. From concept to completion, we handle every detail.",
  "Create the kitchen of your dreams with our expert design and remodeling services. Functional, beautiful, and tailored to your lifestyle.",
  "Upgrade your bathroom into a spa-like retreat. We specialize in luxury bathroom renovations with attention to every detail.",
  "Design a living room that reflects your style and meets your family's needs. Comfort meets elegance.",
  "Transform your bedroom into a peaceful sanctuary. We create serene spaces that promote rest and relaxation.",
  "Design a productive and inspiring home office. Balance functionality with style for the perfect work-from-home environment.",
  "Optimize your space with professional interior space planning. Maximize functionality while maintaining aesthetic appeal.",
  "Expert color consultation to create the perfect palette for your home. Colors that reflect your personality and enhance your space.",
  "Curated furniture selection and styling services. We help you choose pieces that fit your style and budget.",
  "Professional lighting design to enhance ambiance and functionality. Create the perfect mood in every room.",
  "Custom cabinetry designed to fit your space perfectly. Beautiful storage solutions tailored to your needs.",
  "Comprehensive flooring solutions for every room. From hardwood to tiles, we help you choose the perfect flooring.",
  "Elegant window treatments that provide privacy, light control, and style. Custom solutions for every window.",
  "Expert wall finishing and paint services. Transform your walls with texture, color, and professional techniques.",
  "Professional home staging to showcase your property's potential. Help buyers envision themselves in your space.",
  "Commercial interior design services for offices, retail spaces, and hospitality venues. Create spaces that work.",
  "Eco-friendly and sustainable design solutions. Beautiful interiors that are kind to the environment.",
  "Luxury interior design services for discerning clients. Premium materials, exceptional craftsmanship, timeless elegance.",
  "Minimalist design that emphasizes simplicity and functionality. Less is more, beautifully executed.",
  "Traditional design with a modern twist. Classic elegance meets contemporary comfort.",
  "Modern contemporary design that's sleek, sophisticated, and timeless. Clean lines and open spaces.",
  "Scandinavian design inspired by Nordic aesthetics. Light, airy, and functional spaces.",
  "Industrial loft design with exposed elements and raw materials. Urban sophistication.",
  "Coastal home design that brings the beach indoors. Light, breezy, and relaxed.",
  "Rustic farmhouse design with warmth and character. Country charm meets modern comfort.",
  "Smart home integration with interior design. Technology seamlessly woven into beautiful spaces.",
  "Outdoor living space design to extend your home. Create beautiful outdoor rooms for relaxation and entertainment.",
  "Home theater design for the ultimate entertainment experience. Immersive audio-visual spaces.",
  "Wine cellar design for the connoisseur. Climate-controlled storage with elegant display.",
  "Walk-in closet design that's both functional and luxurious. Organized storage meets high-end design.",
  "Mudroom organization solutions. Keep your home clean and organized from the moment you enter.",
  "Laundry room design that makes chores a pleasure. Functional and beautiful utility spaces.",
  "Pantry organization and design. Maximize storage and keep your kitchen essentials organized.",
  "Home gym design that motivates. Create a fitness space you'll actually want to use.",
  "Meditation space design for peace and tranquility. A dedicated space for mindfulness and relaxation.",
  "Kids room design that grows with your child. Fun, functional, and safe spaces.",
  "Nursery design for your little one. Create a beautiful and safe space for your baby.",
  "Guest room styling that makes visitors feel welcome. Comfortable and inviting spaces.",
  "Dining room design for memorable gatherings. Create the perfect setting for meals and entertaining.",
  "Entryway design that makes a great first impression. Welcoming spaces that set the tone for your home.",
  "Basement finishing to add valuable living space. Transform unused space into functional rooms.",
  "Attic conversion to maximize your home's potential. Create additional bedrooms, offices, or playrooms.",
  "Multi-generational home design solutions. Spaces that accommodate different age groups and needs.",
  "Accessible design solutions for aging in place. Beautiful and functional spaces for all abilities.",
  "Eco-friendly interior design with sustainable materials. Green design that doesn't compromise on style.",
  "Vintage and retro design that celebrates the past. Nostalgic styles with modern functionality.",
  "Art Deco interior design with glamour and sophistication. 1920s elegance reimagined.",
  "Bohemian style design with eclectic charm. Free-spirited and artistic spaces.",
  "Mid-century modern design with retro appeal. Iconic style that never goes out of fashion.",
  "Transitional design that bridges traditional and contemporary. Timeless and versatile.",
  "Contemporary luxury design with cutting-edge style. High-end finishes and innovative design."
];

const serviceContent = [
  "<p>Our complete home renovation service transforms your entire living space from top to bottom. We work closely with you to understand your vision, lifestyle, and budget, then create a comprehensive plan that addresses every aspect of your home. From structural changes to finishing touches, we manage the entire process to ensure a seamless transformation.</p><p>Our team of experienced designers and contractors will guide you through every step, ensuring quality craftsmanship and attention to detail throughout the project.</p>",
  "<p>Kitchen design and remodeling is one of our specialties. We understand that the kitchen is the heart of the home, and we design spaces that are both beautiful and highly functional. From custom cabinetry to premium appliances, we help you create a kitchen that meets all your cooking and entertaining needs.</p><p>Our design process includes detailed space planning, material selection, and project management to ensure your dream kitchen becomes a reality.</p>",
  "<p>Transform your bathroom into a luxurious retreat with our comprehensive renovation services. We specialize in creating spa-like environments that combine functionality with elegance. From modern minimalist designs to classic traditional styles, we work with you to achieve the perfect bathroom for your home.</p><p>Our services include plumbing, electrical work, tiling, cabinetry, and all finishing details to create a cohesive and beautiful space.</p>",
  "<p>Living room design is about creating spaces where families gather, relax, and make memories. We design living rooms that balance comfort with style, functionality with aesthetics. Whether you prefer cozy and intimate or open and airy, we'll create a space that reflects your personality and lifestyle.</p><p>Our approach includes furniture selection, color schemes, lighting design, and decorative elements that come together to create a harmonious and inviting space.</p>",
  "<p>Your bedroom should be a sanctuary - a place to rest, recharge, and escape from the world. Our bedroom makeover services focus on creating peaceful, comfortable spaces that promote relaxation and restful sleep. We consider everything from color psychology to furniture placement to create the perfect bedroom environment.</p><p>We work with calming color palettes, quality bedding, proper lighting, and storage solutions to create bedrooms that are both beautiful and functional.</p>"
];

const serviceTags = [
  ["renovation", "home", "design"],
  ["kitchen", "remodeling", "cabinetry"],
  ["bathroom", "renovation", "luxury"],
  ["living-room", "furniture", "styling"],
  ["bedroom", "interior", "design"],
  ["office", "workspace", "productivity"],
  ["space-planning", "interior", "layout"],
  ["color", "consultation", "paint"],
  ["furniture", "styling", "decor"],
  ["lighting", "design", "ambiance"],
  ["cabinetry", "custom", "storage"],
  ["flooring", "hardwood", "tiles"],
  ["windows", "treatment", "curtains"],
  ["paint", "wall-finishing", "texture"],
  ["staging", "real-estate", "home"],
  ["commercial", "office", "retail"],
  ["sustainable", "eco-friendly", "green"],
  ["luxury", "premium", "high-end"],
  ["minimalist", "simple", "clean"],
  ["traditional", "classic", "elegant"],
  ["modern", "contemporary", "sleek"],
  ["scandinavian", "nordic", "minimal"],
  ["industrial", "loft", "urban"],
  ["coastal", "beach", "relaxed"],
  ["farmhouse", "rustic", "country"],
  ["smart-home", "technology", "automation"],
  ["outdoor", "patio", "landscaping"],
  ["theater", "entertainment", "media"],
  ["wine", "cellar", "storage"],
  ["closet", "organization", "storage"],
  ["mudroom", "organization", "entry"],
  ["laundry", "utility", "organization"],
  ["pantry", "kitchen", "storage"],
  ["gym", "fitness", "exercise"],
  ["meditation", "wellness", "peace"],
  ["kids", "children", "playroom"],
  ["nursery", "baby", "infant"],
  ["guest", "hospitality", "bedroom"],
  ["dining", "entertaining", "gathering"],
  ["entryway", "foyer", "welcome"],
  ["basement", "finishing", "renovation"],
  ["attic", "conversion", "expansion"],
  ["multi-generational", "family", "accessibility"],
  ["accessible", "aging-in-place", "universal-design"],
  ["eco-friendly", "sustainable", "green"],
  ["vintage", "retro", "nostalgic"],
  ["art-deco", "glamour", "1920s"],
  ["bohemian", "eclectic", "artistic"],
  ["mid-century", "modern", "retro"],
  ["transitional", "versatile", "timeless"],
  ["contemporary", "luxury", "high-end"]
];

const statuses = ["draft", "published"];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateServices(count: number, categoryIds: string[] | null) {
  const services = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < count; i++) {
    const titleIndex = i % serviceTitles.length;
    const title = serviceTitles[titleIndex];
    
    // Ensure unique slugs
    let slug = generateSlug(title);
    let slugCounter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${generateSlug(title)}-${slugCounter}`;
      slugCounter++;
    }
    usedSlugs.add(slug);

    const description = serviceDescriptions[titleIndex] || serviceDescriptions[0];
    const content = serviceContent[Math.floor(Math.random() * serviceContent.length)];
    const tags = serviceTags[titleIndex] || serviceTags[0];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isNew = Math.random() > 0.7; // 30% chance of being marked as new
    
    // Randomly assign category or leave null
    const categoryId = categoryIds && categoryIds.length > 0 && Math.random() > 0.3
      ? categoryIds[Math.floor(Math.random() * categoryIds.length)]
      : null;

    // Generate meta fields
    const metaTitle = `${title} | Interior Design Services`;
    const metaDescription = description.substring(0, 155) + (description.length > 155 ? "..." : "");

    services.push({
      title,
      slug,
      description,
      content,
      image: null, // Can be updated later with actual images
      status,
      category_id: categoryId,
      tags,
      is_new: isNew,
      meta_title: metaTitle,
      meta_description: metaDescription,
    });
  }

  return services;
}

async function seedServices() {
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
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log("\n📝 Seeding Services");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Fetch existing categories
    console.log("📋 Fetching existing categories...");
    const { data: categories, error: categoryError } = await supabaseAdmin
      .from("blog_categories")
      .select("id");

    let categoryIds: string[] | null = null;
    if (!categoryError && categories && categories.length > 0) {
      categoryIds = categories.map((cat) => cat.id);
      console.log(`✅ Found ${categoryIds.length} categories`);
    } else {
      console.log("ℹ️  No categories found, services will be created without categories");
    }

    const services = generateServices(50, categoryIds);
    console.log(`📦 Generated ${services.length} services`);

    // Insert services in batches of 10 for better performance
    const batchSize = 10;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < services.length; i += batchSize) {
      const batch = services.slice(i, i + batchSize);
      const { data, error } = await supabaseAdmin
        .from("services")
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        inserted += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${data?.length || 0} services)`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully inserted: ${inserted} services`);
    if (errors > 0) {
      console.log(`   ❌ Failed to insert: ${errors} services`);
    }
    console.log("\n🎉 Services seeding completed!\n");
  } catch (error) {
    console.error("\n❌ Error seeding services:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error("   Unknown error occurred");
    }
    console.error("\n💡 Troubleshooting:");
    console.error("   - Ensure Supabase is running: pnpm supabase:start");
    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is correct");
    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is set correctly\n");
    process.exit(1);
  }
}

seedServices();

