/**
 * Admin User Creation Script
 * 
 * This script creates an admin user programmatically using Supabase Admin API.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = "vaishakhpat2003@gmail.com";
const ADMIN_PASSWORD = "123456";

async function createAdminUser() {
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
    console.log("\n🔐 Creating Admin User");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const existingUser = existingUsers.users.find(
      (user) => user.email === ADMIN_EMAIL
    );

    if (existingUser) {
      console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
      console.log(`   User ID: ${existingUser.id}`);
      console.log("\n💡 If you need to reset the password, use the Supabase Dashboard\n");
      return;
    }

    // Create new admin user
    console.log(`📧 Creating user with email: ${ADMIN_EMAIL}`);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm the user
    });

    if (createError) {
      throw createError;
    }

    if (newUser.user) {
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${newUser.user.email}`);
      console.log(`   User ID: ${newUser.user.id}`);
      console.log("\n🎉 You can now log in at: http://localhost:3000/admin/login\n");
    }
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
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

createAdminUser();
