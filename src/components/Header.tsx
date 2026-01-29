import { createStaticClient } from "@/lib/supabase/static";
import HeaderContent from "./HeaderContent";

export default async function Header() {
  const supabase = createStaticClient();

  // Helper to get boolean setting
  const getSetting = async (key: string, defaultVal: boolean) => {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();
    if (!data) return defaultVal;
    if (typeof data.value === "boolean") return data.value;
    if (typeof data.value === "string") return data.value.toLowerCase() === "true";
    return defaultVal;
  };

  const projectsEnabled = await getSetting("projects_enabled", true);
  const blogsEnabled = await getSetting("blogs_enabled", true);

  return (
    <HeaderContent
      projectsEnabled={projectsEnabled}
      blogsEnabled={blogsEnabled}
    />
  );
}
