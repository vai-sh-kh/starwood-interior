-- Add SEO fields to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add indexes for SEO fields if needed
CREATE INDEX IF NOT EXISTS idx_projects_meta_title ON public.projects(meta_title) WHERE meta_title IS NOT NULL;

