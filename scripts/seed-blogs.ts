/**
 * Seed Blogs Script
 * Adds 12 blog posts with images to the database
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

const blogs = [
  {
    title: "Modern Architecture Trends for 2025",
    slug: "modern-architecture-trends-2025",
    excerpt: "Discover the latest architectural trends shaping the future of design and construction.",
    content: "<p>Modern architecture continues to evolve with innovative designs that blend functionality with aesthetic appeal. In 2025, we are seeing a shift towards sustainable materials, smart home integration, and biophilic design principles that connect buildings with nature.</p><p>Architects are increasingly focusing on creating spaces that are not only beautiful but also environmentally responsible and energy-efficient.</p>",
    image: "/images/blog-main.png",
    author: "Sarah Johnson",
    category_slug: "architecture",
    tags: ["architecture", "trends", "2025", "design"],
  },
  {
    title: "Interior Design: Creating Cozy Living Spaces",
    slug: "interior-design-cozy-living-spaces",
    excerpt: "Learn how to transform your home into a warm and inviting sanctuary with these interior design tips.",
    content: "<p>Creating a cozy living space is all about balance between comfort and style. Start with a neutral color palette, add texture through fabrics and materials, and incorporate personal touches that reflect your personality.</p><p>Lighting plays a crucial role in setting the mood, so consider layered lighting with ambient, task, and accent lights.</p>",
    image: "/images/blog_detail.png",
    author: "Michael Chen",
    category_slug: "interior-design",
    tags: ["interior-design", "home-decor", "living-spaces", "tips"],
  },
  {
    title: "Sustainable Construction Practices",
    slug: "sustainable-construction-practices",
    excerpt: "Explore eco-friendly construction methods that reduce environmental impact while maintaining quality.",
    content: "<p>Sustainable construction is no longer optional—it is essential for the future of our planet. This article explores green building materials, energy-efficient systems, and waste reduction strategies.</p><p>From recycled materials to renewable energy integration, discover how modern construction can be both environmentally responsible and cost-effective.</p>",
    image: "/images/blog-main.png",
    author: "Emily Rodriguez",
    category_slug: "construction",
    tags: ["sustainability", "construction", "green-building", "eco-friendly"],
  },
  {
    title: "Complete Home Renovation Guide",
    slug: "complete-home-renovation-guide",
    excerpt: "A comprehensive guide to planning and executing a successful home renovation project.",
    content: "<p>Renovating your home can be an exciting yet overwhelming process. This guide covers everything from initial planning and budgeting to selecting contractors and managing timelines.</p><p>Learn about common pitfalls to avoid and how to maximize your renovation budget while achieving your dream home.</p>",
    image: "/images/blog_detail.png",
    author: "David Thompson",
    category_slug: "renovation",
    tags: ["renovation", "home-improvement", "guide", "planning"],
  },
  {
    title: "Landscaping Ideas for Small Spaces",
    slug: "landscaping-ideas-small-spaces",
    excerpt: "Transform small outdoor areas into beautiful, functional landscapes with these creative ideas.",
    content: "<p>Small spaces don't have to limit your landscaping dreams. Vertical gardens, container planting, and multi-functional furniture can maximize your outdoor area.</p><p>This article provides practical tips and design inspiration for creating stunning landscapes in compact spaces.</p>",
    image: "/images/blog-main.png",
    author: "Lisa Anderson",
    category_slug: "landscaping",
    tags: ["landscaping", "small-spaces", "garden-design", "outdoor"],
  },
  {
    title: "Green Building Materials: A Complete Overview",
    slug: "green-building-materials-overview",
    excerpt: "Discover sustainable building materials that are revolutionizing the construction industry.",
    content: "<p>The construction industry is embracing eco-friendly materials that reduce environmental impact. From bamboo and reclaimed wood to recycled steel and low-VOC paints, there are numerous options available.</p><p>Learn about the benefits, costs, and applications of these sustainable materials in modern construction projects.</p>",
    image: "/images/blog_detail.png",
    author: "James Wilson",
    category_slug: "sustainability",
    tags: ["sustainability", "materials", "green-building", "eco-friendly"],
  },
  {
    title: "Top Design Trends for Modern Homes",
    slug: "top-design-trends-modern-homes",
    excerpt: "Stay ahead of the curve with the latest design trends transforming modern residential spaces.",
    content: "<p>Design trends are constantly evolving, and 2025 brings exciting new directions. Minimalism meets maximalism, natural materials take center stage, and smart home technology becomes seamlessly integrated.</p><p>Explore color palettes, furniture styles, and architectural elements that define contemporary home design.</p>",
    image: "/images/blog-main.png",
    author: "Rachel Martinez",
    category_slug: "design-trends",
    tags: ["design-trends", "modern-homes", "interior-design", "2025"],
  },
  {
    title: "Luxury Villa Project Showcase",
    slug: "luxury-villa-project-showcase",
    excerpt: "Take a tour of our latest luxury villa project featuring cutting-edge design and premium finishes.",
    content: "<p>This stunning luxury villa represents the pinnacle of modern architectural design. With over 8,000 square feet of living space, the property features floor-to-ceiling windows, a rooftop terrace, and state-of-the-art amenities.</p><p>Discover the design process, material selections, and unique features that make this project exceptional.</p>",
    image: "/images/blog_detail.png",
    author: "Robert Kim",
    category_slug: "project-showcase",
    tags: ["project-showcase", "luxury", "villa", "architecture"],
  },
  {
    title: "10 Essential Tips for First-Time Homeowners",
    slug: "essential-tips-first-time-homeowners",
    excerpt: "Navigate homeownership with confidence using these essential tips and expert advice.",
    content: "<p>Becoming a homeowner is an exciting milestone, but it comes with responsibilities. This guide covers maintenance schedules, budgeting for repairs, insurance considerations, and when to call professionals.</p><p>Learn from experienced homeowners and industry experts to avoid common mistakes and protect your investment.</p>",
    image: "/images/blog-main.png",
    author: "Amanda Foster",
    category_slug: "tips-guides",
    tags: ["tips", "homeownership", "guide", "first-time-buyers"],
  },
  {
    title: "Choosing the Right Materials for Your Project",
    slug: "choosing-right-materials-project",
    excerpt: "A detailed guide to selecting materials that balance aesthetics, durability, and budget.",
    content: "<p>Material selection is one of the most critical decisions in any construction or renovation project. This article compares different material options, their pros and cons, and cost considerations.</p><p>From flooring and countertops to roofing and siding, make informed decisions that will stand the test of time.</p>",
    image: "/images/blog_detail.png",
    author: "Christopher Lee",
    category_slug: "materials",
    tags: ["materials", "selection", "construction", "guide"],
  },
  {
    title: "Smart Home Technology Integration",
    slug: "smart-home-technology-integration",
    excerpt: "Explore how smart home technology is revolutionizing modern living spaces.",
    content: "<p>Smart home technology is transforming how we interact with our living spaces. From automated lighting and climate control to security systems and voice assistants, the possibilities are endless.</p><p>This article covers the latest smart home innovations, installation considerations, and how to create a connected home ecosystem.</p>",
    image: "/images/blog-main.png",
    author: "Jennifer Park",
    category_slug: "technology",
    tags: ["technology", "smart-home", "automation", "innovation"],
  },
  {
    title: "Industry News: Construction Sector Growth",
    slug: "industry-news-construction-sector-growth",
    excerpt: "Latest updates on construction industry trends, market growth, and future projections.",
    content: "<p>The construction industry is experiencing significant growth with new projects and investments across residential, commercial, and infrastructure sectors. This article analyzes market trends, regulatory changes, and emerging opportunities.</p><p>Stay informed about industry developments that could impact your projects and business decisions.</p>",
    image: "/images/blog_detail.png",
    author: "Thomas Brown",
    category_slug: "industry-news",
    tags: ["industry-news", "construction", "market-trends", "business"],
  },
];

async function seedBlogs() {
  console.log("\n🌱 Seeding Blogs");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // First, get all category IDs
  const { data: categories, error: catError } = await supabase
    .from("blog_categories")
    .select("id, slug");

  if (catError) {
    console.error("❌ Error fetching categories:", catError.message);
    process.exit(1);
  }

  const categoryMap = new Map(categories?.map((cat) => [cat.slug, cat.id]) || []);

  let successCount = 0;
  let skipCount = 0;

  for (const blog of blogs) {
    const categoryId = categoryMap.get(blog.category_slug);

    if (!categoryId) {
      console.error(`❌ Category not found: ${blog.category_slug}`);
      continue;
    }

    const { data, error } = await supabase
      .from("blogs")
      .upsert(
        {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          image: blog.image,
          author: blog.author,
          category_id: categoryId,
          tags: blog.tags,
          archived: false,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: true,
        }
      )
      .select();

    if (error) {
      console.error(`❌ Error inserting ${blog.title}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${blog.title}`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${blog.title} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`📊 Total: ${blogs.length}\n`);
}

seedBlogs().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

