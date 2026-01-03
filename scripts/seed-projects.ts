/**
 * Seed Projects Script
 * Adds 12 projects with images to the database
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

const projects = [
  {
    title: "Modern Luxury Villa",
    slug: "modern-luxury-villa",
    description: "A stunning contemporary villa featuring minimalist design and premium finishes.",
    content: "<p>This luxury villa showcases the perfect blend of modern architecture and sophisticated interior design. The property features an open floor plan, floor-to-ceiling windows, and seamless indoor-outdoor living spaces.</p><p>The design emphasizes natural light, clean lines, and high-end materials throughout.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: true,
    tags: ["luxury", "villa", "modern", "architecture"],
    meta_title: "Modern Luxury Villa - Architectural Excellence",
    meta_description: "Explore this stunning modern luxury villa featuring contemporary design and premium finishes.",
    project_info: {
      client: "Private Client",
      location: "Beverly Hills, CA",
      size: "8,500 sq ft",
      completion: "2024",
      services: ["Architecture", "Interior Design", "Landscaping"],
    },
    quote: "Working with this team transformed our vision into reality. The attention to detail is exceptional.",
    quote_author: "John Smith",
  },
  {
    title: "Coastal Beach House",
    slug: "coastal-beach-house",
    description: "A beautiful beachfront property designed to maximize ocean views and natural light.",
    content: "<p>This coastal retreat embraces the natural beauty of its oceanfront location. The design incorporates large windows, outdoor decks, and materials that withstand the marine environment.</p><p>Every room is designed to capture breathtaking ocean views while maintaining privacy and comfort.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: true,
    tags: ["beach", "coastal", "residential", "ocean-view"],
    meta_title: "Coastal Beach House - Oceanfront Living",
    meta_description: "Discover this stunning beachfront property designed for ocean living and relaxation.",
    project_info: {
      client: "Beachfront Properties LLC",
      location: "Malibu, CA",
      size: "4,200 sq ft",
      completion: "2024",
      services: ["Architecture", "Interior Design"],
    },
    quote: "The design perfectly captures the essence of coastal living. We couldn't be happier!",
    quote_author: "Sarah Johnson",
  },
  {
    title: "Urban Loft Renovation",
    slug: "urban-loft-renovation",
    description: "Transforming a historic warehouse into a modern, functional living space.",
    content: "<p>This urban loft renovation preserves the character of the original warehouse while introducing modern amenities and contemporary design elements.</p><p>Exposed brick, high ceilings, and industrial fixtures blend seamlessly with modern furniture and smart home technology.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: false,
    tags: ["renovation", "loft", "urban", "industrial"],
    meta_title: "Urban Loft Renovation - Industrial Modern",
    meta_description: "See how we transformed a historic warehouse into a stunning modern loft space.",
    project_info: {
      client: "Urban Living Co.",
      location: "Downtown Los Angeles, CA",
      size: "3,500 sq ft",
      completion: "2023",
      services: ["Renovation", "Interior Design"],
    },
    quote: "The renovation exceeded our expectations. The space feels both historic and completely modern.",
    quote_author: "Michael Chen",
  },
  {
    title: "Mountain Retreat Cabin",
    slug: "mountain-retreat-cabin",
    description: "A cozy mountain cabin designed for year-round comfort and stunning mountain views.",
    content: "<p>Nestled in the mountains, this cabin combines rustic charm with modern convenience. The design emphasizes natural materials, warm textures, and energy-efficient systems.</p><p>Large windows frame mountain vistas, while the interior provides a warm, inviting atmosphere perfect for relaxation.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: false,
    tags: ["cabin", "mountain", "rustic", "residential"],
    meta_title: "Mountain Retreat Cabin - Rustic Modern",
    meta_description: "Explore this beautiful mountain cabin combining rustic charm with modern amenities.",
    project_info: {
      client: "Private Client",
      location: "Aspen, CO",
      size: "2,800 sq ft",
      completion: "2023",
      services: ["Architecture", "Interior Design", "Construction"],
    },
    quote: "Our mountain retreat is everything we dreamed of. The design is both beautiful and functional.",
    quote_author: "Emily Rodriguez",
  },
  {
    title: "Contemporary Office Complex",
    slug: "contemporary-office-complex",
    description: "A state-of-the-art office building designed for productivity and employee well-being.",
    content: "<p>This modern office complex prioritizes employee comfort and productivity through thoughtful design. Open workspaces, private meeting rooms, and collaborative areas create a dynamic work environment.</p><p>Sustainable features and biophilic design elements contribute to a healthy, inspiring workplace.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: true,
    tags: ["commercial", "office", "modern", "sustainable"],
    meta_title: "Contemporary Office Complex - Modern Workspace",
    meta_description: "Discover this innovative office building designed for the future of work.",
    project_info: {
      client: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      size: "45,000 sq ft",
      completion: "2024",
      services: ["Architecture", "Interior Design", "Construction"],
    },
    quote: "The new office space has transformed how our team works. Productivity and morale have never been higher.",
    quote_author: "David Thompson",
  },
  {
    title: "Luxury Penthouse Suite",
    slug: "luxury-penthouse-suite",
    description: "An exclusive penthouse featuring panoramic city views and sophisticated design.",
    content: "<p>This luxury penthouse represents the pinnacle of urban living. The design maximizes the stunning city views while creating intimate, luxurious spaces for living and entertaining.</p><p>Premium materials, custom finishes, and smart home integration create an unparalleled living experience.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: true,
    tags: ["luxury", "penthouse", "urban", "residential"],
    meta_title: "Luxury Penthouse Suite - Urban Elegance",
    meta_description: "Experience this exclusive penthouse featuring panoramic views and luxury finishes.",
    project_info: {
      client: "Luxury Developments",
      location: "New York, NY",
      size: "6,500 sq ft",
      completion: "2024",
      services: ["Interior Design", "Custom Finishes"],
    },
    quote: "The penthouse is absolutely stunning. Every detail has been carefully considered and executed.",
    quote_author: "Lisa Anderson",
  },
  {
    title: "Sustainable Eco-Home",
    slug: "sustainable-eco-home",
    description: "A net-zero energy home demonstrating sustainable building practices and green technology.",
    content: "<p>This eco-home showcases the future of sustainable living. Solar panels, rainwater collection, and energy-efficient systems work together to create a net-zero energy home.</p><p>The design seamlessly integrates green technology with beautiful, functional living spaces.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: false,
    tags: ["sustainable", "eco-friendly", "green", "residential"],
    meta_title: "Sustainable Eco-Home - Net Zero Living",
    meta_description: "Explore this innovative eco-home featuring sustainable design and green technology.",
    project_info: {
      client: "Green Living Foundation",
      location: "Portland, OR",
      size: "3,200 sq ft",
      completion: "2023",
      services: ["Architecture", "Sustainable Design", "Construction"],
    },
    quote: "Living in this eco-home has been life-changing. We're proud to be part of the sustainable living movement.",
    quote_author: "James Wilson",
  },
  {
    title: "Historic Mansion Restoration",
    slug: "historic-mansion-restoration",
    description: "Carefully restoring a historic mansion while preserving its original character and charm.",
    content: "<p>This historic mansion restoration project required meticulous attention to detail and respect for the original architecture. We preserved period features while updating systems and infrastructure for modern living.</p><p>The result is a home that honors its history while providing contemporary comfort and functionality.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: false,
    tags: ["restoration", "historic", "mansion", "preservation"],
    meta_title: "Historic Mansion Restoration - Preserving Heritage",
    meta_description: "See how we restored this historic mansion while preserving its original character.",
    project_info: {
      client: "Historic Preservation Society",
      location: "Charleston, SC",
      size: "12,000 sq ft",
      completion: "2023",
      services: ["Restoration", "Interior Design", "Preservation"],
    },
    quote: "The restoration work is exceptional. The mansion's historic character has been beautifully preserved.",
    quote_author: "Robert Kim",
  },
  {
    title: "Modern Family Home",
    slug: "modern-family-home",
    description: "A spacious family home designed for comfort, functionality, and modern living.",
    content: "<p>This modern family home balances open, flexible spaces with private areas for rest and relaxation. The design accommodates family life while maintaining a sophisticated aesthetic.</p><p>Large windows, open floor plans, and thoughtful storage solutions create a home that works for the whole family.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: true,
    tags: ["family", "residential", "modern", "functional"],
    meta_title: "Modern Family Home - Comfortable Living",
    meta_description: "Discover this spacious family home designed for modern family life.",
    project_info: {
      client: "Private Family",
      location: "Austin, TX",
      size: "4,800 sq ft",
      completion: "2024",
      services: ["Architecture", "Interior Design", "Construction"],
    },
    quote: "This home is perfect for our family. The design is both beautiful and practical for everyday life.",
    quote_author: "Amanda Foster",
  },
  {
    title: "Boutique Hotel Design",
    slug: "boutique-hotel-design",
    description: "A unique boutique hotel featuring locally-inspired design and luxury amenities.",
    content: "<p>This boutique hotel design celebrates local culture and architecture while providing guests with a luxurious, memorable experience. Each room is uniquely designed with attention to detail and comfort.</p><p>The hotel features stunning common areas, a rooftop bar, and amenities that reflect the local character.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: false,
    tags: ["hotel", "hospitality", "boutique", "commercial"],
    meta_title: "Boutique Hotel Design - Local Luxury",
    meta_description: "Explore this unique boutique hotel featuring locally-inspired design and luxury.",
    project_info: {
      client: "Hospitality Group",
      location: "Napa Valley, CA",
      size: "25,000 sq ft",
      completion: "2023",
      services: ["Architecture", "Interior Design", "Hospitality Design"],
    },
    quote: "The hotel design perfectly captures the essence of Napa Valley. Our guests are consistently impressed.",
    quote_author: "Christopher Lee",
  },
  {
    title: "Minimalist Studio Apartment",
    slug: "minimalist-studio-apartment",
    description: "Maximizing space and functionality in a compact studio apartment with minimalist design.",
    content: "<p>This studio apartment demonstrates how thoughtful design can maximize small spaces. Clever storage solutions, multi-functional furniture, and a minimalist aesthetic create a comfortable, uncluttered living environment.</p><p>Every square foot has been carefully considered to create a space that feels much larger than its actual size.</p>",
    image: "/images/project-detail.png",
    status: "published",
    is_new: false,
    tags: ["apartment", "minimalist", "small-space", "interior-design"],
    meta_title: "Minimalist Studio Apartment - Small Space Design",
    meta_description: "See how we maximized space in this compact studio apartment with minimalist design.",
    project_info: {
      client: "Private Client",
      location: "Seattle, WA",
      size: "650 sq ft",
      completion: "2023",
      services: ["Interior Design", "Space Planning"],
    },
    quote: "The transformation is incredible. The apartment feels spacious and organized despite its size.",
    quote_author: "Jennifer Park",
  },
  {
    title: "Luxury Resort Development",
    slug: "luxury-resort-development",
    description: "A world-class resort development featuring multiple villas, amenities, and stunning landscapes.",
    content: "<p>This luxury resort development creates an immersive experience for guests. Multiple villas, world-class amenities, and carefully designed landscapes work together to create a destination resort.</p><p>The design respects the natural environment while providing guests with unparalleled luxury and comfort.</p>",
    image: "/images/projects-detail.png",
    status: "published",
    is_new: true,
    tags: ["resort", "luxury", "hospitality", "development"],
    meta_title: "Luxury Resort Development - World-Class Destination",
    meta_description: "Discover this stunning luxury resort development featuring villas and world-class amenities.",
    project_info: {
      client: "Resort Development Group",
      location: "Maldives",
      size: "150,000 sq ft",
      completion: "2024",
      services: ["Architecture", "Interior Design", "Landscaping", "Master Planning"],
    },
    quote: "The resort is absolutely breathtaking. The design seamlessly integrates with the natural beauty of the location.",
    quote_author: "Thomas Brown",
  },
];

async function seedProjects() {
  console.log("\n🌱 Seeding Projects");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let successCount = 0;
  let skipCount = 0;

  for (const project of projects) {
    const { data, error } = await supabase
      .from("projects")
      .upsert(
        {
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          image: project.image,
          status: project.status,
          is_new: project.is_new,
          tags: project.tags,
          meta_title: project.meta_title,
          meta_description: project.meta_description,
          project_info: project.project_info,
          quote: project.quote,
          quote_author: project.quote_author,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: true,
        }
      )
      .select();

    if (error) {
      console.error(`❌ Error inserting ${project.title}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${project.title}`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${project.title} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`📊 Total: ${projects.length}\n`);
}

seedProjects().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

