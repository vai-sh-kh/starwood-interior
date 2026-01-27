-- Add project_interest field to leads table for contact form project selection
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS project_interest TEXT;

-- Add index for filtering and querying by project interest
CREATE INDEX IF NOT EXISTS idx_leads_project_interest ON public.leads(project_interest) WHERE project_interest IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.leads.project_interest IS 'Project the lead is interested in from contact form selection';
