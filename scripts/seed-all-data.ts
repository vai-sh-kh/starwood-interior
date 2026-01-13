/**
 * Complete Database Seeder
 * 
 * Seeds all tables with 20 items each.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/lib/supabase/types";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper function to generate random date within last year
function randomDate(): string {
  const now = new Date();
  const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const randomTime = yearAgo.getTime() + Math.random() * (now.getTime() - yearAgo.getTime());
  return new Date(randomTime).toISOString();
}

async function seedAllData() {
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

  // Create Supabase admin client with service role key for remote connection
  const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
    global: {
      fetch: async (url, options = {}) => {
        // Add timeout for remote connections (30 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Connection timeout: Request took too long');
          }
          throw error;
        }
      },
    },
  });

  console.log("\n🌱 Starting Database Seeding (Remote Supabase)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`📡 Connecting to remote Supabase...`);
  console.log(`   URL: ${supabaseUrl}\n`);

  // Test connection with retry logic
  let connectionTested = false;
  const maxRetries = 3;
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`   Testing connection (attempt ${attempt}/${maxRetries})...`);
      const { data: testData, error: testError } = await supabaseAdmin
        .from("blog_categories")
        .select("id")
        .limit(1);
      
      if (testError) {
        // If it's a table doesn't exist error, that's okay - we'll create it
        if (testError.message.includes("relation") || testError.message.includes("does not exist")) {
          console.log("   ✅ Connection successful (table may not exist yet, that's okay)\n");
          connectionTested = true;
          break;
        }
        // Check if error is HTML (like Cloudflare 521 page) - this means server is down
        const errorStr = String(testError.message || testError);
        if (errorStr.includes("<!DOCTYPE html>") || errorStr.includes("521") || errorStr.includes("Web server is down")) {
          lastError = new Error("Supabase server appears to be down (Error 521). The project may be paused. Please check your Supabase dashboard.");
          if (attempt < maxRetries) {
            console.log(`   ⚠️  Server appears down, retrying...`);
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
          }
        } else {
          // For other errors, store and continue to retry
          lastError = testError;
          if (attempt < maxRetries) {
            console.log(`   ⚠️  Attempt ${attempt} failed: ${testError.message}`);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          }
        }
      } else {
        console.log("   ✅ Connection successful\n");
        connectionTested = true;
        break;
      }
    } catch (testErr: any) {
      lastError = testErr;
      const errorMessage = testErr?.message || testErr?.details || String(testErr);
      
      // Check if error is HTML (like Cloudflare 521 page)
      if (errorMessage.includes("<!DOCTYPE html>") || errorMessage.includes("521") || errorMessage.includes("Web server is down")) {
        if (attempt < maxRetries) {
          console.log(`   ⚠️  Server appears down, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        }
      } else if (attempt < maxRetries) {
        console.log(`   ⚠️  Attempt ${attempt} failed: ${errorMessage.substring(0, 100)}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
  }

  if (!connectionTested) {
    console.error(`\n❌ Failed to connect to remote Supabase after ${maxRetries} attempts`);
    const errorMessage = lastError?.message || lastError?.details || String(lastError);
    
    if (errorMessage?.includes("521") || errorMessage?.includes("Web server is down") || errorMessage?.includes("<!DOCTYPE html>")) {
      console.error("   ⚠️  Supabase server appears to be down (Error 521)");
      console.error("   This usually means:");
      console.error("   - Your project is paused (free tier projects pause after inactivity)");
      console.error("   - Go to https://supabase.com/dashboard to restore/unpause your project");
      console.error("   - Or wait a few minutes and try again\n");
    } else if (errorMessage?.includes("ENOTFOUND") || errorMessage?.includes("getaddrinfo")) {
      console.error("   DNS lookup failed. Please check:");
      console.error("   - Your internet connection");
      console.error("   - The NEXT_PUBLIC_SUPABASE_URL is correct in .env.local");
      console.error("   - The Supabase project is active and accessible");
      console.error(`   - Current URL: ${supabaseUrl}\n`);
    } else if (errorMessage?.includes("timeout")) {
      console.error("   Connection timeout. Please check:");
      console.error("   - Your internet connection");
      console.error("   - Firewall settings");
      console.error("   - The Supabase project status\n");
    } else {
      console.error(`   Error: ${errorMessage.substring(0, 200)}`);
      console.error("   Please verify:");
      console.error("   - NEXT_PUBLIC_SUPABASE_URL is correct");
      console.error("   - SUPABASE_SERVICE_ROLE_KEY is valid");
      console.error("   - Your internet connection is working\n");
    }
    process.exit(1);
  }

  try {
    // 1. Seed Blog Categories (20 items)
    console.log("📝 Seeding Blog Categories...");
    const blogCategoryNames = [
      "Interior Design Trends",
      "Home Renovation Tips",
      "Sustainable Living",
      "Modern Architecture",
      "Kitchen Design",
      "Bathroom Remodeling",
      "Living Room Ideas",
      "Bedroom Design",
      "Outdoor Spaces",
      "Color Schemes",
      "Furniture Selection",
      "Lighting Solutions",
      "Space Planning",
      "Budget-Friendly Tips",
      "Luxury Interiors",
      "Minimalist Design",
      "Traditional Styles",
      "Smart Home Integration",
      "Eco-Friendly Materials",
      "Design Inspiration",
    ];

    const blogCategoryInserts = blogCategoryNames.map((name) => ({
      name,
      slug: generateSlug(name),
    }));

    const { data: blogCategories, error: blogCategoriesError } = await supabaseAdmin
      .from("blog_categories")
      .upsert(blogCategoryInserts, { onConflict: "slug" })
      .select();

    if (blogCategoriesError) {
      console.error("\n❌ Error details:", JSON.stringify(blogCategoriesError, null, 2));
      if (blogCategoriesError.message?.includes("ENOTFOUND") || blogCategoriesError.message?.includes("getaddrinfo")) {
        throw new Error(`Network error: Cannot reach remote Supabase. Please check your internet connection and verify NEXT_PUBLIC_SUPABASE_URL is correct.`);
      }
      throw new Error(`Failed to seed blog categories: ${blogCategoriesError.message}`);
    }
    console.log(`✅ Created ${blogCategories?.length || 0} blog categories\n`);

    // 2. Seed Blogs (20 items)
    console.log("📰 Seeding Blogs...");
    const blogTitles = [
      "10 Modern Interior Design Trends for 2024",
      "How to Renovate Your Kitchen on a Budget",
      "Sustainable Materials for Eco-Friendly Homes",
      "Maximizing Small Spaces: Design Tips",
      "The Art of Color Coordination in Interiors",
      "Smart Home Technology Integration Guide",
      "Creating the Perfect Home Office Space",
      "Luxury Bathroom Design Ideas",
      "Outdoor Living: Patio and Deck Ideas",
      "Minimalist Design Principles Explained",
      "Traditional vs Modern: Finding Your Style",
      "Lighting Design: Brightening Your Home",
      "Furniture Selection Guide for Every Room",
      "Budget-Friendly Home Makeover Tips",
      "Luxury Interior Design: What to Expect",
      "Space Planning: Making Rooms Feel Larger",
      "Eco-Friendly Home Design Solutions",
      "Design Inspiration from Around the World",
      "Kitchen Remodeling: A Complete Guide",
      "Bedroom Design: Creating Your Sanctuary",
    ];

    const blogInserts = blogTitles.map((title, index) => ({
      title,
      slug: generateSlug(title),
      excerpt: `Discover the latest insights and tips about ${title.toLowerCase()}. This comprehensive guide covers everything you need to know.`,
      content: `<h2>Introduction</h2><p>Welcome to our comprehensive guide on ${title.toLowerCase()}. In this article, we'll explore various aspects and provide you with actionable insights.</p><h2>Key Points</h2><p>Here are the main points to consider:</p><ul><li>Point one: Important information</li><li>Point two: Additional details</li><li>Point three: Practical applications</li></ul><h2>Conclusion</h2><p>We hope this guide has been helpful. For more information, feel free to contact us.</p>`,
      image: `/images/blog-${index + 1}.jpg`,
      author: index % 3 === 0 ? "Sarah Johnson" : index % 3 === 1 ? "Michael Chen" : "Emily Rodriguez",
      category_id: blogCategories?.[index % blogCategories.length]?.id || null,
      tags: [
        blogCategoryNames[index % blogCategoryNames.length],
        "Design",
        "Tips",
      ],
      status: index % 4 === 0 ? "draft" : "published",
      created_at: randomDate(),
    }));

    const { data: blogs, error: blogsError } = await supabaseAdmin
      .from("blogs")
      .upsert(blogInserts, { onConflict: "slug" })
      .select();

    if (blogsError) {
      throw new Error(`Failed to seed blogs: ${blogsError.message}`);
    }
    console.log(`✅ Created ${blogs?.length || 0} blogs\n`);

    // 3. Seed Projects (20 items)
    console.log("🏗️  Seeding Projects...");
    const projectTitles = [
      "Modern Luxury Villa Renovation",
      "Contemporary Apartment Redesign",
      "Classic Heritage Home Restoration",
      "Minimalist Studio Apartment",
      "Eco-Friendly Family Home",
      "Luxury Penthouse Interior",
      "Traditional Kerala House Design",
      "Modern Office Space Design",
      "Cozy Cottage Makeover",
      "Industrial Loft Conversion",
      "Beach House Interior Design",
      "Mountain Retreat Design",
      "Urban Apartment Transformation",
      "Heritage Bungalow Restoration",
      "Smart Home Integration Project",
      "Luxury Hotel Suite Design",
      "Restaurant Interior Design",
      "Retail Space Design",
      "Wellness Center Design",
      "Educational Institution Interior",
    ];

    const projectInserts = projectTitles.map((title, index) => ({
      title,
      slug: generateSlug(title),
      description: `A stunning ${title.toLowerCase()} project showcasing exceptional design and craftsmanship.`,
      content: `<h2>Project Overview</h2><p>This project represents a comprehensive ${title.toLowerCase()} that combines functionality with aesthetic appeal.</p><h2>Design Approach</h2><p>Our team worked closely with the client to create a space that reflects their vision and lifestyle.</p><h2>Key Features</h2><ul><li>Custom-designed elements</li><li>High-quality materials</li><li>Attention to detail</li></ul>`,
      image: `/images/project-${index + 1}.jpg`,
      status: index % 5 === 0 ? "draft" : "published",
      category_id: blogCategories?.[index % blogCategories.length]?.id || null,
      meta_title: `${title} | Starwood Interiors`,
      meta_description: `Explore our ${title.toLowerCase()} project featuring exceptional design and quality craftsmanship.`,
      project_info: {
        client: `Client ${index + 1}`,
        location: ["Trivandrum", "Kochi", "Bangalore", "Mumbai", "Delhi"][index % 5],
        size: `${(index + 1) * 500} sq ft`,
        completion_date: new Date(Date.now() - (index * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        duration: `${index + 1} months`,
      },
      quote: index % 3 === 0 ? `"This project exceeded all our expectations. The attention to detail is remarkable."` : null,
      quote_author: index % 3 === 0 ? `Client ${index + 1}` : null,
      tags: ["Interior Design", "Renovation", "Modern"],
      is_new: index % 4 === 0,
      created_at: randomDate(),
    }));

    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .upsert(projectInserts, { onConflict: "slug" })
      .select();

    if (projectsError) {
      throw new Error(`Failed to seed projects: ${projectsError.message}`);
    }
    console.log(`✅ Created ${projects?.length || 0} projects\n`);

    // 4. Seed Project Gallery Images (20 items - 3 images per project)
    console.log("🖼️  Seeding Project Gallery Images...");
    const projectGalleryInserts: any[] = [];
    projects?.forEach((project, projectIndex) => {
      for (let i = 0; i < 3; i++) {
        projectGalleryInserts.push({
          project_id: project.id,
          image_url: `/images/project-${projectIndex + 1}-gallery-${i + 1}.jpg`,
          display_order: i + 1,
        });
      }
    });

    if (projectGalleryInserts.length > 0) {
      const { error: projectGalleryError } = await supabaseAdmin
        .from("project_gallery_images")
        .upsert(projectGalleryInserts);

      if (projectGalleryError) {
        console.warn(`⚠️  Warning: Failed to seed some project gallery images: ${projectGalleryError.message}`);
      } else {
        console.log(`✅ Created ${projectGalleryInserts.length} project gallery images\n`);
      }
    }

    // 5. Seed Services (20 items)
    console.log("🔧 Seeding Services...");
    const serviceTitles = [
      "Interior Design Consultation",
      "Home Renovation Services",
      "Kitchen Design & Remodeling",
      "Bathroom Design & Installation",
      "Living Room Design",
      "Bedroom Design Services",
      "Office Space Design",
      "Commercial Interior Design",
      "Space Planning Services",
      "Color Consultation",
      "Furniture Selection & Sourcing",
      "Lighting Design Services",
      "Custom Furniture Design",
      "Home Staging Services",
      "3D Visualization Services",
      "Project Management",
      "Material Sourcing",
      "Sustainable Design Solutions",
      "Luxury Interior Design",
      "Complete Home Makeover",
    ];

    const serviceInserts = serviceTitles.map((title, index) => ({
      title,
      slug: generateSlug(title),
      description: `Professional ${title.toLowerCase()} tailored to your needs and preferences.`,
      content: `<h2>Service Overview</h2><p>Our ${title.toLowerCase()} provides comprehensive solutions for your interior design needs.</p><h2>What We Offer</h2><ul><li>Expert consultation</li><li>Customized design solutions</li><li>Quality execution</li></ul><h2>Why Choose Us</h2><p>With years of experience, we deliver exceptional results that exceed expectations.</p>`,
      image: `/images/service-${index + 1}.jpg`,
      status: index % 4 === 0 ? "draft" : "published",
      category_id: blogCategories?.[index % blogCategories.length]?.id || null,
      meta_title: `${title} | Starwood Interiors`,
      meta_description: `Professional ${title.toLowerCase()} for your home or business.`,
      tags: ["Interior Design", "Services"],
      is_new: index % 5 === 0,
      created_at: randomDate(),
    }));

    const { data: services, error: servicesError } = await supabaseAdmin
      .from("services")
      .upsert(serviceInserts, { onConflict: "slug" })
      .select();

    if (servicesError) {
      throw new Error(`Failed to seed services: ${servicesError.message}`);
    }
    console.log(`✅ Created ${services?.length || 0} services\n`);

    // 6. Seed Service Gallery Images (20 items - 3 images per service)
    console.log("🖼️  Seeding Service Gallery Images...");
    const serviceGalleryInserts: any[] = [];
    services?.forEach((service, serviceIndex) => {
      for (let i = 0; i < 3; i++) {
        serviceGalleryInserts.push({
          service_id: service.id,
          image_url: `/images/service-${serviceIndex + 1}-gallery-${i + 1}.jpg`,
          display_order: i + 1,
        });
      }
    });

    if (serviceGalleryInserts.length > 0) {
      const { error: serviceGalleryError } = await supabaseAdmin
        .from("service_gallery_images")
        .upsert(serviceGalleryInserts);

      if (serviceGalleryError) {
        console.warn(`⚠️  Warning: Failed to seed some service gallery images: ${serviceGalleryError.message}`);
      } else {
        console.log(`✅ Created ${serviceGalleryInserts.length} service gallery images\n`);
      }
    }

    // 7. Seed Subservices (20 items)
    console.log("🔨 Seeding Subservices...");
    const subserviceTitles = [
      "Initial Design Consultation",
      "3D Design Visualization",
      "Material Selection Guidance",
      "Color Scheme Planning",
      "Furniture Layout Design",
      "Lighting Plan Development",
      "Budget Planning & Estimation",
      "Timeline Development",
      "Vendor Coordination",
      "Quality Control Inspection",
      "Final Walkthrough",
      "Post-Installation Support",
      "Warranty Services",
      "Maintenance Guidance",
      "Design Updates & Revisions",
      "Custom Design Elements",
      "Space Optimization",
      "Accessibility Solutions",
      "Energy Efficiency Solutions",
      "Smart Home Integration",
    ];

    const subserviceInserts = subserviceTitles.map((title, index) => ({
      title,
      slug: generateSlug(title),
      description: `Detailed ${title.toLowerCase()} as part of our comprehensive service offerings.`,
      content: `<h2>Subservice Details</h2><p>This subservice provides ${title.toLowerCase()} to ensure your project meets all requirements.</p><h2>Included Features</h2><ul><li>Professional consultation</li><li>Detailed planning</li><li>Expert execution</li></ul>`,
      image: `/images/subservice-${index + 1}.jpg`,
      parent_service_id: services?.[index % services.length]?.id || services?.[0]?.id!,
      status: index % 4 === 0 ? "draft" : "published",
      meta_title: `${title} | Starwood Interiors`,
      meta_description: `Professional ${title.toLowerCase()} for your interior design project.`,
      is_new: index % 6 === 0,
      faq: [
        {
          question: `What is included in ${title}?`,
          answer: `This service includes comprehensive consultation, planning, and execution support.`,
        },
        {
          question: `How long does ${title} take?`,
          answer: `Typically, this service takes 1-2 weeks depending on project complexity.`,
        },
      ],
      created_at: randomDate(),
    }));

    const { data: subservices, error: subservicesError } = await supabaseAdmin
      .from("subservices")
      .upsert(subserviceInserts, { onConflict: "slug" })
      .select();

    if (subservicesError) {
      throw new Error(`Failed to seed subservices: ${subservicesError.message}`);
    }
    console.log(`✅ Created ${subservices?.length || 0} subservices\n`);

    // 8. Seed Subservice Gallery Images (20 items - 3 images per subservice)
    console.log("🖼️  Seeding Subservice Gallery Images...");
    const subserviceGalleryInserts: any[] = [];
    subservices?.forEach((subservice, subserviceIndex) => {
      for (let i = 0; i < 3; i++) {
        subserviceGalleryInserts.push({
          subservice_id: subservice.id,
          image_url: `/images/subservice-${subserviceIndex + 1}-gallery-${i + 1}.jpg`,
          display_order: i + 1,
        });
      }
    });

    if (subserviceGalleryInserts.length > 0) {
      const { error: subserviceGalleryError } = await supabaseAdmin
        .from("subservice_gallery_images")
        .upsert(subserviceGalleryInserts);

      if (subserviceGalleryError) {
        console.warn(`⚠️  Warning: Failed to seed some subservice gallery images: ${subserviceGalleryError.message}`);
      } else {
        console.log(`✅ Created ${subserviceGalleryInserts.length} subservice gallery images\n`);
      }
    }

    // 9. Seed Service-Subservice Relationships (20 items)
    console.log("🔗 Seeding Service-Subservice Relationships...");
    const serviceSubserviceInserts: any[] = [];
    services?.forEach((service, serviceIndex) => {
      // Link each service to 2-3 subservices
      const linkedSubservices = subservices?.slice(
        serviceIndex * 2,
        serviceIndex * 2 + (serviceIndex % 2 === 0 ? 3 : 2)
      ) || [];
      
      linkedSubservices.forEach((subservice, index) => {
        serviceSubserviceInserts.push({
          service_id: service.id,
          subservice_id: subservice.id,
          display_order: index + 1,
        });
      });
    });

    if (serviceSubserviceInserts.length > 0) {
      const { error: serviceSubserviceError } = await supabaseAdmin
        .from("service_subservices")
        .upsert(serviceSubserviceInserts);

      if (serviceSubserviceError) {
        console.warn(`⚠️  Warning: Failed to seed some service-subservice relationships: ${serviceSubserviceError.message}`);
      } else {
        console.log(`✅ Created ${serviceSubserviceInserts.length} service-subservice relationships\n`);
      }
    }

    // 10. Seed Leads (20 items)
    console.log("📞 Seeding Leads...");
    const leadNames = [
      "Rajesh Kumar",
      "Priya Sharma",
      "Amit Patel",
      "Sneha Nair",
      "Vikram Singh",
      "Anjali Menon",
      "Rahul Iyer",
      "Divya Reddy",
      "Karthik Nair",
      "Meera Krishnan",
      "Arjun Pillai",
      "Lakshmi Venkatesh",
      "Suresh Menon",
      "Deepa Nair",
      "Manoj Kumar",
      "Swati Iyer",
      "Gopal Pillai",
      "Rekha Nair",
      "Siddharth Menon",
      "Kavya Reddy",
    ];

    const leadSources = ["contact_form", "chatbot", "phone", "email", "referral", "social_media"];
    const leadStatuses = ["new", "contacted", "qualified", "converted", "closed"];

    const leadInserts = leadNames.map((name, index) => ({
      name,
      email: `lead${index + 1}@example.com`,
      phone: `+91${9000000000 + index}`,
      message: `Interested in ${serviceTitles[index % serviceTitles.length]}. Please contact me for more details.`,
      source: leadSources[index % leadSources.length],
      status: leadStatuses[index % leadStatuses.length],
      created_at: randomDate(),
    }));

    const { data: leads, error: leadsError } = await supabaseAdmin
      .from("leads")
      .upsert(leadInserts)
      .select();

    if (leadsError) {
      throw new Error(`Failed to seed leads: ${leadsError.message}`);
    }
    console.log(`✅ Created ${leads?.length || 0} leads\n`);

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Database Seeding Complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📊 Summary:");
    console.log(`   • Blog Categories: ${blogCategories?.length || 0}`);
    console.log(`   • Blogs: ${blogs?.length || 0}`);
    console.log(`   • Projects: ${projects?.length || 0}`);
    console.log(`   • Project Gallery Images: ${projectGalleryInserts.length}`);
    console.log(`   • Services: ${services?.length || 0}`);
    console.log(`   • Service Gallery Images: ${serviceGalleryInserts.length}`);
    console.log(`   • Subservices: ${subservices?.length || 0}`);
    console.log(`   • Subservice Gallery Images: ${subserviceGalleryInserts.length}`);
    console.log(`   • Service-Subservice Relationships: ${serviceSubserviceInserts.length}`);
    console.log(`   • Leads: ${leads?.length || 0}\n`);
    console.log("🎉 All tables have been seeded successfully!\n");
  } catch (error) {
    console.error("\n❌ Error seeding database:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      
      // Provide specific guidance based on error type
      if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
        console.error("\n💡 Network/DNS Error:");
        console.error("   - Check your internet connection");
        console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is correct in .env.local");
        console.error("   - Ensure the Supabase project is active");
        console.error("   - Try accessing the Supabase dashboard to verify project status");
      } else if (error.message.includes("timeout")) {
        console.error("\n💡 Connection Timeout:");
        console.error("   - Check your internet connection speed");
        console.error("   - Verify firewall/proxy settings");
        console.error("   - Try again in a few moments");
      } else if (error.message.includes("service_role") || error.message.includes("JWT")) {
        console.error("\n💡 Authentication Error:");
        console.error("   - Verify SUPABASE_SERVICE_ROLE_KEY is correct");
        console.error("   - Get a fresh service role key from Supabase Dashboard → Settings → API");
        console.error("   - Ensure you're using the 'service_role' key, not the 'anon' key");
      } else if (error.message.includes("relation") || error.message.includes("does not exist")) {
        console.error("\n💡 Database Schema Error:");
        console.error("   - Run migrations: pnpm supabase:db:push");
        console.error("   - Or reset database: pnpm supabase:reset");
      } else {
        console.error("\n💡 General Troubleshooting:");
        console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is correct");
        console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is valid");
        console.error("   - Ensure all migrations have been applied");
        console.error("   - Check that tables exist in your database");
      }
    } else {
      console.error("   Unknown error:", error);
    }
    console.error("\n");
    process.exit(1);
  }
}

seedAllData();

