#!/bin/bash

# Script to run chatbot migration on remote Supabase database
# This will add the chat_id column to the leads table

set -e

echo "🚀 Running Chatbot Migration on Remote Database"
echo "================================================"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo ""
    echo "Install it from: https://supabase.com/docs/guides/cli"
    echo "Or run: npm install -g supabase"
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
PROJECT_REF=""
if [ -f ".supabase/.linked" ]; then
    PROJECT_REF=$(cat .supabase/.linked 2>/dev/null || echo "")
    echo "📋 Found linked project: $PROJECT_REF"
else
    echo "📋 No project linked yet"
    echo ""
    echo "Please provide your Supabase project reference."
    echo "You can find it in your Supabase dashboard URL:"
    echo "   https://supabase.com/dashboard/project/YOUR_PROJECT_REF"
    echo ""
    read -p "Enter project reference: " PROJECT_REF
    
    if [ -z "$PROJECT_REF" ]; then
        echo "❌ Project reference is required"
        exit 1
    fi
    
    echo ""
    echo "🔗 Linking to project: $PROJECT_REF"
    supabase link --project-ref "$PROJECT_REF"
    
    if [ $? -ne 0 ]; then
        echo "❌ Error linking to project"
        exit 1
    fi
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
    echo "📋 The following migration was applied:"
    echo "   - 20260107000000_add_chat_id_to_leads.sql"
    echo "   (Adds chat_id column to leads table)"
    echo ""
    echo "✅ Chatbot integration is now ready!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Configure Collect.chat webhook with endpoint:"
    echo "      https://yourdomain.com/api/webhooks/collect-chat"
    echo "   2. Test the webhook to create a lead"
    echo "   3. Check your admin dashboard to see the new lead"
else
    echo ""
    echo "❌ Error pushing migrations"
    echo "Please check the error messages above"
    exit 1
fi

