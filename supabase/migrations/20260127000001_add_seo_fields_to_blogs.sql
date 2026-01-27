-- Add SEO fields to blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS meta_description TEXT;

ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Add indexes for SEO fields for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_meta_title ON public.blogs(meta_title) WHERE meta_title IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blogs_meta_description ON public.blogs(meta_description) WHERE meta_description IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.blogs.meta_title IS 'SEO meta title for search engines and social sharing';
COMMENT ON COLUMN public.blogs.meta_description IS 'SEO meta description for search engines and social sharing';
COMMENT ON COLUMN public.blogs.meta_keywords IS 'SEO keywords/tags for search engines (comma-separated)';
