-- Add status field to blogs table (similar to projects and services)

-- Add status field with check constraint (draft or published)
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' NOT NULL;

-- Add check constraint for status
ALTER TABLE public.blogs
DROP CONSTRAINT IF EXISTS blogs_status_check;

ALTER TABLE public.blogs
ADD CONSTRAINT blogs_status_check CHECK (status IN ('draft', 'published'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);

-- Update RLS policies to handle status field
-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can read non-archived blogs" ON public.blogs;

-- Ensure public can read published, non-archived blogs (for public website)
CREATE POLICY "Anyone can read published, non-archived blogs"
    ON public.blogs
    FOR SELECT
    USING (status = 'published' AND (archived IS NULL OR archived = false));

-- Ensure authenticated users can read all blogs (for admin panel)
DROP POLICY IF EXISTS "Authenticated users can read all blogs" ON public.blogs;
CREATE POLICY "Authenticated users can read all blogs"
    ON public.blogs
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Keep existing insert, update, delete policies (they already check for authenticated users)

