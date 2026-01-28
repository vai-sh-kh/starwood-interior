import Blogs from "@/components/Blogs";
import BlogHeader from "@/components/blog/BlogHeader";
import { getBooleanSetting } from "@/lib/settings";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Starwood Interiors",
  description: "Insights, ideas, and expert perspectives on interior design, space planning, materials, and trends to help you make informed design decisions.",
};

export default async function BlogsPage() {
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);

  if (!blogsEnabled) {
    redirect("/");
  }

  return (
    <>
      <BlogHeader />
      <Blogs />
    </>
  );
}
