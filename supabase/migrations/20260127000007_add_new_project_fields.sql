-- Add new fields to projects table: banner_title, client_name, sarea, project_type, completion_date
-- Also migrate existing data from project_info JSONB column if applicable

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS banner_title TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS sarea TEXT,
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS completion_date TEXT;

-- Migrate data from project_info to new columns
-- usage of triggers or manual update. We do a one-time update here.
-- We use COALESCE to ensure we don't overwrite if data is already there (though columns are new)

DO $$
BEGIN
    UPDATE public.projects
    SET
        client_name = CASE WHEN client_name IS NULL THEN project_info->>'client' ELSE client_name END,
        sarea = CASE WHEN sarea IS NULL THEN project_info->>'size' ELSE sarea END,
        completion_date = CASE WHEN completion_date IS NULL THEN project_info->>'completion' ELSE completion_date END
    WHERE project_info IS NOT NULL;
END $$;
