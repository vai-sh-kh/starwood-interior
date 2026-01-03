-- Add parent_service_id column to services table to support subservices
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS parent_service_id UUID REFERENCES public.services(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_parent_service_id ON public.services(parent_service_id);

-- Add constraint to prevent circular references (a service cannot be its own parent)
ALTER TABLE public.services
ADD CONSTRAINT services_no_self_parent CHECK (id != parent_service_id);

