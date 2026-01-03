-- Backfill avatar_color for existing leads that don't have one
-- This uses a simple hash function to generate consistent colors

-- Create a function to generate avatar color from name
CREATE OR REPLACE FUNCTION generate_avatar_color(name_text TEXT)
RETURNS TEXT AS $$
DECLARE
    color_index INTEGER;
    colors TEXT[] := ARRAY[
        'bg-red-500 text-white',
        'bg-pink-500 text-white',
        'bg-purple-500 text-white',
        'bg-indigo-500 text-white',
        'bg-blue-500 text-white',
        'bg-cyan-500 text-white',
        'bg-teal-500 text-white',
        'bg-green-500 text-white',
        'bg-lime-500 text-white',
        'bg-yellow-500 text-white',
        'bg-amber-500 text-white',
        'bg-orange-500 text-white',
        'bg-red-600 text-white',
        'bg-pink-600 text-white',
        'bg-purple-600 text-white',
        'bg-indigo-600 text-white',
        'bg-blue-600 text-white',
        'bg-cyan-600 text-white',
        'bg-teal-600 text-white',
        'bg-green-600 text-white'
    ];
    hash_value INTEGER := 0;
    i INTEGER;
BEGIN
    IF name_text IS NULL OR name_text = '' THEN
        RETURN colors[1];
    END IF;
    
    -- Simple hash function (similar to JavaScript implementation)
    FOR i IN 1..length(name_text) LOOP
        hash_value := hash_value * 31 + ascii(substring(name_text, i, 1));
    END LOOP;
    
    color_index := (abs(hash_value) % array_length(colors, 1)) + 1;
    RETURN colors[color_index];
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update all leads that don't have an avatar_color
UPDATE public.leads
SET avatar_color = generate_avatar_color(name)
WHERE avatar_color IS NULL OR avatar_color = '';

-- Create a trigger function to auto-generate avatar_color on insert if not provided
CREATE OR REPLACE FUNCTION set_lead_avatar_color()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set if avatar_color is NULL or empty
    IF NEW.avatar_color IS NULL OR NEW.avatar_color = '' THEN
        NEW.avatar_color := generate_avatar_color(NEW.name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate avatar_color on insert
DROP TRIGGER IF EXISTS trigger_set_lead_avatar_color ON public.leads;
CREATE TRIGGER trigger_set_lead_avatar_color
    BEFORE INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION set_lead_avatar_color();

