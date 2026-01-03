#!/bin/bash

# Script to apply chatbot_metadata migration to remote Supabase database
# This will add the chatbot_metadata JSONB column to the leads table

set -e

echo "🚀 Applying Chatbot Metadata Migration"
echo "========================================"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Install it from: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "📋 Checking login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo ""
    echo "Please run: supabase login"
    echo "This will open a browser for authentication."
    exit 1
fi

echo "✅ Logged in to Supabase CLI"
echo ""

# Get project reference
PROJECT_REF="iqliznhufqcwughxydwi"

# Check if already linked
if [ -d ".supabase" ] && [ -f ".supabase/.linked" ]; then
    CURRENT_LINK=$(cat .supabase/.linked 2>/dev/null || echo "")
    if [ "$CURRENT_LINK" = "$PROJECT_REF" ]; then
        echo "✅ Already linked to project: $PROJECT_REF"
    else
        echo "⚠️  Currently linked to different project: $CURRENT_LINK"
        echo "Linking to project: $PROJECT_REF"
        supabase link --project-ref "$PROJECT_REF"
    fi
else
    echo "🔗 Linking to project: $PROJECT_REF"
    supabase link --project-ref "$PROJECT_REF"
fi

if [ $? -ne 0 ]; then
    echo "❌ Error linking to project"
    exit 1
fi

echo ""
echo "📦 Pushing migrations to remote database..."
echo ""

# Push all migrations (this will apply the new chatbot_metadata migration)
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo ""
    echo "📝 Migration Details:"
    echo "   - Added chatbot_metadata JSONB column to leads table"
    echo "   - Added GIN index for better query performance"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Verify the migration in Supabase Dashboard → Database → Migrations"
    echo "   2. Test the webhook endpoint with additional chatbot fields"
    echo "   3. Check the leads dashboard to see additional fields displayed"
else
    echo ""
    echo "❌ Error applying migration"
    echo "Please check the error messages above"
    echo ""
    echo "💡 Alternative: Apply migration manually via Supabase Dashboard:"
    echo "   1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
    echo "   2. Copy and paste the SQL from: supabase/migrations/20260108000000_add_chatbot_metadata_to_leads.sql"
    echo "   3. Click Run"
    exit 1
fi

