-- Update projects table to add category_id, status, and content fields

-- Add category_id foreign key to blog_categories
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL;

-- Add status field with check constraint (draft or published)
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' NOT NULL;

-- Add check constraint for status
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE public.projects
ADD CONSTRAINT projects_status_check CHECK (status IN ('draft', 'published'));

-- Add content field for rich text editor
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS content TEXT;

-- Ensure updated_at column exists and has default
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read published projects" ON public.projects;
DROP POLICY IF EXISTS "Only authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Only authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Only authenticated users can delete projects" ON public.projects;

-- Create policies for projects (public read for published, authenticated write)
CREATE POLICY "Anyone can read published projects"
    ON public.projects
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Only authenticated users can insert projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update projects"
    ON public.projects
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete projects"
    ON public.projects
    FOR DELETE
    USING (auth.role() = 'authenticated');

