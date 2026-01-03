-- Add parent_service_id and is_new columns to subservices table
-- This migration adds direct parent service relationship and is_new flag

-- Add parent_service_id column with foreign key to services table
ALTER TABLE public.subservices
ADD COLUMN IF NOT EXISTS parent_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;

-- Add is_new column with default value
ALTER TABLE public.subservices
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index on parent_service_id for better query performance
CREATE INDEX IF NOT EXISTS idx_subservices_parent_service_id ON public.subservices(parent_service_id);

-- Add comment to document the column
COMMENT ON COLUMN public.subservices.parent_service_id IS 'Direct reference to parent service. Replaces many-to-many relationship for simpler queries.';
COMMENT ON COLUMN public.subservices.is_new IS 'Flag to mark subservice as new, displays "New" badge in UI.';

