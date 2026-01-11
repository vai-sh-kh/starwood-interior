import { getBooleanSetting } from "@/lib/settings";
import HeaderContent from "./HeaderContent";

export default async function Header() {
  const projectsEnabled = await getBooleanSetting("projects_enabled", true);
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);

  return (
    <HeaderContent
      projectsEnabled={projectsEnabled}
      blogsEnabled={blogsEnabled}
    />
  );
}
