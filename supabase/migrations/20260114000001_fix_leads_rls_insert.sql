-- Enable RLS
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists to clean up
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."leads";
DROP POLICY IF EXISTS "leads_insert_policy" ON "public"."leads";
DROP POLICY IF EXISTS "Public leads insert" ON "public"."leads";

-- Create unrestricted insert policy
CREATE POLICY "Enable insert for all users"
ON "public"."leads"
FOR INSERT
TO public
WITH CHECK (true);

-- Ensure select policy exists for authenticated users (admins) to view leads
CREATE POLICY "Enable read access for authenticated users only"
ON "public"."leads"
FOR SELECT
TO authenticated
USING (true);
