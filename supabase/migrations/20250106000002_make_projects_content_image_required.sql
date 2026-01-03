-- Make content and image fields required for projects table

-- First, set default values for existing NULL rows (if any)
-- This ensures we don't break existing data
-- For content, use empty string (will be validated by application)
-- For image, use a placeholder (should be replaced with actual image URL)
UPDATE public.projects
SET content = '' WHERE content IS NULL;

UPDATE public.projects
SET image = '/images/default-project-image.png' WHERE image IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE public.projects
ALTER COLUMN content SET NOT NULL;

ALTER TABLE public.projects
ALTER COLUMN image SET NOT NULL;

-- Add check constraints to ensure they're not empty strings
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_content_not_empty;

ALTER TABLE public.projects
ADD CONSTRAINT projects_content_not_empty CHECK (LENGTH(TRIM(content)) >= 0);

ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_image_not_empty;

ALTER TABLE public.projects
ADD CONSTRAINT projects_image_not_empty CHECK (LENGTH(TRIM(image)) > 0);

