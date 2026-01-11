# Supabase Project Setup - Complete

## ✅ Completed Steps

1. **Project Created**: New Supabase project `starwood-cms-new` (ID: `uaayrubjcbypkmuuqetl`)
   - Region: `ap-northeast-2`
   - Status: ACTIVE_HEALTHY
   - URL: `https://uaayrubjcbypkmuuqetl.supabase.co`

2. **All Migrations Applied**: All 40 migrations have been successfully applied
   - Verified via `mcp_supabase_list_migrations`
   - All database tables, indexes, RLS policies, and triggers are in place

3. **Environment File Created**: `.env.local` has been created with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` placeholders

## ⚠️ Remaining Steps

### 1. Add Service Role Key

The service role key is required for admin user creation and other admin operations.

**To get the service role key:**
1. Go to: https://supabase.com/dashboard/project/uaayrubjcbypkmuuqetl/settings/api
2. Scroll down to "Project API keys"
3. Copy the `service_role` key (⚠️ Keep it secret!)
4. Add it to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### 2. Seed Admin User

Once the service role key is added, run:
```bash
pnpm seed:admin
```

Or:
```bash
pnpm tsx scripts/seed-admin.ts
```

This will create the admin user with:
- Email: `admin@starwood.com` (or update in `.env.local`)
- Password: `Admin@123456` (or update in `.env.local`)

### 3. Verify Build

Run the build to ensure everything works:
```bash
pnpm build
```

## Project Information

- **Project ID**: `uaayrubjcbypkmuuqetl`
- **Project Name**: `starwood-cms-new`
- **Organization**: `xqlworhqdlfekjjrrbpr`
- **Region**: `ap-northeast-2`
- **Database Host**: `db.uaayrubjcbypkmuuqetl.supabase.co`
- **PostgreSQL Version**: 17.6.1.063

## Migration Summary

All 40 migrations have been applied:
- Core tables: projects, blogs, leads, settings, services, subservices
- Gallery images tables for projects, services, and subservices
- Storage buckets: blog-images, project-images, service-images
- RLS policies configured for all tables
- Indexes and triggers set up
- FAQ support for subservices
- Chatbot integration fields for leads

## Next Steps

1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. Run `pnpm seed:admin` to create admin user
3. Run `pnpm build` to verify build
4. Start development: `pnpm dev`

## Scripts Available

- `pnpm setup:supabase:new` - Master setup script
- `pnpm migrate:mcp` - Run migrations via MCP
- `pnpm verify:migrations` - Verify migrations
- `pnpm seed:admin` - Seed admin user

