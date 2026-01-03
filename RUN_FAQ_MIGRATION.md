# Run FAQ Migration Remotely

The migration file `20260106000000_add_faq_to_subservices.sql` needs to be applied to your remote Supabase database.

## Option 1: Run via Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
-- Add FAQ field to subservices table
-- FAQ will be stored as JSONB array of objects with question and answer
ALTER TABLE public.subservices 
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN public.subservices.faq IS 'Array of FAQ objects with structure: [{"question": "string", "answer": "string"}]';
```

6. Click **Run** to execute the migration
7. Verify the column was added by checking the table structure

## Option 2: Run via Supabase CLI

If you're logged in to Supabase CLI:

```bash
# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations including the FAQ one
supabase db push
```

## Option 3: Run via Script

```bash
# Make the script executable
chmod +x scripts/link-and-push-migrations.sh

# Run the script (it will use the default project ref or prompt you)
./scripts/link-and-push-migrations.sh
```

## Verification

After running the migration, verify it worked:

```sql
-- Check if the column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'subservices' AND column_name = 'faq';
```

You should see:
- `column_name`: faq
- `data_type`: jsonb
- `column_default`: '[]'::jsonb

## Troubleshooting

If you get an error that the column already exists, that's fine - the migration uses `IF NOT EXISTS` so it's safe to run multiple times.

