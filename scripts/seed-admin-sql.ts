/**
 * Admin User Creation Script (SQL Method)
 * 
 * This script creates an admin user using SQL directly when Auth API fails.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createAdminUserSQL() {
  if (!supabaseUrl) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    process.exit(1);
  }

  if (!ADMIN_EMAIL) {
    console.error("❌ Error: ADMIN_EMAIL is not set in .env.local");
    process.exit(1);
  }

  if (!ADMIN_PASSWORD) {
    console.error("❌ Error: ADMIN_PASSWORD is not set in .env.local");
    process.exit(1);
  }

  // Create Supabase admin client
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log("\n🔐 Creating Admin User via SQL (Remote Database)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}`);
    console.log(`📧 Admin Email: ${ADMIN_EMAIL}\n`);

    // Try to create user using signUp (works even when Admin API fails)
    console.log("📧 Creating user via signUp method...");
    
    // Use anon key for signup (then we'll confirm with service role)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for signup");
    }
    
    const anonClient = createClient(supabaseUrl, anonKey);
    
    // Try signup
    const { data: signUpData, error: signUpError } = await anonClient.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signUpError) {
      if (signUpError.message?.includes('already registered')) {
        console.log(`✅ Admin user already exists!`);
        console.log("\n💡 To confirm and set password, use Supabase Dashboard:");
        console.log("   https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users\n");
        return;
      }
      throw signUpError;
    }

    if (signUpData.user) {
      console.log(`✅ User created! Now confirming email...`);
      
      // Confirm the user using Admin API
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        signUpData.user.id,
        {
          email_confirm: true,
        }
      );

      if (confirmError) {
        console.log("⚠️  User created but could not auto-confirm email");
        console.log("   You may need to confirm via Supabase Dashboard");
      } else {
        console.log("✅ Email confirmed!");
      }

      console.log(`\n✅ Admin user created successfully!`);
      console.log(`   Email: ${signUpData.user.email}`);
      console.log(`   User ID: ${signUpData.user.id}`);
      console.log("\n🎉 You can now log in with the admin credentials!\n");
    }
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error("   Unknown error occurred");
    }
    console.error("\n💡 Alternative: Create user manually via Supabase Dashboard:");
    console.error("   1. Go to: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users");
    console.error("   2. Click 'Add User'");
    console.error("   3. Enter email and password");
    console.error("   4. Set 'Auto Confirm' to true\n");
    process.exit(1);
  }
}

createAdminUserSQL();

