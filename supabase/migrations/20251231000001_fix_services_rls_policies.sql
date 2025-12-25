-- Fix RLS policies for services and service_gallery_images tables
-- Use auth.uid() IS NOT NULL instead of auth.role() = 'authenticated'
-- This is more reliable for checking authentication status

-- Fix services table policies
DROP POLICY IF EXISTS "Only authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Only authenticated users can update services" ON public.services;
DROP POLICY IF EXISTS "Only authenticated users can delete services" ON public.services;

CREATE POLICY "Only authenticated users can insert services"
    ON public.services
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update services"
    ON public.services
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete services"
    ON public.services
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix service_gallery_images table policies
DROP POLICY IF EXISTS "Only authenticated users can insert service gallery images" ON public.service_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can update service gallery images" ON public.service_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can delete service gallery images" ON public.service_gallery_images;

CREATE POLICY "Only authenticated users can insert service gallery images"
    ON public.service_gallery_images
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update service gallery images"
    ON public.service_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete service gallery images"
    ON public.service_gallery_images
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

