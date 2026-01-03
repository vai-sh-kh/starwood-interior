-- Fix RLS policies for projects table SELECT operations
-- Authenticated users need to be able to read ALL projects (draft and published) for admin operations
-- Public users can only read published projects

-- Add policy for authenticated users to read all projects
CREATE POLICY "Authenticated users can read all projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- The existing "Anyone can read published projects" policy will still work for public access
-- Both policies can coexist - PostgreSQL will use OR logic between them

