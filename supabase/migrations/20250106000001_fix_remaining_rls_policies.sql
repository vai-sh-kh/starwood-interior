-- Fix remaining RLS policies to use auth.uid() IS NOT NULL instead of auth.role() = 'authenticated'
-- This standardizes all authentication checks across all tables

-- Fix blog_categories table policies
DROP POLICY IF EXISTS "Only authenticated users can insert blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Only authenticated users can update blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Only authenticated users can delete blog categories" ON public.blog_categories;

CREATE POLICY "Only authenticated users can insert blog categories"
    ON public.blog_categories
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update blog categories"
    ON public.blog_categories
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete blog categories"
    ON public.blog_categories
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix blogs table policies
DROP POLICY IF EXISTS "Only authenticated users can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Only authenticated users can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Only authenticated users can delete blogs" ON public.blogs;

CREATE POLICY "Only authenticated users can insert blogs"
    ON public.blogs
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update blogs"
    ON public.blogs
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete blogs"
    ON public.blogs
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Fix leads table policies
DROP POLICY IF EXISTS "Only authenticated users can read leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated users can delete leads" ON public.leads;

CREATE POLICY "Only authenticated users can read leads"
    ON public.leads
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update leads"
    ON public.leads
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete leads"
    ON public.leads
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Note: subservice_gallery_images policies are handled in a later migration
-- when the table is created (20251229211131_create_subservice_gallery_images_table.sql)
