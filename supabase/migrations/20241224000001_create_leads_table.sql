-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'contact_form',
    status TEXT DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN status TEXT DEFAULT 'new' NOT NULL;
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- Add avatar_color column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'avatar_color'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN avatar_color TEXT;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated users can read leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated users can delete leads" ON public.leads;

-- Create policies for leads (public insert, admin read/write)
CREATE POLICY "Anyone can insert leads"
    ON public.leads
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only authenticated users can read leads"
    ON public.leads
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update leads"
    ON public.leads
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete leads"
    ON public.leads
    FOR DELETE
    USING (auth.role() = 'authenticated');

