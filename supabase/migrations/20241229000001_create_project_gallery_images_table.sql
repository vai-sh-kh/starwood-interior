-- Create project_gallery_images table for storing multiple gallery images per project
CREATE TABLE IF NOT EXISTS public.project_gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_gallery_images_project_id ON public.project_gallery_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_gallery_images_display_order ON public.project_gallery_images(project_id, display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_project_gallery_images_updated_at
    BEFORE UPDATE ON public.project_gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_project_gallery_images_updated_at();

-- Enable Row Level Security
ALTER TABLE public.project_gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for project_gallery_images (public read, authenticated write)
CREATE POLICY "Anyone can read project gallery images"
    ON public.project_gallery_images
    FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert project gallery images"
    ON public.project_gallery_images
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update project gallery images"
    ON public.project_gallery_images
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete project gallery images"
    ON public.project_gallery_images
    FOR DELETE
    USING (auth.role() = 'authenticated');

