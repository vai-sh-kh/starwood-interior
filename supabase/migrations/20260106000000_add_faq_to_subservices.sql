-- Add FAQ field to subservices table
-- FAQ will be stored as JSONB array of objects with question and answer
ALTER TABLE public.subservices 
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN public.subservices.faq IS 'Array of FAQ objects with structure: [{"question": "string", "answer": "string"}]';

