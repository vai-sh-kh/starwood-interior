-- Remove parent_service_id column and migrate to new structure
-- This migration preserves existing data and migrates from parent_service_id to join table structure
-- Recreate service_subservices join table if it was dropped

-- Step 1: Ensure subservices table exists (it should from earlier migration)
-- If subservices table doesn't exist, create it
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

-- Step 2: Migrate existing subservices (services with parent_service_id) to subservices table
DO $$
DECLARE
    subservice_record RECORD;
    new_subservice_id UUID;
BEGIN
    -- Only migrate if services table has parent_service_id column
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'parent_service_id'
    ) THEN
        -- Migrate each service that has a parent_service_id to the subservices table
        FOR subservice_record IN 
            SELECT * FROM public.services 
            WHERE parent_service_id IS NOT NULL
        LOOP
            -- Check if subservice with this slug already exists
            IF NOT EXISTS (
                SELECT 1 FROM public.subservices WHERE slug = subservice_record.slug
            ) THEN
                -- Insert into subservices table
                INSERT INTO public.subservices (
                    id, title, slug, description, content, image, status,
                    meta_title, meta_description, created_at, updated_at
                ) VALUES (
                    subservice_record.id,
                    subservice_record.title,
                    subservice_record.slug,
                    subservice_record.description,
                    subservice_record.content,
                    subservice_record.image,
                    subservice_record.status,
                    subservice_record.meta_title,
                    subservice_record.meta_description,
                    subservice_record.created_at,
                    subservice_record.updated_at
                )
                ON CONFLICT (slug) DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;

-- Step 3: Recreate service_subservices join table if it doesn't exist
-- This table may have been dropped by migration 20250101000002_drop_service_subservices_table.sql
CREATE TABLE IF NOT EXISTS public.service_subservices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    subservice_id UUID NOT NULL REFERENCES public.subservices(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT service_subservices_unique UNIQUE (service_id, subservice_id)
);

-- Step 4: Migrate existing parent_service_id relationships to join table
DO $$
DECLARE
    service_record RECORD;
    subservice_record RECORD;
    display_order_counter INTEGER;
BEGIN
    -- Only migrate if services table has parent_service_id column
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'parent_service_id'
    ) THEN
        -- For each service, find its subservices and create join table entries
        FOR service_record IN 
            SELECT id FROM public.services WHERE parent_service_id IS NULL
        LOOP
            display_order_counter := 0;
            
            -- Find all subservices that belong to this service
            FOR subservice_record IN 
                SELECT s.id, s.parent_service_id
                FROM public.services s
                WHERE s.parent_service_id = service_record.id
                ORDER BY s.created_at ASC
            LOOP
                -- Check if subservice exists in subservices table
                IF EXISTS (SELECT 1 FROM public.subservices WHERE id = subservice_record.id) THEN
                    -- Insert into join table if not already exists
                    INSERT INTO public.service_subservices (
                        service_id, subservice_id, display_order, created_at
                    ) VALUES (
                        service_record.id,
                        subservice_record.id,
                        display_order_counter,
                        NOW()
                    )
                    ON CONFLICT (service_id, subservice_id) DO NOTHING;
                    
                    display_order_counter := display_order_counter + 1;
                END IF;
            END LOOP;
        END LOOP;
        
        -- Step 5: Delete services that have parent_service_id (they're now in subservices table)
        -- Only delete if they were successfully migrated to subservices table
        DELETE FROM public.services s
        WHERE s.parent_service_id IS NOT NULL
        AND EXISTS (SELECT 1 FROM public.subservices WHERE id = s.id);
    END IF;
END $$;

-- Create indexes for service_subservices join table if they don't exist
CREATE INDEX IF NOT EXISTS idx_service_subservices_service_id ON public.service_subservices(service_id);
CREATE INDEX IF NOT EXISTS idx_service_subservices_subservice_id ON public.service_subservices(subservice_id);
CREATE INDEX IF NOT EXISTS idx_service_subservices_composite ON public.service_subservices(service_id, display_order);

-- Enable Row Level Security on service_subservices
ALTER TABLE public.service_subservices ENABLE ROW LEVEL SECURITY;

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

-- Note: We do NOT clear existing data - we preserve it and migrate it

-- Drop constraints, indexes, and column only if services table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
    -- Drop the constraint that prevents self-parent
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND constraint_name = 'services_no_self_parent') THEN
      ALTER TABLE public.services DROP CONSTRAINT services_no_self_parent;
    END IF;

    -- Drop the foreign key constraint
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND constraint_name = 'services_parent_service_id_fkey') THEN
      ALTER TABLE public.services DROP CONSTRAINT services_parent_service_id_fkey;
    END IF;

    -- Remove the parent_service_id column if it exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'parent_service_id') THEN
      ALTER TABLE public.services DROP COLUMN parent_service_id;
    END IF;
  END IF;
END $$;

-- Drop the index on parent_service_id (can be done outside DO block since DROP INDEX IF EXISTS works)
DROP INDEX IF EXISTS public.idx_services_parent_service_id;

