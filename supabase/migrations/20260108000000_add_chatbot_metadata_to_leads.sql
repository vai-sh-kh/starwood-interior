-- Add chatbot_metadata JSONB column to leads table for storing additional chatbot fields
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS chatbot_metadata JSONB;

-- Add index for chatbot_metadata for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_chatbot_metadata ON public.leads USING GIN (chatbot_metadata);

-- Add comment to explain the field
COMMENT ON COLUMN public.leads.chatbot_metadata IS 'Additional metadata from chatbot system (e.g., session_id, timestamp, custom fields)';

