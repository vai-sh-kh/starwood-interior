-- Insert default setting: blogs_enabled = true
INSERT INTO public.settings (key, value)
VALUES ('blogs_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

