/**
 * Test Data Seeding Script
 * 
 * This script creates 100 test items in each table (blogs, categories, leads, projects)
 * for testing purposes. Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
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

// Generate 100 categories
function generateCategories() {
  const categories = [];
  const categoryNames = [
    "Modern Design", "Classic Style", "Minimalist", "Contemporary", "Rustic",
    "Industrial", "Scandinavian", "Bohemian", "Traditional", "Art Deco",
    "Mid-Century Modern", "Farmhouse", "Coastal", "Mediterranean", "Asian",
    "French Country", "Victorian", "Cottage", "Tropical", "Gothic",
    "Eclectic", "Transitional", "Shabby Chic", "Urban Modern", "Zen",
    "Futuristic", "Vintage", "Country", "Tuscan", "Provencal",
    "Industrial Modern", "Retro", "Boho Chic", "Maximalist", "Neoclassic",
    "Japandi", "Biophilic", "Wabi Sabi", "Hollywood Regency", "Neo-Baroque",
    "Craftsman", "Prairie", "Colonial", "Cape Cod", "Tudor",
    "Spanish", "Greek Revival", "Federal", "Georgian", "Rococo",
    "Bauhaus", "De Stijl", "Postmodern", "Art Nouveau", "Biedermeier",
    "Empire", "Regency", "Queen Anne", "Chippendale", "Sheraton",
    "Rococo Revival", "Gothic Revival", "Aesthetic Movement", "Arts and Crafts", "Jugendstil",
    "Wiener Werkstätte", "Streamline Moderne", "Rationalist", "Brutalist", "High-Tech",
    "Deconstructivist", "Critical Regionalism", "Sustainable Design", "Smart Home", "Wellness Design",
    "Universal Design", "Aging in Place", "Tiny Home", "Micro Living", "Co-Living",
    "Hospitality Design", "Healthcare Design", "Educational Spaces", "Office Design", "Retail Design",
    "Restaurant Design", "Hotel Design", "Museum Design", "Theater Design", "Library Design",
    "Sports Facilities", "Recreational Spaces", "Outdoor Living", "Garden Design", "Landscape Architecture",
    "Urban Planning", "Interior Architecture", "Space Planning", "Color Consulting", "Lighting Design"
  ];

  const usedSlugs = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const name = categoryNames[i] || `Category ${i + 1}`;
    let slug = generateSlug(name);
    let slugCounter = 0;
    while (usedSlugs.has(slug)) {
      slugCounter++;
      slug = generateSlug(name) + `-${slugCounter}`;
    }
    usedSlugs.add(slug);
    categories.push({
      name,
      slug,
    });
  }

  return categories;
}

// Generate 100 blogs
function generateBlogs(categoryIds: string[]) {
  const blogs = [];
  const authors = [
    "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Thompson", "Jessica Williams",
    "Robert Martinez", "Amanda Brown", "Christopher Lee", "Lauren Taylor", "Daniel Garcia",
    "Nicole Anderson", "Kevin White", "Rachel Green", "Mark Wilson", "Sophie Miller",
    "James Davis", "Olivia Moore", "Matthew Harris", "Emma Jackson", "Andrew Clark",
    "Isabella Lewis", "Ryan Walker", "Mia Hall", "Tyler Allen", "Ava Young",
    "Nathan King", "Chloe Wright", "Ethan Lopez", "Grace Hill", "Lucas Scott",
    "Lily Adams", "Noah Baker", "Zoe Nelson", "Logan Carter", "Hannah Mitchell",
    "Carter Perez", "Samantha Roberts", "Owen Turner", "Madison Phillips", "Jack Campbell",
    "Avery Parker", "Mason Evans", "Charlotte Edwards", "Jackson Collins", "Harper Stewart",
    "Benjamin Sanchez", "Evelyn Morris", "Liam Rogers", "Abigail Reed", "Alexander Cook",
    "Elizabeth Morgan", "Henry Bell", "Victoria Murphy", "Sebastian Bailey", "Penelope Rivera",
    "Julian Cooper", "Scarlett Richardson", "Gabriel Cox", "Luna Howard", "Ezra Ward",
    "Stella Torres", "Jaxon Peterson", "Nora Gray", "Caleb Ramirez", "Layla James",
    "Isaiah Watson", "Audrey Brooks", "Jeremiah Kelly", "Bella Sanders", "Levi Price",
    "Natalie Bennett", "Aaron Wood", "Hazel Watson", "Eli Ross", "Eleanor Diaz",
    "Lincoln Hayes", "Clara Myers", "Colton Ford", "Violet Hamilton", "Axel Graham",
    "Ivy Sullivan", "Kayden Wallace", "Aurora Woods", "Maverick Cole", "Willow West",
    "Roman Jordan", "Savannah Owens", "Kai Reynolds", "Aria Fisher", "Axel Ellis",
    "Skylar Harrison", "Quinn Gibson", "Piper Mendoza", "Easton Ruiz", "Paisley Sims"
  ];

  const blogTitles = [
    "Modern Interior Design Trends", "Creating Cozy Living Spaces", "Maximalist Design Guide",
    "Sustainable Home Decor", "Small Space Solutions", "Color Psychology in Design",
    "Lighting Design Essentials", "Furniture Selection Tips", "Kitchen Remodeling Ideas",
    "Bathroom Design Inspiration", "Bedroom Makeover Ideas", "Home Office Setup",
    "Outdoor Living Spaces", "Garden Design Basics", "Art in Interior Design",
    "Textile Selection Guide", "Wall Treatment Ideas", "Flooring Options Explained",
    "Window Treatment Solutions", "Storage Solutions", "Multi-Functional Furniture",
    "Vintage Meets Modern", "Scandinavian Design Principles", "Industrial Design Aesthetic",
    "Minimalist Living Guide", "Bohemian Style Tips", "Contemporary vs Modern",
    "Eco-Friendly Materials", "Smart Home Integration", "Accessibility in Design",
    "Children's Room Design", "Pet-Friendly Spaces", "Open Concept Living",
    "Privacy Solutions", "Soundproofing Basics", "Temperature Control Design",
    "Ventilation Solutions", "Natural Light Maximization", "Room Zoning Techniques",
    "Accent Wall Ideas", "Ceiling Design Options", "Floor Planning Fundamentals",
    "Traffic Flow Optimization", "Feng Shui Principles", "Biophilic Design Elements",
    "Seasonal Decor Tips", "Holiday Home Preparation", "Year-Round Decor Ideas",
    "Budget-Friendly Updates", "Luxury Design Elements", "DIY Project Ideas",
    "Professional Design Services", "Design Software Guide", "3D Visualization Tools",
    "Material Selection Guide", "Texture in Design", "Pattern Mixing Rules",
    "Scale and Proportion", "Balance in Design", "Rhythm and Repetition",
    "Unity in Design", "Variety and Contrast", "Emphasis Techniques",
    "Focal Point Creation", "Visual Hierarchy", "Space Perception",
    "Color Theory Basics", "Color Schemes", "Neutral Color Palettes",
    "Bold Color Choices", "Monochromatic Design", "Analogous Colors",
    "Complementary Colors", "Triadic Color Schemes", "Split-Complementary",
    "Accent Colors", "Color Temperature", "Warm vs Cool Colors",
    "Light Color Psychology", "Dark Color Psychology", "Color Trends 2024",
    "Timeless Color Choices", "Regional Design Styles", "Cultural Influences",
    "Historical Periods", "Design Movements", "Famous Designers",
    "Design Books", "Design Magazines", "Online Resources",
    "Design Education", "Design Careers", "Design Portfolio Tips",
    "Client Communication", "Project Management", "Budget Planning",
    "Timeline Management", "Vendor Relationships", "Installation Tips"
  ];

  const usedBlogSlugs = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const title = blogTitles[i] || `Blog Post ${i + 1}`;
    let slug = generateSlug(title);
    let slugCounter = 0;
    while (usedBlogSlugs.has(slug)) {
      slugCounter++;
      slug = generateSlug(title) + `-${slugCounter}`;
    }
    usedBlogSlugs.add(slug);
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    
    blogs.push({
      title,
      slug,
      excerpt: `This is a comprehensive guide about ${title.toLowerCase()}. Learn the essential tips and tricks to master this topic.`,
      content: `<h1>${title}</h1><p>Welcome to our detailed guide on ${title.toLowerCase()}. In this article, we will explore various aspects and provide you with actionable insights.</p><h2>Introduction</h2><p>Design is an art form that combines aesthetics with functionality. When done right, it can transform any space into something truly special.</p><h2>Key Concepts</h2><p>Understanding the fundamental principles is crucial for achieving great results. Let's dive into the key concepts.</p><h2>Practical Tips</h2><p>Here are some practical tips you can implement right away to improve your design.</p><h2>Conclusion</h2><p>We hope this guide has been helpful. Remember, good design is a journey, not a destination.</p>`,
      author,
      category_id: categoryId,
      archived: false,
    });
  }

  return blogs;
}

// Generate 100 leads
function generateLeads() {
  const leads = [];
  const firstNames = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Jessica",
    "William", "Ashley", "James", "Amanda", "Christopher", "Melissa", "Daniel", "Michelle",
    "Matthew", "Kimberly", "Anthony", "Amy", "Mark", "Angela", "Donald", "Brenda",
    "Steven", "Emma", "Paul", "Olivia", "Andrew", "Cynthia", "Joshua", "Marie",
    "Kenneth", "Janet", "Kevin", "Catherine", "Brian", "Frances", "George", "Christine",
    "Edward", "Samantha", "Ronald", "Deborah", "Timothy", "Rachel", "Jason", "Carolyn",
    "Jeffrey", "Janet", "Ryan", "Virginia", "Jacob", "Maria", "Gary", "Heather",
    "Nicholas", "Diane", "Eric", "Julie", "Jonathan", "Joyce", "Stephen", "Victoria",
    "Larry", "Kelly", "Justin", "Christina", "Scott", "Joan", "Brandon", "Evelyn",
    "Benjamin", "Judith", "Samuel", "Megan", "Gregory", "Cheryl", "Alexander", "Andrea",
    "Patrick", "Hannah", "Frank", "Jacqueline", "Raymond", "Martha", "Jack", "Gloria",
    "Dennis", "Teresa", "Jerry", "Sara", "Tyler", "Janice", "Aaron", "Marie",
    "Jose", "Julia", "Adam", "Grace", "Nathan", "Judy", "Henry", "Theresa"
  ];
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
    "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez",
    "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
    "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
    "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers",
    "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly",
    "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks",
    "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross"
  ];
  const sources = ["contact_form", "website", "referral", "social_media", "phone", "email", "manual"];
  const statuses = ["new", "contacted", "qualified", "converted", "lost"];

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const phone = `555-${Math.floor(1000 + Math.random() * 9000)}`;
    const message = `I'm interested in learning more about your interior design services. I'm planning to ${["renovate my home", "design a new office space", "redesign my living room", "create a modern kitchen", "design a cozy bedroom"][Math.floor(Math.random() * 5)]}. Please contact me at your earliest convenience.`;

    leads.push({
      name,
      email,
      phone,
      message,
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return leads;
}

// Generate 100 projects
function generateProjects(categoryIds: string[]) {
  const projects = [];
  const projectTitles = [
    "Modern Downtown Loft", "Cozy Family Home", "Luxury Penthouse", "Scandinavian Apartment",
    "Industrial Warehouse Conversion", "Minimalist Studio", "Bohemian Retreat", "Classic Victorian",
    "Contemporary Office Space", "Rustic Farmhouse", "Mediterranean Villa", "Asian-Inspired Home",
    "French Country Estate", "Mid-Century Modern House", "Art Deco Apartment", "Coastal Cottage",
    "Tropical Paradise", "Urban Minimalist", "Gothic Revival", "Transitional Family Home",
    "Eclectic Artist Studio", "Shabby Chic Bungalow", "Zen Meditation Space", "Futuristic Smart Home",
    "Vintage Retro Loft", "Country Kitchen Renovation", "Tuscan Villa", "Provencal Farmhouse",
    "Industrial Modern Loft", "Boho Chic Apartment", "Maximalist Penthouse", "Neoclassic Mansion",
    "Japandi Minimalist", "Biophilic Green Home", "Wabi Sabi Retreat", "Hollywood Regency",
    "Neo-Baroque Palace", "Craftsman Bungalow", "Prairie Style Home", "Colonial Revival",
    "Cape Cod Cottage", "Tudor House", "Spanish Hacienda", "Greek Revival",
    "Federal Style Home", "Georgian Mansion", "Rococo Apartment", "Bauhaus Office",
    "De Stijl Studio", "Postmodern Loft", "Art Nouveau Home", "Biedermeier Apartment",
    "Empire Style Villa", "Regency Mansion", "Queen Anne House", "Chippendale Home",
    "Sheraton Apartment", "Streamline Moderne", "Rationalist Office", "Brutalist Building",
    "High-Tech Smart Home", "Deconstructivist Space", "Sustainable Eco-Home", "Wellness Retreat",
    "Universal Design Home", "Aging in Place Renovation", "Tiny Home Project", "Micro Living Unit",
    "Co-Living Space", "Boutique Hotel Lobby", "Healthcare Facility", "Educational Campus",
    "Modern Office Complex", "Retail Store Design", "Restaurant Interior", "Hotel Suite",
    "Museum Exhibition", "Theater Renovation", "Library Modernization", "Sports Complex",
    "Recreation Center", "Outdoor Living Space", "Garden Design", "Landscape Project",
    "Urban Plaza", "Interior Architecture", "Space Planning Office", "Color Consultancy",
    "Lighting Design Project", "Residential Complex", "Mixed-Use Development", "Commercial Plaza",
    "Hospitality Venue", "Wellness Center", "Spa Design", "Fitness Facility",
    "Restaurant Chain", "Cafe Interior", "Bar Design", "Nightclub Space",
    "Event Venue", "Conference Center", "Co-Working Space", "Startup Office",
    "Corporate Headquarters", "Bank Branch", "Medical Clinic", "Dental Office"
  ];
  const statuses: ("draft" | "published")[] = ["draft", "published"];

  for (let i = 0; i < 100; i++) {
    const title = projectTitles[i] || `Project ${i + 1}`;
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const description = `A stunning ${title.toLowerCase()} that showcases exceptional design and attention to detail. This project represents the perfect blend of functionality and aesthetics.`;
    const content = `<h1>${title}</h1><p>${description}</p><h2>Project Overview</h2><p>This project was designed with careful consideration of the client's needs and the unique characteristics of the space. Every element was chosen to create a cohesive and harmonious environment.</p><h2>Design Approach</h2><p>Our design approach focused on balancing modern functionality with timeless aesthetics. We incorporated sustainable materials and energy-efficient solutions throughout.</p><h2>Key Features</h2><ul><li>Custom-designed furniture and fixtures</li><li>Strategic lighting design</li><li>Thoughtful space planning</li><li>Quality material selection</li></ul><h2>Results</h2><p>The completed project exceeded expectations, creating a space that is both beautiful and highly functional.</p>`;

    projects.push({
      title,
      description,
      content,
      category_id: categoryId,
      status,
      is_new: Math.random() > 0.7,
      tags: ["design", "interior", "modern", "renovation"].slice(0, Math.floor(Math.random() * 4) + 1),
    });
  }

  return projects;
}

// Helper function to batch insert
async function batchInsert<T>(
  supabase: any,
  table: string,
  items: T[],
  batchSize: number = 50
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      throw error;
    }
  }
}

async function seedTestData() {
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
    console.log("\n🌱 Seeding Test Data");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Step 1: Seed Categories (in batches)
    console.log("📁 Creating 100 categories...");
    const categories = generateCategories();
    
    // Get existing categories to avoid duplicates
    const { data: existingCategories, error: fetchError } = await supabaseAdmin
      .from("blog_categories")
      .select("id, slug");
    
    if (fetchError) {
      throw fetchError;
    }
    
    const existingSlugs = new Set(existingCategories?.map(c => c.slug) || []);
    const newCategories = categories.filter(c => !existingSlugs.has(c.slug));
    
    // Start with existing category IDs
    let allCategoryIds: string[] = existingCategories?.map(c => c.id) || [];
    
    // Insert only new categories in batches of 50
    if (newCategories.length > 0) {
      for (let i = 0; i < newCategories.length; i += 50) {
        const batch = newCategories.slice(i, i + 50);
        const { data: insertedCategories, error: categoriesError } = await supabaseAdmin
          .from("blog_categories")
          .insert(batch)
          .select("id");

        if (categoriesError) {
          throw categoriesError;
        }

        if (insertedCategories) {
          allCategoryIds = allCategoryIds.concat(insertedCategories.map((c) => c.id));
        }
      }
      console.log(`✅ Created ${newCategories.length} new categories (${existingCategories?.length || 0} already existed, ${allCategoryIds.length} total)\n`);
    } else {
      console.log(`✅ All categories already exist (${allCategoryIds.length} total)\n`);
    }

    // Step 2: Seed Blogs (in batches)
    console.log("📝 Creating 100 blogs...");
    const blogs = generateBlogs(allCategoryIds);
    await batchInsert(supabaseAdmin, "blogs", blogs, 50);
    console.log("✅ Created 100 blogs\n");

    // Step 3: Seed Leads (in batches)
    console.log("👥 Creating 100 leads...");
    const leads = generateLeads();
    await batchInsert(supabaseAdmin, "leads", leads, 50);
    console.log("✅ Created 100 leads\n");

    // Step 4: Seed Projects (in batches)
    console.log("🏗️  Creating 100 projects...");
    const projects = generateProjects(allCategoryIds);
    await batchInsert(supabaseAdmin, "projects", projects, 50);
    console.log("✅ Created 100 projects\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Successfully seeded all test data!");
    console.log(`   • ${allCategoryIds.length} categories`);
    console.log(`   • 100 blogs`);
    console.log(`   • 100 leads`);
    console.log(`   • 100 projects`);
    console.log("\n");
  } catch (error: any) {
    console.error("\n❌ Error seeding test data:");
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
    console.error("   - Check for duplicate entries if running script multiple times\n");
    process.exit(1);
  }
}

seedTestData();

