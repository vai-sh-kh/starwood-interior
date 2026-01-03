-- Add project_info, quote, and quote_author fields to projects table

-- Add project_info JSONB column for storing project metadata
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS project_info JSONB DEFAULT '{}'::jsonb;

-- Add quote TEXT column for testimonial quote
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS quote TEXT;

-- Add quote_author TEXT column for quote author name
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS quote_author TEXT;

-- Create index on project_info for better query performance (GIN index for JSONB)
CREATE INDEX IF NOT EXISTS idx_projects_project_info ON public.projects USING GIN (project_info);

-- Create index on quote_author for filtering/sorting
CREATE INDEX IF NOT EXISTS idx_projects_quote_author ON public.projects(quote_author) WHERE quote_author IS NOT NULL;

-- Add comment to document the structure of project_info JSONB
COMMENT ON COLUMN public.projects.project_info IS 'JSONB object containing project metadata: {client, location, size, completion, services[]}';

-- RLS policies are already in place from previous migrations
-- The new columns will inherit the existing RLS policies automatically

