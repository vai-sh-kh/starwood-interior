-- Complete comprehensive fix for all RLS policies for services and subservices
-- This ensures all tables have correct policies with auth.uid() IS NOT NULL
-- Includes both public read access for published content and authenticated admin access
-- Includes both USING and WITH CHECK clauses for UPDATE operations

-- ============================================
-- SERVICES TABLE
-- ============================================
-- Ensure public can read published services (for public website)
DROP POLICY IF EXISTS "Anyone can read published services" ON public.services;
CREATE POLICY "Anyone can read published services"
    ON public.services
    FOR SELECT
    USING (status = 'published');

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
-- Ensure public can read service gallery images (for public website)
DROP POLICY IF EXISTS "Anyone can read service gallery images" ON public.service_gallery_images;
CREATE POLICY "Anyone can read service gallery images"
    ON public.service_gallery_images
    FOR SELECT
    USING (true);

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
-- Ensure public can read published subservices (for public website)
DROP POLICY IF EXISTS "Anyone can read published subservices" ON public.subservices;
CREATE POLICY "Anyone can read published subservices"
    ON public.subservices
    FOR SELECT
    USING (status = 'published');

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
-- Ensure public can read subservice gallery images (for public website)
DROP POLICY IF EXISTS "Anyone can read subservice gallery images" ON public.subservice_gallery_images;
CREATE POLICY "Anyone can read subservice gallery images"
    ON public.subservice_gallery_images
    FOR SELECT
    USING (true);

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

-- ============================================
-- SERVICE_SUBSERVICES JOIN TABLE (if exists)
-- ============================================
-- Handle service_subservices join table if it exists
-- This table may or may not exist depending on migration history
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'service_subservices'
    ) THEN
        -- Ensure public can read service subservices (for public website)
        DROP POLICY IF EXISTS "Anyone can read service subservices" ON public.service_subservices;
        CREATE POLICY "Anyone can read service subservices"
            ON public.service_subservices
            FOR SELECT
            USING (true);

        -- Fix INSERT policy
        DROP POLICY IF EXISTS "Only authenticated users can insert service subservices" ON public.service_subservices;
        CREATE POLICY "Only authenticated users can insert service subservices"
            ON public.service_subservices
            FOR INSERT
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Fix UPDATE policy (both USING and WITH CHECK)
        DROP POLICY IF EXISTS "Only authenticated users can update service subservices" ON public.service_subservices;
        CREATE POLICY "Only authenticated users can update service subservices"
            ON public.service_subservices
            FOR UPDATE
            USING (auth.uid() IS NOT NULL)
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Fix DELETE policy
        DROP POLICY IF EXISTS "Only authenticated users can delete service subservices" ON public.service_subservices;
        CREATE POLICY "Only authenticated users can delete service subservices"
            ON public.service_subservices
            FOR DELETE
            USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

