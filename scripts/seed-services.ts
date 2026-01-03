/**
 * Seed Services Script
 * Adds 12 services with images to the database
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

const services = [
  {
    title: "Residential Architecture",
    slug: "residential-architecture",
    description: "Custom home design and architectural services for residential properties.",
    content: "<p>Our residential architecture services focus on creating beautiful, functional homes tailored to your lifestyle. From initial concept to final construction documents, we guide you through every step of the design process.</p><p>We specialize in modern, sustainable, and luxury residential design that reflects your unique vision and needs.</p>",
    image: "/images/home-service-1.png",
    status: "published",
    is_new: true,
    tags: ["architecture", "residential", "custom-homes"],
    meta_title: "Residential Architecture Services - Custom Home Design",
    meta_description: "Expert residential architecture services for custom homes and residential properties.",
  },
  {
    title: "Interior Design",
    slug: "interior-design",
    description: "Complete interior design services to transform your living spaces.",
    content: "<p>Our interior design team creates stunning, functional spaces that reflect your personality and lifestyle. We handle everything from space planning to furniture selection and styling.</p><p>Whether you're renovating a single room or designing an entire home, we bring your vision to life with attention to detail and expert craftsmanship.</p>",
    image: "/images/home-service-2.png",
    status: "published",
    is_new: true,
    tags: ["interior-design", "decor", "styling"],
    meta_title: "Interior Design Services - Transform Your Space",
    meta_description: "Professional interior design services to create beautiful, functional living spaces.",
  },
  {
    title: "Commercial Architecture",
    slug: "commercial-architecture",
    description: "Professional architectural services for commercial and office buildings.",
    content: "<p>We design commercial spaces that enhance productivity, reflect your brand, and create positive experiences for employees and customers. Our commercial architecture services include office buildings, retail spaces, and mixed-use developments.</p><p>We understand the unique requirements of commercial projects and deliver designs that are both functional and inspiring.</p>",
    image: "/images/home-service-3.png",
    status: "published",
    is_new: false,
    tags: ["architecture", "commercial", "office"],
    meta_title: "Commercial Architecture Services - Office & Retail Design",
    meta_description: "Expert commercial architecture services for office buildings and retail spaces.",
  },
  {
    title: "Home Renovation",
    slug: "home-renovation",
    description: "Complete home renovation services to update and modernize your property.",
    content: "<p>Transform your existing home with our comprehensive renovation services. We handle everything from design and planning to project management and execution.</p><p>Our renovation projects preserve the character of your home while introducing modern amenities, improved functionality, and updated aesthetics.</p>",
    image: "/images/home-service-4.png",
    status: "published",
    is_new: false,
    tags: ["renovation", "home-improvement", "remodeling"],
    meta_title: "Home Renovation Services - Transform Your Home",
    meta_description: "Complete home renovation services to update and modernize your property.",
  },
  {
    title: "Landscape Design",
    slug: "landscape-design",
    description: "Beautiful landscape design to create stunning outdoor living spaces.",
    content: "<p>Our landscape design services create outdoor spaces that extend your living area and connect you with nature. We design gardens, patios, outdoor kitchens, and complete landscape transformations.</p><p>From small urban gardens to expansive estate landscapes, we create outdoor environments that are both beautiful and functional.</p>",
    image: "/images/home-service-5.png",
    status: "published",
    is_new: true,
    tags: ["landscaping", "outdoor", "garden-design"],
    meta_title: "Landscape Design Services - Outdoor Living Spaces",
    meta_description: "Professional landscape design services to create beautiful outdoor environments.",
  },
  {
    title: "Sustainable Design",
    slug: "sustainable-design",
    description: "Eco-friendly design solutions for environmentally conscious projects.",
    content: "<p>Our sustainable design services focus on creating buildings and spaces that minimize environmental impact while maximizing efficiency and comfort. We incorporate green building practices, renewable energy, and sustainable materials.</p><p>From LEED certification to net-zero energy homes, we help you build sustainably without compromising on design or functionality.</p>",
    image: "/images/home-service-6.png",
    status: "published",
    is_new: false,
    tags: ["sustainability", "green-building", "eco-friendly"],
    meta_title: "Sustainable Design Services - Eco-Friendly Architecture",
    meta_description: "Expert sustainable design services for environmentally conscious building projects.",
  },
  {
    title: "Luxury Home Design",
    slug: "luxury-home-design",
    description: "Bespoke luxury home design services for high-end residential projects.",
    content: "<p>We specialize in creating exceptional luxury homes that combine architectural excellence with sophisticated interior design. Our luxury projects feature premium materials, custom finishes, and attention to every detail.</p><p>From penthouses to estates, we create homes that reflect your lifestyle and exceed your expectations.</p>",
    image: "/images/home-service-1.png",
    status: "published",
    is_new: true,
    tags: ["luxury", "residential", "high-end"],
    meta_title: "Luxury Home Design Services - Bespoke Residential",
    meta_description: "Bespoke luxury home design services for high-end residential properties.",
  },
  {
    title: "Space Planning",
    slug: "space-planning",
    description: "Expert space planning to maximize functionality and flow in your spaces.",
    content: "<p>Effective space planning is the foundation of great design. Our space planning services analyze your needs and create layouts that maximize functionality, improve flow, and enhance your daily life.</p><p>We work with residential and commercial clients to optimize space usage and create environments that work perfectly for their specific needs.</p>",
    image: "/images/home-service-2.png",
    status: "published",
    is_new: false,
    tags: ["space-planning", "layout", "design"],
    meta_title: "Space Planning Services - Optimize Your Layout",
    meta_description: "Expert space planning services to maximize functionality and flow in your spaces.",
  },
  {
    title: "Kitchen Design",
    slug: "kitchen-design",
    description: "Custom kitchen design services to create your dream culinary space.",
    content: "<p>Kitchens are the heart of the home, and our kitchen design services create spaces that are both beautiful and highly functional. We design custom kitchens that reflect your cooking style and lifestyle needs.</p><p>From layout and cabinetry to appliances and finishes, we handle every aspect of your kitchen design and renovation.</p>",
    image: "/images/home-service-3.png",
    status: "published",
    is_new: true,
    tags: ["kitchen", "renovation", "custom"],
    meta_title: "Kitchen Design Services - Custom Culinary Spaces",
    meta_description: "Custom kitchen design services to create your dream culinary space.",
  },
  {
    title: "Bathroom Design",
    slug: "bathroom-design",
    description: "Luxury bathroom design services for spa-like retreats in your home.",
    content: "<p>Transform your bathroom into a luxurious retreat with our custom bathroom design services. We create spa-like environments that combine beauty, functionality, and relaxation.</p><p>From master suites to powder rooms, we design bathrooms that enhance your daily routine and add value to your home.</p>",
    image: "/images/home-service-4.png",
    status: "published",
    is_new: false,
    tags: ["bathroom", "renovation", "luxury"],
    meta_title: "Bathroom Design Services - Luxury Spa Retreats",
    meta_description: "Luxury bathroom design services to create spa-like retreats in your home.",
  },
  {
    title: "Project Management",
    slug: "project-management",
    description: "Comprehensive project management services for construction and renovation projects.",
    content: "<p>Our project management services ensure your construction or renovation project runs smoothly from start to finish. We coordinate contractors, manage timelines, and keep your project on budget.</p><p>With years of experience managing complex projects, we handle the details so you can focus on the results.</p>",
    image: "/images/home-service-5.png",
    status: "published",
    is_new: true,
    tags: ["project-management", "construction", "coordination"],
    meta_title: "Project Management Services - Construction Coordination",
    meta_description: "Comprehensive project management services for construction and renovation projects.",
  },
  {
    title: "3D Visualization",
    slug: "3d-visualization",
    description: "Photorealistic 3D renderings and virtual tours to visualize your project.",
    content: "<p>See your project before it's built with our 3D visualization services. We create photorealistic renderings, virtual tours, and animated walkthroughs that bring your design to life.</p><p>Our 3D visualizations help you make informed decisions and share your vision with stakeholders, contractors, and clients.</p>",
    image: "/images/home-service-6.png",
    status: "published",
    is_new: false,
    tags: ["3d", "visualization", "rendering"],
    meta_title: "3D Visualization Services - Photorealistic Renderings",
    meta_description: "Professional 3D visualization services to visualize your project before construction.",
  },
];

async function seedServices() {
  console.log("\n🌱 Seeding Services");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let successCount = 0;
  let skipCount = 0;

  for (const service of services) {
    const { data, error } = await supabase
      .from("services")
      .upsert(
        {
          title: service.title,
          slug: service.slug,
          description: service.description,
          content: service.content,
          image: service.image,
          status: service.status,
          is_new: service.is_new,
          tags: service.tags,
          meta_title: service.meta_title,
          meta_description: service.meta_description,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: true,
        }
      )
      .select();

    if (error) {
      console.error(`❌ Error inserting ${service.title}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${service.title}`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${service.title} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`📊 Total: ${services.length}\n`);
}

seedServices().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

