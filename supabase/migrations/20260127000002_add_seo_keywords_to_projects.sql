-- Add meta_keywords field to projects table
-- Note: meta_title and meta_description already exist from migration 20241226000001_add_seo_fields_to_projects.sql
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Add index for meta_keywords
CREATE INDEX IF NOT EXISTS idx_projects_meta_keywords ON public.projects(meta_keywords) WHERE meta_keywords IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.projects.meta_keywords IS 'SEO keywords/tags for search engines (comma-separated)';
