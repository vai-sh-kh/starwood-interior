-- Fix settings table permissions for anon role
-- Grant explicit permissions and ensure RLS policies work correctly

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'settings'
    ) THEN
        -- Grant SELECT permission to anon role explicitly
        GRANT SELECT ON public.settings TO anon;
        GRANT SELECT ON public.settings TO authenticated;
        
        -- Drop all existing policies to start fresh
        DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
        DROP POLICY IF EXISTS "Public can read settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can insert settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can update settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can delete settings" ON public.settings;
        DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.settings;
        DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.settings;
        DROP POLICY IF EXISTS "Authenticated users can delete settings" ON public.settings;

        -- Create a simple, explicit policy for public read access
        -- This policy allows anyone (including anon role) to read all settings
        CREATE POLICY "Public can read settings"
            ON public.settings
            FOR SELECT
            TO public
            USING (true);

        -- Also create a policy for authenticated role explicitly
        CREATE POLICY "Authenticated can read settings"
            ON public.settings
            FOR SELECT
            TO authenticated
            USING (true);

        -- Authenticated users can insert settings
        CREATE POLICY "Authenticated users can insert settings"
            ON public.settings
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Authenticated users can update settings
        CREATE POLICY "Authenticated users can update settings"
            ON public.settings
            FOR UPDATE
            TO authenticated
            USING (auth.uid() IS NOT NULL)
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Authenticated users can delete settings
        CREATE POLICY "Authenticated users can delete settings"
            ON public.settings
            FOR DELETE
            TO authenticated
            USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

