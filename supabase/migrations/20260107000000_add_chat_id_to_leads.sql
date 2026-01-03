-- Add chat_id field to leads table for chatbot integration
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS chat_id TEXT;

-- Add index for chat_id for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_chat_id ON public.leads(chat_id);

-- Add comment to explain the field
COMMENT ON COLUMN public.leads.chat_id IS 'Chat ID from chatbot system (e.g., Collect.chat)';

