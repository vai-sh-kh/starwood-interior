/**
 * Projects Seeding Script
 * 
 * This script removes all existing projects and creates 10 new projects.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Generate 10 projects
function generateProjects(categoryIds: string[]) {
  const projects = [
    {
      title: "Modern Downtown Loft",
      description: "A stunning modern loft in the heart of downtown, featuring open spaces and contemporary design elements.",
      content: `<h1>Modern Downtown Loft</h1>
<p>A stunning modern loft in the heart of downtown, featuring open spaces and contemporary design elements.</p>
<h2>Project Overview</h2>
<p>This 2,500 sq ft loft transformation showcases the perfect blend of industrial aesthetics with modern luxury. The open floor plan creates a seamless flow between living, dining, and kitchen areas.</p>
<h2>Design Approach</h2>
<p>We focused on maximizing natural light and creating flexible spaces that adapt to modern living. High ceilings and exposed brick walls were preserved to maintain the building's character.</p>
<h2>Key Features</h2>
<ul>
<li>Open-concept living space with 12-foot ceilings</li>
<li>Custom kitchen with quartz countertops and premium appliances</li>
<li>Master suite with walk-in closet and spa-like bathroom</li>
<li>Smart home integration throughout</li>
</ul>`,
      status: "published" as const,
      is_new: true,
      tags: ["modern", "loft", "downtown", "contemporary"],
      project_info: {
        client: "Sarah & Michael Chen",
        location: "Downtown District",
        size: "2,500 sq ft",
        completion: "2024",
        services: ["Interior Design", "Space Planning", "Custom Furniture"]
      },
      quote: "The transformation exceeded our expectations. Every detail was thoughtfully considered.",
      quote_author: "Sarah Chen"
    },
    {
      title: "Cozy Family Home",
      description: "A warm and inviting family home designed for comfort and functionality, perfect for growing families.",
      content: `<h1>Cozy Family Home</h1>
<p>A warm and inviting family home designed for comfort and functionality, perfect for growing families.</p>
<h2>Project Overview</h2>
<p>This 3,200 sq ft family home renovation focused on creating spaces that bring the family together while providing private retreats for each member.</p>
<h2>Design Approach</h2>
<p>Warm color palettes, durable materials, and flexible layouts ensure this home will grow with the family. Every room was designed with both style and practicality in mind.</p>
<h2>Key Features</h2>
<ul>
<li>Open kitchen and family room with built-in storage</li>
<li>Playroom that converts to a study as children grow</li>
<li>Master bedroom with reading nook</li>
<li>Durable, family-friendly materials throughout</li>
</ul>`,
      status: "published" as const,
      is_new: false,
      tags: ["family", "cozy", "traditional", "functional"],
      project_info: {
        client: "The Johnson Family",
        location: "Suburban Neighborhood",
        size: "3,200 sq ft",
        completion: "2023",
        services: ["Full Home Renovation", "Interior Design", "Storage Solutions"]
      },
      quote: "Our home finally feels like us. The kids love their spaces, and we love the open areas where we can all be together.",
      quote_author: "Emily Johnson"
    },
    {
      title: "Luxury Penthouse",
      description: "An elegant penthouse with panoramic city views, featuring high-end finishes and sophisticated design.",
      content: `<h1>Luxury Penthouse</h1>
<p>An elegant penthouse with panoramic city views, featuring high-end finishes and sophisticated design.</p>
<h2>Project Overview</h2>
<p>This 4,500 sq ft penthouse renovation showcases luxury living at its finest. Floor-to-ceiling windows frame breathtaking city views from every room.</p>
<h2>Design Approach</h2>
<p>We selected premium materials and custom finishes to create a sophisticated yet comfortable environment. The design emphasizes the stunning views while maintaining privacy and elegance.</p>
<h2>Key Features</h2>
<ul>
<li>Panoramic city views from every room</li>
<li>Wine cellar and tasting room</li>
<li>Home theater with state-of-the-art sound system</li>
<li>Rooftop terrace with outdoor kitchen</li>
</ul>`,
      status: "published" as const,
      is_new: true,
      tags: ["luxury", "penthouse", "elegant", "sophisticated"],
      project_info: {
        client: "Robert Martinez",
        location: "City Center",
        size: "4,500 sq ft",
        completion: "2024",
        services: ["Luxury Interior Design", "Custom Millwork", "Smart Home Integration"]
      },
      quote: "The attention to detail and quality of craftsmanship is exceptional. This is truly a one-of-a-kind space.",
      quote_author: "Robert Martinez"
    },
    {
      title: "Scandinavian Apartment",
      description: "A light-filled Scandinavian-inspired apartment featuring minimalist design and natural materials.",
      content: `<h1>Scandinavian Apartment</h1>
<p>A light-filled Scandinavian-inspired apartment featuring minimalist design and natural materials.</p>
<h2>Project Overview</h2>
<p>This 1,200 sq ft apartment renovation embraces Scandinavian design principles: simplicity, functionality, and connection to nature.</p>
<h2>Design Approach</h2>
<p>We maximized natural light and used a neutral color palette with natural wood accents. Every piece of furniture serves a purpose while maintaining aesthetic appeal.</p>
<h2>Key Features</h2>
<ul>
<li>Light oak flooring throughout</li>
<li>Minimalist kitchen with hidden storage</li>
<li>Cozy reading corner with built-in bookshelves</li>
<li>Balcony garden with herbs and plants</li>
</ul>`,
      status: "published" as const,
      is_new: false,
      tags: ["scandinavian", "minimalist", "natural", "light"],
      project_info: {
        client: "Emma Thompson",
        location: "Urban District",
        size: "1,200 sq ft",
        completion: "2023",
        services: ["Interior Design", "Space Optimization", "Custom Storage"]
      },
      quote: "The space feels so much larger and more peaceful. I love coming home to this calming environment.",
      quote_author: "Emma Thompson"
    },
    {
      title: "Industrial Warehouse Conversion",
      description: "A dramatic conversion of a historic warehouse into a modern living space with industrial charm.",
      content: `<h1>Industrial Warehouse Conversion</h1>
<p>A dramatic conversion of a historic warehouse into a modern living space with industrial charm.</p>
<h2>Project Overview</h2>
<p>This 5,000 sq ft warehouse conversion preserves the building's industrial heritage while creating a stunning modern home. Original brick walls, steel beams, and concrete floors were restored and enhanced.</p>
<h2>Design Approach</h2>
<p>We balanced raw industrial elements with warm, comfortable furnishings. The open layout allows for flexible use of space while maintaining distinct zones.</p>
<h2>Key Features</h2>
<ul>
<li>20-foot ceilings with exposed steel beams</li>
<li>Original brick walls restored and sealed</li>
<li>Concrete floors with radiant heating</li>
<li>Custom steel and glass mezzanine level</li>
</ul>`,
      status: "published" as const,
      is_new: true,
      tags: ["industrial", "warehouse", "conversion", "historic"],
      project_info: {
        client: "David & Jessica Williams",
        location: "Historic District",
        size: "5,000 sq ft",
        completion: "2024",
        services: ["Historic Renovation", "Structural Design", "Interior Design"]
      },
      quote: "They perfectly captured the industrial aesthetic we wanted while making it feel like home. Absolutely stunning work.",
      quote_author: "David Williams"
    },
    {
      title: "Minimalist Studio",
      description: "A compact studio apartment transformed into a functional and beautiful living space through smart design.",
      content: `<h1>Minimalist Studio</h1>
<p>A compact studio apartment transformed into a functional and beautiful living space through smart design.</p>
<h2>Project Overview</h2>
<p>This 600 sq ft studio demonstrates how thoughtful design can maximize small spaces. Every square inch was carefully planned to serve multiple functions.</p>
<h2>Design Approach</h2>
<p>We used multifunctional furniture, strategic storage, and visual tricks to make the space feel larger. A neutral palette with strategic pops of color creates interest without clutter.</p>
<h2>Key Features</h2>
<ul>
<li>Murphy bed with integrated storage</li>
<li>Kitchen island that doubles as dining table</li>
<li>Hidden storage throughout</li>
<li>Sliding partitions for privacy</li>
</ul>`,
      status: "published" as const,
      is_new: false,
      tags: ["minimalist", "studio", "small-space", "functional"],
      project_info: {
        client: "Alex Kim",
        location: "City Center",
        size: "600 sq ft",
        completion: "2023",
        services: ["Small Space Design", "Custom Furniture", "Space Planning"]
      },
      quote: "I can't believe how much functionality they fit into this small space. It feels twice as big now!",
      quote_author: "Alex Kim"
    },
    {
      title: "Bohemian Retreat",
      description: "A vibrant bohemian-inspired home filled with color, texture, and eclectic furnishings.",
      content: `<h1>Bohemian Retreat</h1>
<p>A vibrant bohemian-inspired home filled with color, texture, and eclectic furnishings.</p>
<h2>Project Overview</h2>
<p>This 2,800 sq ft home celebrates bohemian style with rich colors, layered textures, and a mix of vintage and modern pieces. Each room tells a story.</p>
<h2>Design Approach</h2>
<p>We curated a collection of unique pieces from around the world, mixing patterns and textures to create a warm, inviting atmosphere. Plants and natural elements bring life to every space.</p>
<h2>Key Features</h2>
<ul>
<li>Colorful Moroccan-inspired tiles in kitchen and bathroom</li>
<li>Macramé wall hangings and tapestries</li>
<li>Vintage furniture mixed with modern pieces</li>
<li>Indoor garden with hanging plants</li>
</ul>`,
      status: "published" as const,
      is_new: true,
      tags: ["bohemian", "eclectic", "colorful", "vibrant"],
      project_info: {
        client: "Maya Patel",
        location: "Arts District",
        size: "2,800 sq ft",
        completion: "2024",
        services: ["Interior Design", "Custom Textiles", "Vintage Curation"]
      },
      quote: "This space truly reflects my personality. Every corner is filled with beauty and meaning.",
      quote_author: "Maya Patel"
    },
    {
      title: "Classic Victorian",
      description: "A beautifully restored Victorian home that honors its historic character while adding modern comforts.",
      content: `<h1>Classic Victorian</h1>
<p>A beautifully restored Victorian home that honors its historic character while adding modern comforts.</p>
<h2>Project Overview</h2>
<p>This 3,500 sq ft Victorian home restoration carefully preserved original architectural details while updating systems and adding contemporary amenities.</p>
<h2>Design Approach</h2>
<p>We maintained period-appropriate details like crown molding, original fireplaces, and hardwood floors while introducing modern lighting, updated bathrooms, and a contemporary kitchen.</p>
<h2>Key Features</h2>
<ul>
<li>Restored original hardwood floors and moldings</li>
<li>Period-appropriate color palette with modern accents</li>
<li>Updated kitchen with Victorian-inspired cabinetry</li>
<li>Modern bathrooms with vintage-style fixtures</li>
</ul>`,
      status: "published" as const,
      is_new: false,
      tags: ["victorian", "historic", "restoration", "classic"],
      project_info: {
        client: "The Anderson Family",
        location: "Historic Neighborhood",
        size: "3,500 sq ft",
        completion: "2023",
        services: ["Historic Restoration", "Interior Design", "Period-Appropriate Renovation"]
      },
      quote: "They respected the home's history while making it perfect for modern living. We couldn't be happier.",
      quote_author: "James Anderson"
    },
    {
      title: "Contemporary Office Space",
      description: "A modern office space designed to inspire creativity and productivity with flexible work zones.",
      content: `<h1>Contemporary Office Space</h1>
<p>A modern office space designed to inspire creativity and productivity with flexible work zones.</p>
<h2>Project Overview</h2>
<p>This 8,000 sq ft office renovation creates a dynamic work environment with various spaces for collaboration, focus work, and relaxation.</p>
<h2>Design Approach</h2>
<p>We designed flexible zones that adapt to different work styles. Natural light, biophilic elements, and ergonomic furniture support employee wellbeing.</p>
<h2>Key Features</h2>
<ul>
<li>Open collaboration areas with flexible seating</li>
<li>Private focus pods for deep work</li>
<li>Wellness room with meditation space</li>
<li>Modern kitchen and dining area</li>
</ul>`,
      status: "published" as const,
      is_new: true,
      tags: ["office", "contemporary", "commercial", "productivity"],
      project_info: {
        client: "Tech Innovations Inc.",
        location: "Business District",
        size: "8,000 sq ft",
        completion: "2024",
        services: ["Commercial Interior Design", "Space Planning", "Workplace Strategy"]
      },
      quote: "Our team productivity has increased significantly. The space truly supports how we work.",
      quote_author: "CEO, Tech Innovations"
    },
    {
      title: "Rustic Farmhouse",
      description: "A charming farmhouse renovation that blends rustic charm with modern amenities and comfort.",
      content: `<h1>Rustic Farmhouse</h1>
<p>A charming farmhouse renovation that blends rustic charm with modern amenities and comfort.</p>
<h2>Project Overview</h2>
<p>This 2,400 sq ft farmhouse renovation celebrates rural living with reclaimed materials, vintage finds, and modern updates that make daily life comfortable.</p>
<h2>Design Approach</h2>
<p>We used reclaimed wood, vintage fixtures, and farmhouse-style elements while incorporating modern appliances, updated plumbing, and efficient heating systems.</p>
<h2>Key Features</h2>
<ul>
<li>Reclaimed wood beams and flooring</li>
<li>Farmhouse sink and vintage-style appliances</li>
<li>Cozy fireplace with stone surround</li>
<li>Wraparound porch with outdoor seating</li>
</ul>`,
      status: "published" as const,
      is_new: false,
      tags: ["rustic", "farmhouse", "charming", "country"],
      project_info: {
        client: "The Miller Family",
        location: "Countryside",
        size: "2,400 sq ft",
        completion: "2023",
        services: ["Farmhouse Renovation", "Interior Design", "Vintage Curation"]
      },
      quote: "It's everything we dreamed of - rustic charm with all the modern conveniences we need.",
      quote_author: "Lisa Miller"
    }
  ];

  // Generate slugs and assign category IDs
  const usedSlugs = new Set<string>();
  return projects.map((project) => {
    let slug = generateSlug(project.title);
    let slugCounter = 0;
    while (usedSlugs.has(slug)) {
      slugCounter++;
      slug = generateSlug(project.title) + `-${slugCounter}`;
    }
    usedSlugs.add(slug);

    return {
      ...project,
      slug,
      category_id: categoryIds.length > 0 
        ? categoryIds[Math.floor(Math.random() * categoryIds.length)] 
        : null,
    };
  });
}

async function seedProjects() {
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
  });

  try {
    console.log("\n🌱 Seeding Projects");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Step 1: Get existing categories
    console.log("📁 Fetching categories...");
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from("blog_categories")
      .select("id");

    if (categoriesError) {
      throw categoriesError;
    }

    const categoryIds = categories?.map((c) => c.id) || [];
    console.log(`✅ Found ${categoryIds.length} categories\n`);

    // Step 2: Delete all existing projects
    console.log("🗑️  Deleting all existing projects...");
    // First, get all project IDs to delete
    const { data: existingProjects, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("id");

    if (fetchError) {
      throw fetchError;
    }

    if (existingProjects && existingProjects.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from("projects")
        .delete()
        .in("id", existingProjects.map(p => p.id));

      if (deleteError) {
        throw deleteError;
      }
      console.log(`✅ Deleted ${existingProjects.length} existing projects\n`);
    } else {
      console.log("✅ No existing projects to delete\n");
    }

    // Step 3: Generate and insert 10 new projects
    console.log("🏗️  Creating 10 new projects...");
    const projects = generateProjects(categoryIds);
    
    const { data: insertedProjects, error: insertError } = await supabaseAdmin
      .from("projects")
      .insert(projects)
      .select("id, title");

    if (insertError) {
      throw insertError;
    }

    console.log("✅ Created 10 new projects:");
    insertedProjects?.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Successfully seeded projects!");
    console.log(`   • Deleted all existing projects`);
    console.log(`   • Created ${insertedProjects?.length || 0} new projects`);
    console.log("\n");
  } catch (error: any) {
    console.error("\n❌ Error seeding projects:");
    if (error) {
      console.error(`   Message: ${error.message || "Unknown error"}`);
      if (error.details) {
        console.error(`   Details: ${error.details}`);
      }
      if (error.hint) {
        console.error(`   Hint: ${error.hint}`);
      }
      if (error.code) {
        console.error(`   Code: ${error.code}`);
      }
    } else {
      console.error("   Unknown error occurred");
      console.error("   Error object:", error);
    }
    console.error("\n💡 Troubleshooting:");
    console.error("   - Ensure Supabase is running: pnpm supabase:start");
    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is correct");
    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is set correctly");
    console.error("\n");
    process.exit(1);
  }
}

seedProjects();

