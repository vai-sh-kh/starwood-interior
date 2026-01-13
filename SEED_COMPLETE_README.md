# Complete Database Seeding Script

This script seeds your Supabase database with 20 realistic items in each table.

## What Gets Seeded

The script will populate the following tables with **20 items each**:

1. **Blog Categories** (20 items)
   - Interior Design Trends, Home Renovation Tips, Sustainable Living, etc.

2. **Blogs** (20 items)
   - Complete blog posts with titles, content, excerpts, images, authors, and categories
   - Mix of published and draft statuses

3. **Projects** (20 items)
   - Full project entries with descriptions, content, images, metadata
   - Includes project info (client, location, size, completion date)
   - Some with client testimonials

4. **Services** (20 items)
   - Complete service pages with descriptions, content, SEO metadata
   - Mix of published and draft statuses
   - Some marked as "new"

5. **Subservices** (20 items)
   - Detailed subservice pages with content and FAQs
   - Linked to parent services
   - Includes SEO metadata

6. **Leads** (20 items)
   - Realistic lead entries with names, emails, phones, messages
   - Various statuses (new, contacted, qualified, converted, closed)
   - Different sources (contact_form, chatbot, phone, email, referral, social_media)

## Prerequisites

Before running the seeder, you **must** have the following in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Getting Your Service Role Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Settings → API**
4. Find the **"service_role"** key (NOT the "anon" key)
5. Click "Reveal" and copy the key
6. Add it to your `.env.local` file

## How to Run

### Option 1: Using npm/pnpm script (Recommended)

```bash
pnpm seed:complete
```

or

```bash
npm run seed:complete
```

### Option 2: Direct execution

```bash
tsx scripts/seed-all-data.ts
```

## What Happens During Seeding

The script will:

1. ✅ Validate environment variables
2. ✅ Connect to your Supabase database
3. ✅ Seed tables in the correct order (respecting foreign key dependencies):
   - Blog Categories first
   - Blogs (referencing categories)
   - Projects
   - Services (referencing categories)
   - Subservices (referencing services)
   - Leads
4. ✅ Display progress for each table
5. ✅ Show a summary of all created records

## Sample Output

```
🌱 Starting Complete Database Seeding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Supabase URL: https://your-project.supabase.co
🔑 Service Role Key: ✓ Configured

📚 Seeding Blog Categories...
✅ Created 20 blog categories

📝 Seeding Blogs...
✅ Created 20 blogs

🏗️ Seeding Projects...
✅ Created 20 projects

🛠️ Seeding Services...
✅ Created 20 services

🔧 Seeding Subservices...
✅ Created 20 subservices

👥 Seeding Leads...
✅ Created 20 leads

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Database Seeding Completed Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✓ Blog Categories: 20
   ✓ Blogs: 20
   ✓ Projects: 20
   ✓ Services: 20
   ✓ Subservices: 20
   ✓ Leads: 20

   Total Records: 120
```

## Features

### Realistic Data
- All entries have meaningful, realistic content
- Proper relationships between tables
- Varied statuses and metadata
- Random creation dates within the last year

### Complete Fields
All fields are populated including:
- SEO metadata (meta_title, meta_description)
- Rich content (HTML formatted)
- Images (placeholder paths)
- Tags and categories
- Project information (JSONB)
- FAQ data (JSONB for subservices)
- Lead metadata (avatar colors, sources, statuses)

### Safe Execution
- Validates environment variables before running
- Respects foreign key constraints
- Provides detailed error messages
- Shows progress for each table

## Troubleshooting

### Error: Missing SUPABASE_SERVICE_ROLE_KEY

Make sure you've added the service role key to `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error: Foreign Key Constraint

The script seeds tables in the correct order. If you see foreign key errors, make sure:
1. Your database migrations are up to date
2. The tables exist in your database
3. You haven't modified the table structure

### Error: Duplicate Entries

If you've already run the seeder, you may get duplicate slug errors. To re-seed:

1. Clear the existing data from your tables
2. Run the seeder again

## Notes

- The script uses the **service role key** to bypass Row Level Security (RLS)
- All created records will have random `created_at` timestamps within the last year
- Images use placeholder paths (e.g., `/images/blog-1.jpg`) - you'll need to add actual images
- Some items are marked as "new" or have "draft" status for testing purposes

## Related Scripts

- `pnpm seed:admin` - Create admin user only
- `pnpm seed:all` - Run individual seeders sequentially
- `pnpm seed:all:with-admin` - Run all seeders including admin creation
