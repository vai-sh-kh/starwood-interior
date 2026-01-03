-- Fix RLS policies for subservices and subservice_gallery_images tables
-- Allow authenticated users to read all subservices (not just published)
-- Use auth.uid() IS NOT NULL instead of auth.role() = 'authenticated'
-- This is more reliable for checking authentication status

-- Fix subservices table policies
-- Add policy for authenticated users to read all subservices
DROP POLICY IF EXISTS "Authenticated users can read all subservices" ON public.subservices;
CREATE POLICY "Authenticated users can read all subservices"
    ON public.subservices
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Fix insert/update/delete policies to use auth.uid()
DROP POLICY IF EXISTS "Only authenticated users can insert subservices" ON public.subservices;
DROP POLICY IF EXISTS "Only authenticated users can update subservices" ON public.subservices;
DROP POLICY IF EXISTS "Only authenticated users can delete subservices" ON public.subservices;

CREATE POLICY "Only authenticated users can insert subservices"
    ON public.subservices
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update subservices"
    ON public.subservices
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete subservices"
    ON public.subservices
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix subservice_gallery_images table policies
DROP POLICY IF EXISTS "Only authenticated users can insert subservice gallery images" ON public.subservice_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can update subservice gallery images" ON public.subservice_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can delete subservice gallery images" ON public.subservice_gallery_images;

CREATE POLICY "Only authenticated users can insert subservice gallery images"
    ON public.subservice_gallery_images
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update subservice gallery images"
    ON public.subservice_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete subservice gallery images"
    ON public.subservice_gallery_images
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix service_subservices join table policies
DROP POLICY IF EXISTS "Only authenticated users can insert service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can update service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can delete service subservices" ON public.service_subservices;

CREATE POLICY "Only authenticated users can insert service subservices"
    ON public.service_subservices
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update service subservices"
    ON public.service_subservices
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete service subservices"
    ON public.service_subservices
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

