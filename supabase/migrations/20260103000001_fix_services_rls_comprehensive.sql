-- Comprehensive fix for services table RLS policies
-- 1. Add policy for authenticated users to read all services (for admin panel)
-- 2. Ensure INSERT/UPDATE/DELETE policies use auth.uid() IS NOT NULL
-- This matches the pattern used in projects and subservices tables

-- Add policy for authenticated users to read all services
-- This allows admin users to see draft services in the admin panel
DROP POLICY IF EXISTS "Authenticated users can read all services" ON public.services;
CREATE POLICY "Authenticated users can read all services"
    ON public.services
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Ensure INSERT policy uses auth.uid() (more reliable than auth.role())
DROP POLICY IF EXISTS "Only authenticated users can insert services" ON public.services;
CREATE POLICY "Only authenticated users can insert services"
    ON public.services
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure UPDATE policy uses auth.uid()
DROP POLICY IF EXISTS "Only authenticated users can update services" ON public.services;
CREATE POLICY "Only authenticated users can update services"
    ON public.services
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure DELETE policy uses auth.uid()
DROP POLICY IF EXISTS "Only authenticated users can delete services" ON public.services;
CREATE POLICY "Only authenticated users can delete services"
    ON public.services
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- The existing "Anyone can read published services" policy will still work for public access
-- Both SELECT policies can coexist - PostgreSQL will use OR logic between them

