-- Fix RLS policies for projects and project_gallery_images tables
-- Use auth.uid() IS NOT NULL instead of auth.role() = 'authenticated'
-- This is more reliable for checking authentication status

-- Fix projects table policies
DROP POLICY IF EXISTS "Only authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Only authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Only authenticated users can delete projects" ON public.projects;

CREATE POLICY "Only authenticated users can insert projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix project_gallery_images table policies
DROP POLICY IF EXISTS "Only authenticated users can insert project gallery images" ON public.project_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can update project gallery images" ON public.project_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can delete project gallery images" ON public.project_gallery_images;

CREATE POLICY "Only authenticated users can insert project gallery images"
    ON public.project_gallery_images
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update project gallery images"
    ON public.project_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete project gallery images"
    ON public.project_gallery_images
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

