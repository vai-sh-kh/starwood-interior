# RLS Policy Fix Summary

## Issue
Error code `42501`: "new row violates row-level security policy for table \"services\""

## Root Cause
The RLS policies for the `services` table (and related tables) were missing:
1. A policy allowing authenticated users to read ALL services (not just published ones) - needed for admin panel
2. Proper `WITH CHECK` clauses on UPDATE policies
3. Consistent use of `auth.uid() IS NOT NULL` instead of `auth.role() = 'authenticated'`

## Solution
Created migration `20260103000002_fix_all_rls_policies_final.sql` that:

1. **Services Table:**
   - Adds policy for authenticated users to read all services
   - Fixes INSERT/UPDATE/DELETE policies with proper `WITH CHECK` clauses
   - Uses `auth.uid() IS NOT NULL` consistently

2. **Service Gallery Images Table:**
   - Fixes all policies with proper `WITH CHECK` clauses

3. **Subservices Table:**
   - Ensures authenticated users can read all subservices
   - Fixes all policies with proper `WITH CHECK` clauses

4. **Subservice Gallery Images Table:**
   - Fixes all policies with proper `WITH CHECK` clauses

## Running Migrations on Remote

### Option 1: Using Supabase CLI (Recommended)
```bash
# Make sure you're linked to your remote project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations to remote
pnpm run supabase:db:push
# OR
supabase db push
```

### Option 2: Manual via Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20260103000002_fix_all_rls_policies_final.sql`
3. Paste and execute in SQL Editor

### Option 3: Using Supabase CLI with specific migration
```bash
# Link to remote project first
supabase link --project-ref YOUR_PROJECT_REF

# Push all pending migrations
supabase db push
```

## Verification
After running migrations, verify the policies are correct:

```sql
-- Check services table policies
SELECT * FROM pg_policies WHERE tablename = 'services';

-- Check subservices table policies  
SELECT * FROM pg_policies WHERE tablename = 'subservices';

-- Test insert (should work for authenticated users)
-- This should work in admin panel now
```

## Important Notes
- The migration is idempotent (safe to run multiple times)
- All policies use `DROP POLICY IF EXISTS` before creating
- Both public and authenticated user policies can coexist (PostgreSQL uses OR logic)
- The `WITH CHECK` clause is crucial for UPDATE operations to work correctly

