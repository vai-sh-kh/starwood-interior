import { createClient } from "@/lib/supabase/server";

/**
 * Get a setting value by key
 * @param key - The setting key (e.g., 'projects_enabled')
 * @returns The setting value or null if not found
 */
export async function getSetting(key: string): Promise<any> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    // PGRST116 means no rows found - this is expected for missing settings
    if (error.code === "PGRST116") {
      return null;
    }
    // Only log actual errors, not "not found" cases
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data.value;
}

/**
 * Get a boolean setting value by key
 * @param key - The setting key (e.g., 'projects_enabled')
 * @param defaultValue - Default value if setting not found
 * @returns The boolean setting value
 */
export async function getBooleanSetting(
  key: string,
  defaultValue: boolean = false
): Promise<boolean> {
  const value = await getSetting(key);
  
  if (value === null || value === undefined) {
    return defaultValue;
  }

  // Handle JSONB boolean values (can be true/false or "true"/"false")
  if (typeof value === "boolean") {
    return value;
  }
  
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return defaultValue;
}

/**
 * Update a setting value (admin only)
 * @param key - The setting key
 * @param value - The new value to set
 * @returns Success status
 */
export async function updateSetting(
  key: string,
  value: any
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if setting exists
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("key", key)
    .single();

  if (existing) {
    // Update existing setting
    const { error } = await supabase
      .from("settings")
      .update({ value })
      .eq("key", key);

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return { success: false, error: error.message };
    }
  } else {
    // Insert new setting
    const { error } = await supabase
      .from("settings")
      .insert({ key, value });

    if (error) {
      console.error(`Error inserting setting ${key}:`, error);
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

