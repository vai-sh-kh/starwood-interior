import { createClient } from "@/lib/supabase/client";

export async function getSettingClient(key: string): Promise<any> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", key)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error(`Error fetching setting ${key}:`, error);
        return null;
    }
    return data?.value ?? null;
}

export async function getBooleanSettingClient(
    key: string,
    defaultValue: boolean = false
): Promise<boolean> {
    const value = await getSettingClient(key);
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return defaultValue;
}

export async function updateSettingClient(key: string, value: any) {
    const supabase = createClient();

    // Check if setting exists
    const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", key)
        .single();

    if (existing) {
        // Update existing setting
        return await supabase
            .from("settings")
            .update({ value })
            .eq("key", key);
    } else {
        // Insert new setting
        return await supabase
            .from("settings")
            .insert({ key, value });
    }
}
