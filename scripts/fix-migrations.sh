#!/bin/bash

# Script to fix migration history and push changes

echo "🔧 Fixing migration history..."

# Repair migration 007 (mark as reverted so it can be re-applied properly)
# If it was already applied as 'nammer', we want to re-run it as 'banner_title' (using IF NOT EXISTS will prevent errors on existing cols, but banner_title will be added)
supabase migration repair --status reverted 20260127000007

# Repair migration 008 (mark as reverted/deleted since we deleted the file)
# We don't want the remote to think it has 008 applied if we deleted it locally.
# If 008 failed on remote, it's likely not marked applied. If it was, we revert it.
supabase migration repair --status reverted 20260127000008

echo "📦 Pushing fixed migrations..."
supabase db push

echo "✅ Done!"
