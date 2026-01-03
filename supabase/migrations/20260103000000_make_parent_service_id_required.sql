-- Make parent_service_id required (NOT NULL) in subservices table
-- This migration ensures all subservices must have a parent service

-- First, ensure no NULL values exist (should already be the case)
-- Delete any subservices without a parent service (safety check)
DELETE FROM public.subservices WHERE parent_service_id IS NULL;

-- Make the column NOT NULL
ALTER TABLE public.subservices
ALTER COLUMN parent_service_id SET NOT NULL;

-- Update the comment to reflect that it's now required
COMMENT ON COLUMN public.subservices.parent_service_id IS 'Required reference to parent service. All subservices must belong to a parent service.';

