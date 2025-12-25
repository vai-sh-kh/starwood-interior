-- Fix RLS policies for projects table UPDATE operations
-- UPDATE policies need both USING (to select rows) and WITH CHECK (to validate updated values)

-- Fix projects table UPDATE policy
DROP POLICY IF EXISTS "Only authenticated users can update projects" ON public.projects;

CREATE POLICY "Only authenticated users can update projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix project_gallery_images table UPDATE policy
DROP POLICY IF EXISTS "Only authenticated users can update project gallery images" ON public.project_gallery_images;

CREATE POLICY "Only authenticated users can update project gallery images"
    ON public.project_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

