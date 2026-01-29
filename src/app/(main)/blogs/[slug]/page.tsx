import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogClient params={params} />;
}
