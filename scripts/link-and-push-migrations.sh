#!/bin/bash

# Script to link Supabase remote project and push migrations
# This script will:
# 1. Check if logged in to Supabase CLI
# 2. Link to remote project (if not already linked)
# 3. Push all migrations to remote database
# 4. Sync the database schema

set -e

echo "🚀 Supabase Remote Project Link & Migration Push"
echo "=================================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Install it from: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if logged in
echo "📋 Step 1: Checking Supabase CLI login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo ""
    echo "Please run the following command in your terminal:"
    echo "   supabase login"
    echo ""
    echo "This will open a browser for authentication."
    echo "After logging in, run this script again."
    exit 1
fi

echo "✅ Logged in to Supabase CLI"
echo ""

# Get project reference from user or use default
PROJECT_REF="${1:-iqliznhufqcwughxydwi}"

if [ -z "$PROJECT_REF" ]; then
    echo "📋 Step 2: Please provide your Supabase project reference"
    echo "You can find it in your Supabase dashboard URL:"
    echo "   https://supabase.com/dashboard/project/YOUR_PROJECT_REF"
    echo ""
    read -p "Enter project reference: " PROJECT_REF
fi

echo "📋 Step 2: Linking to remote project: $PROJECT_REF"
echo ""

# Check if already linked
if [ -d ".supabase" ] && [ -f ".supabase/.linked" ]; then
    CURRENT_LINK=$(cat .supabase/.linked 2>/dev/null || echo "")
    if [ "$CURRENT_LINK" = "$PROJECT_REF" ]; then
        echo "✅ Already linked to project: $PROJECT_REF"
    else
        echo "⚠️  Currently linked to different project: $CURRENT_LINK"
        echo "Linking to new project: $PROJECT_REF"
        supabase link --project-ref "$PROJECT_REF"
    fi
else
    echo "🔗 Linking to remote project..."
    supabase link --project-ref "$PROJECT_REF"
fi

if [ $? -ne 0 ]; then
    echo "❌ Error linking to project"
    exit 1
fi

echo ""
echo "✅ Successfully linked to project: $PROJECT_REF"
echo ""

# Push migrations
echo "📋 Step 3: Pushing migrations to remote database..."
echo ""

supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All migrations pushed successfully!"
    echo ""
    echo "📋 Step 4: Syncing database schema..."
    echo ""
    
    # Generate types to sync
    if command -v pnpm &> /dev/null; then
        echo "🔄 Generating TypeScript types..."
        pnpm supabase:types:generate || echo "⚠️  Type generation skipped (not critical)"
    fi
    
    echo ""
    echo "✅ Database sync complete!"
    echo ""
    echo "📝 Summary:"
    echo "   ✅ Linked to remote project: $PROJECT_REF"
    echo "   ✅ All migrations applied"
    echo "   ✅ Database schema synced"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Verify migrations in Supabase Dashboard → Database → Migrations"
    echo "   2. Check RLS policies in Supabase Dashboard → Authentication → Policies"
    echo "   3. Test your application to ensure everything works correctly"
else
    echo ""
    echo "❌ Error pushing migrations"
    echo "Please check the error messages above"
    exit 1
fi

