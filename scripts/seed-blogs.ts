/**
 * Blogs Seeding Script
 * 
 * This script creates 50 sample blogs in the database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sample blog titles
const blogTitles = [
  "10 Modern Kitchen Design Trends for 2024",
  "How to Choose the Perfect Color Palette for Your Home",
  "Minimalist Living: A Guide to Decluttering Your Space",
  "Scandinavian Design: Simple, Functional, Beautiful",
  "Luxury Bathroom Renovation Ideas",
  "Creating the Perfect Home Office Space",
  "Sustainable Interior Design: Eco-Friendly Choices",
  "Small Space Solutions: Maximizing Your Apartment",
  "The Art of Lighting: Transform Your Home with Light",
  "Industrial Style Interior Design Guide",
  "Coastal Home Decor: Bringing the Beach Indoors",
  "Traditional vs Modern: Choosing Your Interior Style",
  "Smart Home Integration: Technology Meets Design",
  "Feng Shui Principles for Modern Homes",
  "Wall Art Selection: Adding Personality to Your Space",
  "Flooring Options: Hardwood, Tile, or Carpet?",
  "Window Treatments: Function and Style Combined",
  "Outdoor Living Spaces: Extending Your Home",
  "Bedroom Design: Creating Your Perfect Sanctuary",
  "Living Room Layout Ideas for Every Space",
  "Color Psychology: How Colors Affect Your Mood",
  "Storage Solutions: Hidden and Smart Organization",
  "Kids Room Design: Fun and Functional Spaces",
  "Home Staging Tips: Selling Your Home Faster",
  "Vintage Decor: Mixing Old and New",
  "Luxury Interior Design on a Budget",
  "Home Theater Design: The Ultimate Entertainment Space",
  "Kitchen Cabinetry: Custom vs Pre-Made",
  "Bathroom Vanity Ideas: Style and Storage",
  "Accent Walls: Making a Bold Statement",
  "Rustic Farmhouse Design: Warm and Inviting",
  "Modern Furniture: Pieces That Stand the Test of Time",
  "Plant Styling: Bringing Nature Indoors",
  "Entryway Design: Making a Great First Impression",
  "Open Floor Plans: Pros and Cons",
  "Home Gym Design: Creating Motivation",
  "Pet-Friendly Interior Design Solutions",
  "Accessible Design: Universal Design Principles",
  "Eco-Friendly Materials: Sustainable Choices",
  "Art Deco Revival: Glamour and Sophistication",
  "Bohemian Style: Free-Spirited Decor",
  "Mid-Century Modern: Timeless Design",
  "Transitional Style: Best of Both Worlds",
  "Commercial Interior Design: Office Spaces",
  "Restaurant Design: Creating Ambiance",
  "Hotel Interior Design: Luxury and Comfort",
  "Retail Space Design: Engaging Customers",
  "Basement Finishing: Adding Value to Your Home",
  "Attic Conversion: Maximizing Space",
  "Multi-Generational Home Design",
  "Aging in Place: Design for Longevity"
];

// Sample blog excerpts
const blogExcerpts = [
  "Discover the latest kitchen design trends that are shaping modern homes in 2024. From smart appliances to sustainable materials, explore what's new in kitchen design.",
  "Choosing the right color palette can transform your home. Learn how to select colors that create harmony and reflect your personal style.",
  "Minimalism isn't just a design trend—it's a lifestyle. Discover practical tips for decluttering and creating a serene, organized living space.",
  "Scandinavian design emphasizes simplicity, functionality, and beauty. Learn how to incorporate Nordic principles into your home decor.",
  "Transform your bathroom into a luxurious retreat with these renovation ideas. From spa-like features to premium materials, create your dream bathroom.",
  "With remote work becoming the norm, a well-designed home office is essential. Explore ideas for creating a productive and inspiring workspace.",
  "Make environmentally conscious choices without compromising style. Discover sustainable materials and practices for your home design.",
  "Living in a small space doesn't mean sacrificing style or functionality. Learn clever solutions for maximizing every square foot.",
  "Lighting is one of the most important yet overlooked aspects of interior design. Discover how to use light to transform your home's atmosphere.",
  "Industrial style brings raw, urban elements into your home. Learn how to balance exposed materials with comfort and warmth.",
  "Coastal design brings the relaxed, breezy atmosphere of the beach into your home. Explore ways to create a seaside-inspired space.",
  "Choosing between traditional and modern design can be challenging. Learn the characteristics of each style and find your perfect match.",
  "Smart home technology is revolutionizing interior design. Discover how to seamlessly integrate technology with beautiful aesthetics.",
  "Feng Shui principles can help create harmony and positive energy in your home. Learn how to apply these ancient practices to modern living.",
  "Wall art can transform a room from ordinary to extraordinary. Get tips on selecting and arranging artwork to reflect your personality.",
  "Choosing the right flooring is crucial for both aesthetics and functionality. Compare different options to find what works best for your space.",
  "Window treatments serve both practical and aesthetic purposes. Learn how to choose treatments that provide privacy, light control, and style.",
  "Outdoor living spaces extend your home's functionality. Explore ideas for creating beautiful and functional outdoor rooms.",
  "Your bedroom should be a peaceful retreat. Discover design principles for creating a restful and rejuvenating space.",
  "Living room layout affects both aesthetics and functionality. Explore various layout options for different room sizes and styles.",
  "Colors have a profound impact on our emotions and mood. Learn how different colors can affect your well-being and create desired atmospheres.",
  "Effective storage solutions can transform cluttered spaces into organized havens. Discover hidden and smart storage ideas for every room.",
  "Designing a kids' room requires balancing fun, functionality, and safety. Explore ideas for creating spaces that grow with your children.",
  "Proper home staging can significantly impact how quickly your home sells. Learn professional staging techniques that attract buyers.",
  "Vintage decor adds character and history to modern spaces. Discover how to successfully mix vintage pieces with contemporary design.",
  "Achieving a luxurious look doesn't always require a big budget. Learn smart design strategies for creating high-end aesthetics affordably.",
  "A well-designed home theater provides the ultimate entertainment experience. Explore design considerations for creating an immersive media room.",
  "Kitchen cabinetry is both functional and decorative. Compare custom and pre-made options to make the best choice for your kitchen.",
  "Bathroom vanities combine style with storage. Discover design ideas for creating beautiful and functional bathroom spaces.",
  "Accent walls can transform a room and create visual interest. Learn how to use color, texture, and pattern to make a bold statement.",
  "Rustic farmhouse design brings warmth and character to modern homes. Explore ways to incorporate country charm into your decor.",
  "Investing in quality modern furniture ensures longevity and style. Discover pieces that remain relevant and beautiful for years to come.",
  "Plants add life and freshness to interior spaces. Learn how to style and care for plants to enhance your home's aesthetic.",
  "Your entryway sets the tone for your entire home. Discover design ideas for creating welcoming and functional entry spaces.",
  "Open floor plans offer spaciousness but present design challenges. Explore the pros and cons and learn how to make them work.",
  "A well-designed home gym can motivate you to exercise more. Discover design principles for creating an inspiring fitness space.",
  "Pets are family, and your home design should accommodate them. Learn how to create pet-friendly spaces without sacrificing style.",
  "Universal design principles benefit everyone. Discover how accessible design can be beautiful and functional for all ages and abilities.",
  "Sustainable materials are becoming increasingly important in design. Explore eco-friendly options that don't compromise on style.",
  "Art Deco style brings glamour and sophistication to modern interiors. Learn how to incorporate 1920s elegance into contemporary spaces.",
  "Bohemian style celebrates creativity and free-spirited living. Discover how to create eclectic, artistic spaces full of personality.",
  "Mid-century modern design remains popular for good reason. Explore this timeless style and learn how to incorporate it into your home.",
  "Transitional style bridges traditional and contemporary design. Discover how to create timeless, versatile spaces that blend both aesthetics.",
  "Commercial interior design impacts productivity and brand image. Learn design principles for creating effective office environments.",
  "Restaurant design influences dining experiences. Discover how interior design affects ambiance, customer satisfaction, and business success.",
  "Hotel interior design balances luxury with comfort. Explore design principles for creating memorable guest experiences.",
  "Retail space design can significantly impact sales. Learn how interior design engages customers and enhances the shopping experience.",
  "Finishing your basement adds valuable living space. Discover design ideas for transforming unused basements into functional rooms.",
  "Attic conversions maximize your home's potential. Explore creative ideas for transforming attic spaces into bedrooms, offices, or playrooms.",
  "Multi-generational homes require thoughtful design. Learn how to create spaces that accommodate different age groups and needs while maintaining harmony."
];

// Sample blog content (longer paragraphs)
const blogContent = [
  "<p>The kitchen is often called the heart of the home, and for good reason. It's where families gather, meals are prepared, and memories are made. In 2024, kitchen design trends reflect our evolving relationship with food, sustainability, and technology.</p><p>One of the most significant trends is the integration of smart appliances. Refrigerators that help you manage your grocery list, ovens that can be controlled remotely, and dishwashers that are whisper-quiet yet powerful. These technological advancements are seamlessly integrated into beautiful, functional designs that don't compromise on aesthetics.</p><p>Sustainable materials are also making a major impact. Homeowners are increasingly choosing eco-friendly options like bamboo cabinets, recycled glass countertops, and energy-efficient appliances. These choices reflect a growing awareness of environmental responsibility without sacrificing style or quality.</p><p>Open shelving continues to be popular, allowing homeowners to display beautiful dishes and create a more open, airy feel. Mixed materials, combining natural wood with sleek metals, create visual interest and texture. The result is kitchens that feel both modern and timeless.</p>",
  "<p>Color is one of the most powerful tools in interior design. It can influence mood, create atmosphere, and define the personality of a space. Choosing the right color palette for your home requires understanding color theory, your personal preferences, and how colors interact with each other.</p><p>Start by considering the mood you want to create in each room. Cool colors like blues and greens promote calm and relaxation, making them ideal for bedrooms and bathrooms. Warm colors like reds, oranges, and yellows are energizing and perfect for social spaces like living rooms and kitchens.</p><p>The 60-30-10 rule is a classic design principle that helps create balanced color schemes. Use 60% of a dominant color (typically walls), 30% of a secondary color (furniture and textiles), and 10% of an accent color (accessories and artwork). This creates visual harmony while allowing for variety and interest.</p><p>Don't forget to consider natural light when choosing colors. Rooms with abundant natural light can handle deeper, richer colors, while rooms with limited light benefit from lighter, brighter palettes. Test paint samples in different lighting conditions before making final decisions.</p>",
  "<p>Minimalism has become more than just a design trend—it's a lifestyle philosophy that emphasizes simplicity, intentionality, and freedom from excess. A minimalist home is not about living with nothing, but about surrounding yourself only with things that add value and joy to your life.</p><p>The journey to minimalism begins with decluttering. Go through each room and honestly evaluate every item. Ask yourself: Does this serve a purpose? Does it bring me joy? If the answer is no to both questions, it's time to let it go. Donate, sell, or recycle items that no longer serve you.</p><p>Once you've decluttered, focus on quality over quantity. Invest in fewer, better-made pieces rather than accumulating many inexpensive items. This approach not only creates a cleaner aesthetic but also saves money in the long run by reducing the need for constant replacements.</p><p>Storage is key in minimalist design. Choose furniture with built-in storage, use baskets and containers to organize, and keep surfaces clear. The goal is to have a place for everything, so everything can be in its place. This creates a sense of calm and order that promotes relaxation and clarity of mind.</p>",
  "<p>Scandinavian design, also known as Nordic design, originated in the Nordic countries of Denmark, Finland, Iceland, Norway, and Sweden. This design philosophy emerged in the 1950s and has maintained its popularity due to its emphasis on simplicity, functionality, and connection to nature.</p><p>The core principles of Scandinavian design include light and bright spaces, natural materials, minimal ornamentation, and functional furniture. White or light-colored walls maximize natural light, which is precious during long Nordic winters. This creates spaces that feel open, airy, and welcoming despite limited daylight hours.</p><p>Natural materials like wood, wool, and leather are fundamental to Scandinavian design. These materials bring warmth and texture to minimalist spaces, creating a balance between cool modernity and cozy comfort. The use of wood, particularly light woods like birch, pine, and ash, adds natural beauty and connects interiors to the surrounding landscape.</p><p>Functionality is paramount in Scandinavian design. Every piece of furniture and decor serves a purpose. This pragmatic approach doesn't mean sacrificing beauty—Scandinavian designers are masters at creating items that are both beautiful and useful. The result is interiors that are uncluttered, purposeful, and aesthetically pleasing.</p>",
  "<p>Bathrooms have evolved from purely functional spaces to personal sanctuaries where we begin and end our days. A luxury bathroom renovation can transform your daily routine into a spa-like experience, providing relaxation, rejuvenation, and a sense of escape.</p><p>When planning a luxury bathroom renovation, consider both aesthetics and functionality. High-end fixtures like rainfall showerheads, freestanding tubs, and smart toilets can significantly enhance your bathroom experience. Premium materials such as natural stone, heated floors, and custom cabinetry create a sense of luxury and quality.</p><p>Lighting is crucial in bathroom design. Layered lighting—combining ambient, task, and accent lighting—creates a beautiful and functional space. Consider dimmable lights, backlit mirrors, and well-placed sconces. Natural light is ideal, so if possible, incorporate windows or skylights into your design.</p><p>Storage is often overlooked in bathroom design, but it's essential for maintaining a clean, organized space. Custom vanities with ample storage, built-in niches, and elegant storage solutions help keep countertops clear while maintaining the luxurious aesthetic. The result is a bathroom that's both beautiful and practical.</p>",
  "<p>As remote work becomes increasingly common, creating a dedicated, well-designed home office has become essential. A thoughtfully planned workspace can boost productivity, reduce stress, and improve work-life balance. Whether you have a dedicated room or a corner of another space, the principles of effective office design remain the same.</p><p>Location matters when setting up your home office. Choose a space with good natural light, minimal distractions, and adequate privacy. If possible, separate your workspace from living areas to create mental boundaries between work and home life. If space is limited, room dividers or furniture placement can help create separation.</p><p>Ergonomics should be a top priority in office design. Invest in a quality ergonomic chair that supports your back and allows for proper posture. Your desk height should allow your arms to rest comfortably at a 90-degree angle when typing. Monitor height should be at eye level to prevent neck strain. These considerations prevent long-term health issues and improve comfort during long work sessions.</p><p>Storage and organization are crucial for maintaining productivity. Keep frequently used items within arm's reach, and use filing systems and organizers to prevent clutter. Cable management solutions keep your space clean and professional. Personal touches like plants, artwork, or photos can make your workspace more inviting and inspiring.</p>"
];

// Sample authors
const authors = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Thompson",
  "Lisa Anderson",
  "James Wilson",
  "Maria Garcia",
  "Robert Brown",
  "Jennifer Lee",
  "Christopher Davis"
];

// Sample image URLs (placeholder images from Unsplash)
const imageUrls = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
  "https://images.unsplash.com/photo-1556228720-d244a5f77d13?w=800",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
  "https://images.unsplash.com/photo-1556912167-f556f1f39f3d?w=800",
  "https://images.unsplash.com/photo-1556912173-46c8a8ab8bb9?w=800",
  "https://images.unsplash.com/photo-1560448075-cbc16ba4a9d4?w=800",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800"
];

// Sample tags
const tagOptions = [
  ["kitchen", "design", "trends", "modern"],
  ["color", "palette", "interior", "design"],
  ["minimalist", "decluttering", "organization", "lifestyle"],
  ["scandinavian", "nordic", "minimal", "design"],
  ["bathroom", "renovation", "luxury", "spa"],
  ["home-office", "workspace", "productivity", "remote-work"],
  ["sustainable", "eco-friendly", "green", "design"],
  ["small-space", "apartment", "organization", "solutions"],
  ["lighting", "design", "ambiance", "interior"],
  ["industrial", "urban", "loft", "design"],
  ["coastal", "beach", "decor", "interior"],
  ["traditional", "modern", "style", "interior"],
  ["smart-home", "technology", "automation", "design"],
  ["feng-shui", "harmony", "wellness", "design"],
  ["wall-art", "decor", "personality", "interior"],
  ["flooring", "hardwood", "tile", "carpet"],
  ["window-treatments", "curtains", "privacy", "design"],
  ["outdoor", "patio", "living", "space"],
  ["bedroom", "sanctuary", "relaxation", "design"],
  ["living-room", "layout", "furniture", "design"],
  ["color-psychology", "mood", "wellness", "design"],
  ["storage", "organization", "solutions", "interior"],
  ["kids-room", "children", "playroom", "design"],
  ["home-staging", "real-estate", "selling", "interior"],
  ["vintage", "retro", "decor", "interior"],
  ["luxury", "budget", "affordable", "design"],
  ["home-theater", "entertainment", "media-room", "design"],
  ["cabinetry", "custom", "kitchen", "storage"],
  ["bathroom-vanity", "storage", "bathroom", "design"],
  ["accent-wall", "color", "statement", "interior"],
  ["rustic", "farmhouse", "country", "design"],
  ["furniture", "modern", "timeless", "design"],
  ["plants", "nature", "interior", "decor"],
  ["entryway", "foyer", "welcome", "design"],
  ["open-floor-plan", "layout", "space", "design"],
  ["home-gym", "fitness", "exercise", "space"],
  ["pet-friendly", "interior", "design", "pets"],
  ["accessible", "universal-design", "accessibility", "design"],
  ["eco-friendly", "sustainable", "materials", "green"],
  ["art-deco", "glamour", "1920s", "design"],
  ["bohemian", "eclectic", "artistic", "design"],
  ["mid-century", "modern", "retro", "design"],
  ["transitional", "versatile", "timeless", "design"],
  ["commercial", "office", "interior", "design"],
  ["restaurant", "dining", "ambiance", "design"],
  ["hotel", "luxury", "hospitality", "design"],
  ["retail", "shopping", "customer", "design"],
  ["basement", "finishing", "renovation", "space"],
  ["attic", "conversion", "expansion", "design"],
  ["multi-generational", "family", "home", "design"]
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateBlogs(count: number, categoryIds: string[] | null) {
  const blogs = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < count; i++) {
    const titleIndex = i % blogTitles.length;
    const title = blogTitles[titleIndex];
    
    // Ensure unique slugs
    let slug = generateSlug(title);
    let slugCounter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${generateSlug(title)}-${slugCounter}`;
      slugCounter++;
    }
    usedSlugs.add(slug);

    const excerpt = blogExcerpts[titleIndex] || blogExcerpts[0];
    const content = blogContent[Math.floor(Math.random() * blogContent.length)] || blogContent[0];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const image = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const tags = tagOptions[titleIndex] || tagOptions[0];
    const archived = Math.random() > 0.85; // 15% chance of being archived
    
    // Randomly assign category or leave null (70% chance of having a category)
    const categoryId = categoryIds && categoryIds.length > 0 && Math.random() > 0.3
      ? categoryIds[Math.floor(Math.random() * categoryIds.length)]
      : null;

    const blogData: any = {
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      category_id: categoryId,
      archived,
    };

    // Only include tags if the column exists (will be added if migration has been run)
    // For now, we'll skip tags to avoid schema errors
    // Uncomment the line below if tags column exists in your database
    // blogData.tags = tags;

    blogs.push(blogData);
  }

  return blogs;
}

async function seedBlogs() {
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
    console.log("\n📝 Seeding Blogs");
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
      console.log("ℹ️  No categories found, blogs will be created without categories");
    }

    const blogs = generateBlogs(50, categoryIds);
    console.log(`📦 Generated ${blogs.length} blogs`);

    // Insert blogs in batches of 10 for better performance
    const batchSize = 10;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < blogs.length; i += batchSize) {
      const batch = blogs.slice(i, i + batchSize);
      const { data, error } = await supabaseAdmin
        .from("blogs")
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        inserted += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${data?.length || 0} blogs)`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully inserted: ${inserted} blogs`);
    if (errors > 0) {
      console.log(`   ❌ Failed to insert: ${errors} blogs`);
    }
    console.log("\n🎉 Blogs seeding completed!\n");
  } catch (error) {
    console.error("\n❌ Error seeding blogs:");
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

seedBlogs();

