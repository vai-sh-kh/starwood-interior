# Database Migrations

This directory contains consolidated database migrations organized by functionality.

## Migration Order

1. **20241218000001_initial_schema.sql**
   - Core tables: blogs, projects, settings, leads
   - Universal `updated_at` trigger function
   - All RLS policies
   - Default settings

2. **20241225000001_services_and_subservices.sql**
   - Services table
   - Subservices table
   - Service-subservices join table
   - Gallery images tables (services, subservices, projects)
   - All updated_at triggers
   - All RLS policies

3. **20241225000002_create_admin_user.sql**
   - Creates initial admin user
   - Note: For production, use Supabase Dashboard or `pnpm tsx scripts/seed-admin.ts`

4. **20241226000001_additional_features.sql**
   - Blog tags and search indexes
   - Project SEO fields
   - Project info, quotes
   - Full-text search capabilities

## Running Migrations

### Local Development
```bash
# Reset database and apply all migrations
supabase db reset

# Or apply new migrations only
supabase migration up
```

### Remote/Production
```bash
# Push migrations to remote
supabase db push
```

## Creating Admin User

After migrations, create admin user:

```bash
pnpm tsx scripts/seed-admin.ts
```

Or use Supabase Dashboard → Authentication → Users → Add User

## Updated_at Triggers

All tables with `updated_at` columns have automatic triggers:
- `blogs`
- `projects`
- `settings`
- `leads`
- `services`
- `subservices`
- `subservice_gallery_images`

The universal function `update_updated_at_column()` handles all updates.

## Data Safety

- All migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` where appropriate
- Migrations are idempotent (safe to run multiple times)
- Data is preserved during migrations
- No data is deleted unless explicitly intended

## Backup

Original migrations are backed up in `supabase/migrations_backup/`

