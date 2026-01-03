-- Drop service_subservices join table and related objects
-- This removes the parent service functionality

-- Drop RLS policies for service_subservices
DROP POLICY IF EXISTS "Anyone can read service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can insert service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can update service subservices" ON public.service_subservices;
DROP POLICY IF EXISTS "Only authenticated users can delete service subservices" ON public.service_subservices;

-- Drop indexes for service_subservices
DROP INDEX IF EXISTS idx_service_subservices_service_id;
DROP INDEX IF EXISTS idx_service_subservices_subservice_id;
DROP INDEX IF EXISTS idx_service_subservices_composite;

-- Drop the service_subservices table
DROP TABLE IF EXISTS public.service_subservices;

