-- Create service_gallery_images table for storing multiple gallery images per service
CREATE TABLE IF NOT EXISTS public.service_gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_gallery_images_service_id ON public.service_gallery_images(service_id);
CREATE INDEX IF NOT EXISTS idx_service_gallery_images_display_order ON public.service_gallery_images(service_id, display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_service_gallery_images_updated_at ON public.service_gallery_images;
CREATE TRIGGER update_service_gallery_images_updated_at
    BEFORE UPDATE ON public.service_gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_service_gallery_images_updated_at();

-- Enable Row Level Security
ALTER TABLE public.service_gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read service gallery images" ON public.service_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can insert service gallery images" ON public.service_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can update service gallery images" ON public.service_gallery_images;
DROP POLICY IF EXISTS "Only authenticated users can delete service gallery images" ON public.service_gallery_images;

-- Create policies for service_gallery_images (public read, authenticated write)
CREATE POLICY "Anyone can read service gallery images"
    ON public.service_gallery_images
    FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert service gallery images"
    ON public.service_gallery_images
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update service gallery images"
    ON public.service_gallery_images
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete service gallery images"
    ON public.service_gallery_images
    FOR DELETE
    USING (auth.role() = 'authenticated');

