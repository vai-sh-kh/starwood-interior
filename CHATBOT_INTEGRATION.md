# Chatbot Integration - Complete Setup Guide

## ✅ What Has Been Completed

### 1. Database Migration
- Created migration file: `supabase/migrations/20260107000000_add_chat_id_to_leads.sql`
- Adds `chat_id` column to the `leads` table
- Adds index for better query performance

### 2. API Endpoint
- Created webhook endpoint: `/api/webhooks/collect-chat`
- Location: `src/app/api/webhooks/collect-chat/route.ts`
- Validates incoming payload with Zod
- Creates leads with source `"collect_chat"`
- Automatically generates avatar colors
- Handles errors gracefully

### 3. UI Updates
- Added chatbot indicator (Bot icon) in leads table
- Added pink badge color for chatbot leads
- Added "Chatbot" option in source dropdown
- Shows chat_id in lead detail view
- Bot icon appears next to lead name in table

### 4. TypeScript Types
- Updated `src/lib/supabase/types.ts` to include `chat_id` field

## 🚀 Next Steps - Run Migration on Remote Database

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
-- Add chat_id field to leads table for chatbot integration
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS chat_id TEXT;

-- Add index for chat_id for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_chat_id ON public.leads(chat_id);

-- Add comment to explain the field
COMMENT ON COLUMN public.leads.chat_id IS 'Chat ID from chatbot system (e.g., Collect.chat)';
```

6. Click **Run** to execute the migration
7. Verify the column was added by checking the table structure

### Option 2: Via Supabase CLI

1. **Login to Supabase CLI** (if not already logged in):
   ```bash
   supabase login
   ```

2. **Link to your project** (if not already linked):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   You can find your project ref in your Supabase dashboard URL:
   `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

3. **Push the migration**:
   ```bash
   supabase db push
   ```

4. **Regenerate TypeScript types** (optional, already done manually):
   ```bash
   pnpm supabase:types:generate
   ```

### Option 3: Use the Provided Script

```bash
# Make the script executable
chmod +x scripts/link-and-push-migrations.sh

# Run the script (it will prompt for project ref if needed)
./scripts/link-and-push-migrations.sh
```

## 🔗 Configure Your Chatbot (Collect.chat)

1. Go to your Collect.chat dashboard
2. Navigate to **Settings** → **Webhooks** or **Integrations**
3. Add a new webhook with the following details:
   - **URL**: `https://yourdomain.com/api/webhooks/collect-chat`
   - **Method**: `POST`
   - **Content-Type**: `application/json`

4. Configure the webhook payload to send:
   ```json
   {
     "name": "{{user_name}}",
     "email": "{{user_email}}",
     "phone": "{{user_phone}}",
     "message": "{{user_message}}",
     "chat_id": "{{chat_id}}"
   }
   ```

   Note: Adjust the field names based on what Collect.chat provides. The endpoint accepts:
   - `name` (required)
   - `email` (required)
   - `phone` (optional)
   - `message` (optional)
   - `chat_id` (optional)

## ✅ Verification

After running the migration:

1. **Check the database**:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'leads' AND column_name = 'chat_id';
   ```

2. **Test the webhook endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/collect-chat \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+1234567890",
       "message": "Hello from chatbot",
       "chat_id": "chat_123"
     }'
   ```

3. **Check your admin dashboard**:
   - Go to Leads section
   - You should see the new lead with:
     - Pink "Chatbot" badge
     - Bot icon next to the name
     - Chat ID displayed in detail view

## 📋 Features

- ✅ Automatic lead creation from chatbot
- ✅ Visual indicator (Bot icon) for chatbot leads
- ✅ Pink badge color for easy identification
- ✅ Chat ID tracking and display
- ✅ Full integration with existing leads system
- ✅ Error handling and validation
- ✅ TypeScript type safety

## 🎨 UI Features

- **Table View**: Bot icon appears next to lead name
- **Source Badge**: Pink badge with "Collect Chat" label
- **Detail View**: Shows Chat ID if available
- **Form**: "Chatbot" option in source dropdown

## 🔒 Security

- The endpoint validates all input data
- Email validation ensures proper format
- SQL injection protection via Supabase client
- Error messages don't expose sensitive information

## 📝 Notes

- The migration uses `IF NOT EXISTS` so it's safe to run multiple times
- Leads from chatbot will have `status: "new"` by default
- Avatar colors are automatically generated based on name
- All chatbot leads are marked with `source: "collect_chat"`

