-- Fix RLS policies for settings table
-- Ensure public read access works correctly

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'settings'
    ) THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can insert settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can update settings" ON public.settings;
        DROP POLICY IF EXISTS "Only authenticated users can delete settings" ON public.settings;

        -- Recreate policies with proper permissions
        -- Public read access - anyone can read settings
        CREATE POLICY "Anyone can read settings"
            ON public.settings
            FOR SELECT
            USING (true);

        -- Authenticated users can insert settings
        CREATE POLICY "Only authenticated users can insert settings"
            ON public.settings
            FOR INSERT
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Authenticated users can update settings
        CREATE POLICY "Only authenticated users can update settings"
            ON public.settings
            FOR UPDATE
            USING (auth.uid() IS NOT NULL)
            WITH CHECK (auth.uid() IS NOT NULL);

        -- Authenticated users can delete settings
        CREATE POLICY "Only authenticated users can delete settings"
            ON public.settings
            FOR DELETE
            USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

