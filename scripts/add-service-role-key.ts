/**
 * Helper script to add SUPABASE_SERVICE_ROLE_KEY to .env.local
 * 
 * Usage: pnpm tsx scripts/add-service-role-key.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import * as readline from "readline";

const envPath = resolve(process.cwd(), ".env.local");

function getServiceRoleKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("\n🔐 Service Role Key Setup");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("To get your service role key:");
    console.log("1. Go to: https://supabase.com/dashboard/project/icitfkvkikpekpzbxdoz/settings/api");
    console.log("2. Scroll down to 'Project API keys' section");
    console.log("3. Find the 'service_role' key (it's secret - keep it safe!)");
    console.log("4. Copy the key\n");
    
    rl.question("Paste your service role key here: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function updateEnvFile(serviceRoleKey: string) {
  try {
    let envContent = readFileSync(envPath, "utf-8");
    
    // Update or add the service role key
    if (envContent.includes("SUPABASE_SERVICE_ROLE_KEY=")) {
      envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*/,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
      );
    } else {
      envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}\n`;
    }
    
    writeFileSync(envPath, envContent, "utf-8");
    console.log("\n✅ Service role key added to .env.local successfully!\n");
  } catch (error) {
    console.error("\n❌ Error updating .env.local:");
    console.error(error);
    process.exit(1);
  }
}

async function main() {
  const serviceRoleKey = await getServiceRoleKey();
  
  if (!serviceRoleKey) {
    console.error("\n❌ No service role key provided. Exiting.\n");
    process.exit(1);
  }
  
  await updateEnvFile(serviceRoleKey);
}

main();

