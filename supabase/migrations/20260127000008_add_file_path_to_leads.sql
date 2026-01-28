-- Add file_path column to leads table
ALTER TABLE leads ADD COLUMN file_path TEXT;

-- Create storage bucket for leads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('leads', 'leads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public to upload files (for contact form)
CREATE POLICY "Public Contact Form Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'leads');

-- Policy to allow public to read files (so admin can view them easily, restrict if needed later)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'leads');

-- Policy to allow authenticated users (admin) to do everything
CREATE POLICY "Admin Full Access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'leads')
WITH CHECK (bucket_id = 'leads');
