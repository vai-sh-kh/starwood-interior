-- Create projects table with base structure
-- Additional fields will be added in later migrations

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    is_new BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_new ON public.projects(is_new) WHERE is_new = TRUE;

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create initial policies using auth.uid() (preferred method)
-- Public read access will be added in later migrations when status field is added
-- For now, we'll allow authenticated users to read all projects
CREATE POLICY "Authenticated users can read all projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

