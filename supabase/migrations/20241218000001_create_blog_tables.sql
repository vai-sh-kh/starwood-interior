-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    author TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON public.blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_archived ON public.blogs(archived);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_categories (public read, admin write)
CREATE POLICY "Anyone can read blog categories"
    ON public.blog_categories
    FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert blog categories"
    ON public.blog_categories
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update blog categories"
    ON public.blog_categories
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete blog categories"
    ON public.blog_categories
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for blogs (public read, admin write)
CREATE POLICY "Anyone can read non-archived blogs"
    ON public.blogs
    FOR SELECT
    USING (archived IS NOT TRUE);

CREATE POLICY "Only authenticated users can insert blogs"
    ON public.blogs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update blogs"
    ON public.blogs
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete blogs"
    ON public.blogs
    FOR DELETE
    USING (auth.role() = 'authenticated');

