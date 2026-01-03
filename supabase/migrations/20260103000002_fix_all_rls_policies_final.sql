-- Final comprehensive fix for all RLS policies
-- This ensures all tables have correct policies with auth.uid() IS NOT NULL
-- and includes both USING and WITH CHECK clauses for UPDATE operations

-- ============================================
-- SERVICES TABLE
-- ============================================
-- Ensure authenticated users can read all services (for admin panel)
DROP POLICY IF EXISTS "Authenticated users can read all services" ON public.services;
CREATE POLICY "Authenticated users can read all services"
    ON public.services
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Fix INSERT policy
DROP POLICY IF EXISTS "Only authenticated users can insert services" ON public.services;
CREATE POLICY "Only authenticated users can insert services"
    ON public.services
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix UPDATE policy (both USING and WITH CHECK)
DROP POLICY IF EXISTS "Only authenticated users can update services" ON public.services;
CREATE POLICY "Only authenticated users can update services"
    ON public.services
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix DELETE policy
DROP POLICY IF EXISTS "Only authenticated users can delete services" ON public.services;
CREATE POLICY "Only authenticated users can delete services"
    ON public.services
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- SERVICE_GALLERY_IMAGES TABLE
-- ============================================
-- Fix INSERT policy
DROP POLICY IF EXISTS "Only authenticated users can insert service gallery images" ON public.service_gallery_images;
CREATE POLICY "Only authenticated users can insert service gallery images"
    ON public.service_gallery_images
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix UPDATE policy (both USING and WITH CHECK)
DROP POLICY IF EXISTS "Only authenticated users can update service gallery images" ON public.service_gallery_images;
CREATE POLICY "Only authenticated users can update service gallery images"
    ON public.service_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix DELETE policy
DROP POLICY IF EXISTS "Only authenticated users can delete service gallery images" ON public.service_gallery_images;
CREATE POLICY "Only authenticated users can delete service gallery images"
    ON public.service_gallery_images
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- SUBSERVICES TABLE
-- ============================================
-- Ensure authenticated users can read all subservices (for admin panel)
DROP POLICY IF EXISTS "Authenticated users can read all subservices" ON public.subservices;
CREATE POLICY "Authenticated users can read all subservices"
    ON public.subservices
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Fix INSERT policy
DROP POLICY IF EXISTS "Only authenticated users can insert subservices" ON public.subservices;
CREATE POLICY "Only authenticated users can insert subservices"
    ON public.subservices
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix UPDATE policy (both USING and WITH CHECK)
DROP POLICY IF EXISTS "Only authenticated users can update subservices" ON public.subservices;
CREATE POLICY "Only authenticated users can update subservices"
    ON public.subservices
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix DELETE policy
DROP POLICY IF EXISTS "Only authenticated users can delete subservices" ON public.subservices;
CREATE POLICY "Only authenticated users can delete subservices"
    ON public.subservices
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- SUBSERVICE_GALLERY_IMAGES TABLE
-- ============================================
-- Fix INSERT policy
DROP POLICY IF EXISTS "Only authenticated users can insert subservice gallery images" ON public.subservice_gallery_images;
CREATE POLICY "Only authenticated users can insert subservice gallery images"
    ON public.subservice_gallery_images
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix UPDATE policy (both USING and WITH CHECK)
DROP POLICY IF EXISTS "Only authenticated users can update subservice gallery images" ON public.subservice_gallery_images;
CREATE POLICY "Only authenticated users can update subservice gallery images"
    ON public.subservice_gallery_images
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix DELETE policy
DROP POLICY IF EXISTS "Only authenticated users can delete subservice gallery images" ON public.subservice_gallery_images;
CREATE POLICY "Only authenticated users can delete subservice gallery images"
    ON public.subservice_gallery_images
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

