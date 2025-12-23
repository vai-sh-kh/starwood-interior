import { notFound } from "next/navigation";
import BlogDetail from "@/components/BlogDetail";
import { BLOG_POSTS } from "@/lib/constants";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
