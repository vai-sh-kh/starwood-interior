/**
 * Admin User Creation Script
 *
 * This script creates/verifies an admin user in the remote Supabase database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Note: If Supabase Auth API returns 500 errors, the user may already exist.
 * Check the Supabase Dashboard to verify the user status.
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

async function createAdminUser() {
  if (!supabaseUrl) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    console.error("\n💡 To get your service role key:");
    console.error("   Settings → API → service_role");
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
    console.log("\n🔐 Creating Admin User (Remote Database)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Supabase URL: ${supabaseUrl}`);
    console.log(`📧 Admin Email: ${ADMIN_EMAIL}\n`);

    // 1️⃣ Try Admin API
    try {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (!error && data?.users) {
        const existingUser = data.users.find(
          (u) => u.email === ADMIN_EMAIL
        );

        if (existingUser) {
          console.log("✅ Admin user already exists!");
          console.log(`   User ID: ${existingUser.id}`);
          console.log(`   Email confirmed: ${existingUser.email_confirmed_at ? "Yes" : "No"}`);

          console.log("\n🔄 Updating password & confirming email...");
          const { error: updateError } =
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              password: ADMIN_PASSWORD,
              email_confirm: true,
            });

          if (updateError) {
            console.warn("⚠️ Could not update password via API");
          } else {
            console.log("✅ Password updated successfully!");
          }

          console.log("\n🎉 Admin user is ready!\n");
          return;
        }
      }
    } catch {
      console.warn("⚠️ Admin API failed, falling back to REST API...");
    }

    // 2️⃣ Fallback: REST API
    console.log("📧 Creating admin user via REST API...");

    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { role: "admin" },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Admin user created successfully!");
      console.log(`   User ID: ${result.user?.id}`);
      console.log("\n🎉 You can now log in!\n");
      return;
    }

    const errorText = await response.text();
    if (response.status === 422 || errorText.includes("already registered")) {
      console.log("✅ Admin user already exists.");
      console.log("💡 Reset password via Supabase Dashboard if needed.");
      return;
    }

    throw new Error(errorText);
  } catch (err) {
    console.error("\n❌ Error creating admin user");
    console.error(err?.message || err);
    process.exit(1);
  }
}

createAdminUser();
