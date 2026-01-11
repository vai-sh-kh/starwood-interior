# How to Get Service Role Key

To run all seeders, you need the Supabase service role key. Here's how to get it:

## Steps:

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard/project/uaayrubjcbypkmuuqetl/settings/api

2. **Find the Service Role Key**
   - Scroll down to "Project API keys" section
   - Look for the key labeled "service_role" (not "anon" or "publishable")
   - Click "Reveal" or "Copy" to get the key

3. **Add to .env.local**
   - Open `.env.local` in your project
   - Find the line: `# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`
   - Replace it with: `SUPABASE_SERVICE_ROLE_KEY=your-actual-key-here`

4. **Run Seeders**
   ```bash
   ./scripts/run-all-seeders.sh
   ```
   
   Or use npm:
   ```bash
   pnpm seed:admin
   pnpm seed:all
   ```

## ⚠️ Security Note

The service role key has full access to your database. Never commit it to git or share it publicly!

