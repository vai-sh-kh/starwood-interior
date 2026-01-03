-- Create subservices table with all required fields
CREATE TABLE IF NOT EXISTS public.subservices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    image TEXT,
    status TEXT DEFAULT 'draft' NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT subservices_status_check CHECK (status IN ('draft', 'published'))
);

-- Create service_subservices join table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.service_subservices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    subservice_id UUID NOT NULL REFERENCES public.subservices(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT service_subservices_unique UNIQUE (service_id, subservice_id)
);

-- Create indexes for better query performance on subservices
CREATE INDEX IF NOT EXISTS idx_subservices_slug ON public.subservices(slug);
CREATE INDEX IF NOT EXISTS idx_subservices_status ON public.subservices(status);
CREATE INDEX IF NOT EXISTS idx_subservices_created_at ON public.subservices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subservices_meta_title ON public.subservices(meta_title) WHERE meta_title IS NOT NULL;

-- Create indexes for service_subservices join table
CREATE INDEX IF NOT EXISTS idx_service_subservices_service_id ON public.service_subservices(service_id);
CREATE INDEX IF NOT EXISTS idx_service_subservices_subservice_id ON public.service_subservices(subservice_id);
CREATE INDEX IF NOT EXISTS idx_service_subservices_composite ON public.service_subservices(service_id, display_order);

-- Create function to update updated_at timestamp for subservices
CREATE OR REPLACE FUNCTION update_subservices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for subservices
DROP TRIGGER IF EXISTS update_subservices_updated_at ON public.subservices;
CREATE TRIGGER update_subservices_updated_at
    BEFORE UPDATE ON public.subservices
    FOR EACH ROW
    EXECUTE FUNCTION update_subservices_updated_at();

-- Enable Row Level Security
ALTER TABLE public.subservices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_subservices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist for subservices
DROP POLICY IF EXISTS "Anyone can read published subservices" ON public.subservices;
DROP POLICY IF EXISTS "Only authenticated users can insert subservices" ON public.subservices;
DROP POLICY IF EXISTS "Only authenticated users can update subservices" ON public.subservices;
DROP POLICY IF EXISTS "Only authenticated users can delete subservices" ON public.subservices;

-- Create policies for subservices (public read for published, authenticated write)
CREATE POLICY "Anyone can read published subservices"
    ON public.subservices
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authenticated users can read all subservices"
    ON public.subservices
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

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

-- Drop existing policies if they exist for service_subservices
DROP POLICY IF EXISTS "Anyone can read service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can insert service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can update service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can delete service subservices" ON public.service_subservices;

-- Create policies for service_subservices (public read, authenticated write)
CREATE POLICY "Anyone can read service subservices"
    ON public.service_subservices
    FOR SELECT
    USING (true);

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

