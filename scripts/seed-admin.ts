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
    console.error("   1. Go to your Supabase Dashboard");
    console.error("   2. Navigate to: Settings → API");
    console.error("   3. Copy the 'service_role' key (keep it secret!)");
    console.error("   4. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY\n");
    process.exit(1);
  }

  if (!ADMIN_EMAIL) {
    console.error("❌ Error: ADMIN_EMAIL is not set in .env.local");
    console.error("   Add ADMIN_EMAIL=your-email@example.com to .env.local\n");
    process.exit(1);
  }

  if (!ADMIN_PASSWORD) {
    console.error("❌ Error: ADMIN_PASSWORD is not set in .env.local");
    console.error("   Add ADMIN_PASSWORD=your-secure-password to .env.local\n");
    process.exit(1);
  }

  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  });

  try {
    console.log("\n🔐 Creating Admin User (Remote Database)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`📡 Remote Supabase: ${supabaseUrl}`);
    console.log(`📧 Admin Email: ${ADMIN_EMAIL}\n`);

    // Try using Supabase Admin API first
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!listError && existingUsers?.users) {
        const existingUser = existingUsers.users.find((u) => u.email === ADMIN_EMAIL);
        
        if (existingUser) {
          console.log(`✅ Admin user already exists!`);
          console.log(`   User ID: ${existingUser.id}`);
          console.log(`   Email: ${existingUser.email}`);
          console.log(`   Email Confirmed: ${existingUser.email_confirmed_at ? 'Yes' : 'No'}`);
          
          // Update password and confirm email
          console.log("\n🔄 Updating password and confirming email...");
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              password: ADMIN_PASSWORD,
              email_confirm: true,
            }
          );

          if (updateError) {
            console.log("⚠️  Could not update password via Admin API");
            console.log("   User exists but password may need manual reset via Dashboard");
          } else {
            console.log("✅ Password updated and email confirmed!");
          }
          console.log("\n🎉 Admin user is ready to use!\n");
          return;
        }
      }
    } catch {
      console.log("⚠️  Admin API not available, trying REST API...");
    }

    // If Admin API doesn't work, try REST API
    console.log(`📧 Creating new admin user via REST API...`);
    const createUrl = `${supabaseUrl}/auth/v1/admin/users`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      }),
    });

    if (createResponse.ok) {
      const newUser = await createResponse.json();
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${newUser.user?.email || ADMIN_EMAIL}`);
      console.log(`   User ID: ${newUser.user?.id || 'N/A'}`);
      console.log("\n🎉 You can now log in with the admin credentials!\n");
    } else {
      const errorText = await createResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Check if user already exists error
      if (errorData.message?.includes('already registered') || 
          errorData.message?.includes('User already registered') ||
          createResponse.status === 422) {
        console.log(`✅ Admin user already exists in remote database!`);
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log("\n💡 If you need to reset the password:");
        console.log("   1. Go to: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users");
        console.log("   2. Find the user and click 'Reset Password'\n");
        return;
      }

      throw new Error(errorData.message || `HTTP ${createResponse.status}: ${createResponse.statusText}`);
    }
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if ('status' in error) {
        console.error(`   Status: ${(error as { status?: number }).status}`);
      }
      if ('statusText' in error) {
        console.error(`   Status Text: ${(error as { statusText?: string }).statusText}`);
      }
    } else if (typeof error === 'object' && error !== null) {
      console.error("   Error details:", JSON.stringify(error, null, 2));
    } else {
      console.error("   Unknown error:", error);
    }
    console.error("\n💡 Troubleshooting:");
    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is correct:", supabaseUrl);
    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is valid for this project");
    console.error("   - Ensure the service role key has not expired");
    console.error("   - Try getting a fresh service role key from:");
    console.error("     https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/settings/api");
    console.error("\n📝 Note: The admin user may already exist in the remote database.");
    console.error("   Check the Supabase Dashboard → Authentication → Users");
    console.error("   If the user exists, you can reset the password there.\n");
    
    // Don't exit with error code if it's a 500 - user might already exist
    if (error instanceof Error && 'status' in error && (error as { status?: number }).status === 500) {
      console.log("⚠️  Supabase Auth API returned 500 error.");
      console.log("   This often means the user already exists or there's a temporary API issue.");
      console.log("   Please verify the user in the Supabase Dashboard.\n");
    }
    process.exit(1);
  }
}

createAdminUser();
