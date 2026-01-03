-- Add parent_service_id column to services table to support subservices
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'services'
    ) THEN
        -- Add parent_service_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'services' 
            AND column_name = 'parent_service_id'
        ) THEN
            ALTER TABLE public.services
            ADD COLUMN parent_service_id UUID REFERENCES public.services(id) ON DELETE CASCADE;
        END IF;

        -- Create index for better query performance
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename = 'services' 
            AND indexname = 'idx_services_parent_service_id'
        ) THEN
            CREATE INDEX idx_services_parent_service_id ON public.services(parent_service_id);
        END IF;

        -- Add constraint to prevent circular references (a service cannot be its own parent)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_schema = 'public' 
            AND constraint_name = 'services_no_self_parent'
        ) THEN
            ALTER TABLE public.services
            ADD CONSTRAINT services_no_self_parent CHECK (id != parent_service_id);
        END IF;
    END IF;
END $$;

