-- Remove project_interest field from leads table
DROP INDEX IF EXISTS idx_leads_project_interest;
ALTER TABLE public.leads DROP COLUMN IF EXISTS project_interest;

-- Add description for cleanup
COMMENT ON TABLE public.leads IS 'Visitor contact submissions (formerly with project_interest, now removed)';
