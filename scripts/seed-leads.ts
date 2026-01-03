/**
 * Seed Leads Script
 * Adds 12 leads to the database
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

// Helper function to generate avatar color
function generateAvatarColor(name: string): string {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52BE80",
    "#EC7063", "#5DADE2"
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

const leads = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    message: "I'm interested in renovating my home. Could you provide more information about your renovation services?",
    source: "contact_form",
    status: "new",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    message: "Looking for interior design services for my new apartment. Would love to schedule a consultation.",
    source: "contact_form",
    status: "contacted",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 345-6789",
    message: "We're building a custom home and need architectural services. Can you help with the design?",
    source: "contact_form",
    status: "new",
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "+1 (555) 456-7890",
    message: "Interested in landscape design for our backyard. Looking for a complete outdoor makeover.",
    source: "contact_form",
    status: "qualified",
  },
  {
    name: "David Thompson",
    email: "david.thompson@example.com",
    phone: "+1 (555) 567-8901",
    message: "Need help with commercial office space design. We're expanding and need professional design services.",
    source: "contact_form",
    status: "new",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+1 (555) 678-9012",
    message: "Planning a kitchen renovation. Would like to discuss design options and timeline.",
    source: "contact_form",
    status: "contacted",
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 789-0123",
    message: "Looking for sustainable design solutions for our new construction project. Interested in green building practices.",
    source: "contact_form",
    status: "qualified",
  },
  {
    name: "Rachel Martinez",
    email: "rachel.martinez@example.com",
    phone: "+1 (555) 890-1234",
    message: "Need interior design services for a luxury penthouse. Looking for high-end, sophisticated design.",
    source: "contact_form",
    status: "new",
  },
  {
    name: "Robert Kim",
    email: "robert.kim@example.com",
    phone: "+1 (555) 901-2345",
    message: "Interested in your project management services. We have a renovation project that needs coordination.",
    source: "contact_form",
    status: "contacted",
  },
  {
    name: "Amanda Foster",
    email: "amanda.foster@example.com",
    phone: "+1 (555) 012-3456",
    message: "Planning a complete home renovation. Need help with design, planning, and project management.",
    source: "contact_form",
    status: "qualified",
  },
  {
    name: "Christopher Lee",
    email: "christopher.lee@example.com",
    phone: "+1 (555) 123-4568",
    message: "Looking for bathroom design services. Want to create a spa-like retreat in our master bathroom.",
    source: "contact_form",
    status: "new",
  },
  {
    name: "Jennifer Park",
    email: "jennifer.park@example.com",
    phone: "+1 (555) 234-5679",
    message: "Interested in 3D visualization services. Would like to see renderings before starting our project.",
    source: "contact_form",
    status: "contacted",
  },
];

async function seedLeads() {
  console.log("\n🌱 Seeding Leads");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let successCount = 0;
  let skipCount = 0;

  for (const lead of leads) {
    const avatarColor = generateAvatarColor(lead.name);

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        status: lead.status,
        avatar_color: avatarColor,
      })
      .select();

    if (error) {
      console.error(`❌ Error inserting ${lead.name}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Created: ${lead.name} (${lead.email})`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${lead.name} (already exists)`);
      skipCount++;
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`📊 Total: ${leads.length}\n`);
}

seedLeads().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

