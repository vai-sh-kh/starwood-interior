-- Create storage bucket for service images
-- This bucket will be public so images can be accessed directly
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;

-- Create storage policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');

-- Create storage policy to allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update service images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'service-images');

-- Create storage policy to allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete service images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'service-images');

-- Create storage policy to allow public read access
CREATE POLICY "Public can view service images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'service-images');

