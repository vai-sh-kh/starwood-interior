import Blogs from "@/components/Blogs";
import BlogHeader from "@/components/blog/BlogHeader";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Starwood Interiors",
  description: "Insights, ideas, and expert perspectives on interior design, space planning, materials, and trends to help you make informed design decisions.",
};

export default function BlogsPage() {

  return (
    <>
      <BlogHeader />
      <Blogs />
    </>
  );
}
