# Quick Start: Running All Seeders

## ⚠️ Prerequisite: Service Role Key

Before running seeders, you **must** add the service role key to `.env.local`.

### Get Service Role Key:

1. **Open Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/uaayrubjcbypkmuuqetl/settings/api
   - You may need to sign in first

2. **Copy the Service Role Key**
   - Scroll to "Project API keys" section
   - Find the key labeled **"service_role"** (not "anon")
   - Click "Reveal" or copy the key

3. **Add to .env.local**
   ```bash
   # Open .env.local and add:
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Run All Seeders

Once the service role key is added, run:

```bash
# Option 1: Use the shell script (recommended)
./scripts/run-all-seeders.sh

# Option 2: Use npm script
pnpm seed:all:with-admin

# Option 3: Run individually
pnpm seed:admin
pnpm seed:all
```

## What Gets Seeded

The seeders will create:

1. **Admin User** - Admin account for login
2. **Blog Categories** - Sample blog categories
3. **Blogs** - Sample blog posts
4. **Projects** - Sample project entries
5. **Services** - Sample service entries
6. **Subservices** - Sample subservice entries
7. **Service-Subservice Relationships** - Links between services and subservices
8. **Leads** - Sample lead entries

## Current Environment

- **Project URL**: https://uaayrubjcbypkmuuqetl.supabase.co
- **Admin Email**: admin@starwood.com (set in .env.local)
- **Admin Password**: Admin@123456 (set in .env.local)

You can change the admin email/password in `.env.local` before running seeders.

