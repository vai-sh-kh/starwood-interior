-- Fix leads tables service_interest to be TEXT[] (array) instead of TEXT
-- Also ensures project_interest is removed

-- 1. Safe remove project_interest if it still exists
ALTER TABLE public.leads 
DROP COLUMN IF EXISTS project_interest;

-- 2. Modify service_interest to be TEXT[]
-- First, drop the index if it exists on the old column
DROP INDEX IF EXISTS idx_leads_service_interest;

-- Alter the column type using a USING clause to handle conversion if there's data
-- Converting single text string to an array with that string
ALTER TABLE public.leads 
ALTER COLUMN service_interest TYPE TEXT[] 
USING CASE 
    WHEN service_interest IS NULL THEN NULL 
    WHEN service_interest = '' THEN NULL
    ELSE ARRAY[service_interest] 
END;

-- 3. Re-create index for the array column (GIN index is better for arrays)
CREATE INDEX IF NOT EXISTS idx_leads_service_interest_gin ON public.leads USING GIN (service_interest);

-- 4. Update comment
COMMENT ON COLUMN public.leads.service_interest IS 'List of services the lead is interested in';
