-- Add slug field to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for slug
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- Update existing projects to have slugs based on title (if any exist)
-- This is a one-time migration for existing data
UPDATE public.projects
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Make slug required for new projects (but allow NULL for now to handle existing data)
-- In the application, we'll ensure slug is always provided for new projects

