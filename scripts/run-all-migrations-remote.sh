#!/bin/bash

# Script to run all migrations on remote Supabase database
# Make sure you have Supabase CLI installed and are logged in

echo "🚀 Running All Migrations on Remote Database"
echo "=============================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Install it from: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if linked to remote project
echo "📋 Checking Supabase project link..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo "Please run: supabase login"
    exit 1
fi

echo ""
echo "📦 Pushing all migrations to remote database..."
echo ""

# Push all migrations
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All migrations applied successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Verify the RLS policies in Supabase Dashboard → Authentication → Policies"
    echo "   2. Test creating/updating services in the admin panel"
    echo "   3. Check that authenticated users can read all services (including drafts)"
else
    echo ""
    echo "❌ Error applying migrations"
    echo "Please check the error messages above"
    exit 1
fi

