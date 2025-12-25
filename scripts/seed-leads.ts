/**
 * Leads Seeding Script
 * 
 * This script creates 50 sample leads in the database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { AVATAR_COLORS } from "../src/lib/constants";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sample data arrays
const firstNames = [
  "John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Jessica",
  "Robert", "Ashley", "William", "Amanda", "Richard", "Melissa", "Joseph",
  "Nicole", "Thomas", "Michelle", "Charles", "Kimberly", "Christopher", "Amy",
  "Daniel", "Angela", "Matthew", "Lisa", "Anthony", "Nancy", "Mark", "Karen",
  "Donald", "Betty", "Steven", "Helen", "Paul", "Sandra", "Andrew", "Donna",
  "Joshua", "Carol", "Kenneth", "Ruth", "Kevin", "Sharon", "Brian", "Michelle",
  "George", "Laura", "Timothy", "Emily"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
  "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
  "Roberts", "Gomez", "Phillips"
];

const sources = [
  "contact_form",
  "referral",
  "social_media",
  "website",
  "phone_call",
  "email",
  "walk_in",
  "event"
];

const statuses = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost"
];

const messages = [
  "Interested in a complete home renovation. Looking for modern design with sustainable materials.",
  "Need consultation for kitchen remodeling. Budget around $50k.",
  "Want to redesign my living room. Prefer minimalist style.",
  "Looking for interior design services for a new apartment.",
  "Interested in bathroom renovation. Need quotes for 3 bathrooms.",
  "Want to update my office space with contemporary design.",
  "Need help with color scheme and furniture selection for entire house.",
  "Looking for eco-friendly interior design solutions.",
  "Interested in smart home integration with interior design.",
  "Need design consultation for a commercial space.",
  "Want to transform my bedroom into a luxury suite.",
  "Looking for Scandinavian design style for my home.",
  "Interested in vintage/retro interior design.",
  "Need help with space optimization for small apartment.",
  "Want to create a home office that's both functional and stylish.",
  "Looking for outdoor space design and landscaping ideas.",
  "Interested in luxury interior design for penthouse.",
  "Need consultation for home staging before selling.",
  "Want to incorporate art and sculptures into interior design.",
  "Looking for budget-friendly renovation options.",
  "Interested in traditional Indian design with modern touches.",
  "Need help with lighting design for entire home.",
  "Want to create a kid-friendly yet elegant living space.",
  "Looking for sustainable and green building materials.",
  "Interested in open floor plan design.",
  "Need consultation for restaurant interior design.",
  "Want to redesign my master bedroom and ensuite.",
  "Looking for home automation integration with design.",
  "Interested in coastal/beach house interior style.",
  "Need help with storage solutions and organization.",
  "Want to create a home gym that blends with living space.",
  "Looking for pet-friendly interior design solutions.",
  "Interested in industrial loft style design.",
  "Need consultation for home theater room design.",
  "Want to update my home with latest design trends.",
  "Looking for accessible design for elderly family members.",
  "Interested in Feng Shui principles in interior design.",
  "Need help with window treatments and curtains.",
  "Want to create a meditation/yoga space at home.",
  "Looking for multi-generational home design solutions.",
  "Interested in smart storage and hidden compartments.",
  "Need consultation for holiday home interior design.",
  "Want to incorporate plants and biophilic design.",
  "Looking for energy-efficient design solutions.",
  "Interested in custom furniture design and installation.",
  "Need help with color psychology in interior design.",
  "Want to create a wine cellar and tasting room.",
  "Looking for sustainable flooring options.",
  "Interested in acoustic design for home office.",
  "Need consultation for outdoor kitchen and dining area."
];

/**
 * Generate a consistent avatar hex color based on a name (Google-style)
 * Same logic as in lib/utils.ts
 */
function getAvatarHexColor(name: string): string {
  if (!name) {
    return AVATAR_COLORS[0]; // Return default color #BB8FCE
  }
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function generateRandomEmail(firstName: string, lastName: string): string {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
}

function generateRandomPhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 10000);
  return `+1-${areaCode}-${exchange}-${number.toString().padStart(4, "0")}`;
}

function generateLeads(count: number) {
  const leads = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Ensure unique emails
    let email = generateRandomEmail(firstName, lastName);
    while (usedEmails.has(email)) {
      email = generateRandomEmail(firstName, lastName);
    }
    usedEmails.add(email);

    const phone = Math.random() > 0.2 ? generateRandomPhone() : null; // 80% have phone
    const message = messages[Math.floor(Math.random() * messages.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const avatarColor = getAvatarHexColor(name);

    leads.push({
      name,
      email,
      phone,
      message,
      source,
      status,
      avatar_color: avatarColor,
    });
  }

  return leads;
}

async function seedLeads() {
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
    console.log("\n📝 Seeding Leads");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const leads = generateLeads(50);
    console.log(`📦 Generated ${leads.length} leads`);

    // Insert leads in batches of 10 for better performance
    const batchSize = 10;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        inserted += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${data?.length || 0} leads)`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully inserted: ${inserted} leads`);
    if (errors > 0) {
      console.log(`   ❌ Failed to insert: ${errors} leads`);
    }
    console.log("\n🎉 Leads seeding completed!\n");
  } catch (error) {
    console.error("\n❌ Error seeding leads:");
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

seedLeads();

