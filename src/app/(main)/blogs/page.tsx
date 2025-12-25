import Blogs from "@/components/Blogs";
import { getBooleanSetting } from "@/lib/settings";
import { redirect } from "next/navigation";

export default async function BlogsPage() {
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);

  if (!blogsEnabled) {
    redirect("/");
  }

  return <Blogs />;
}
