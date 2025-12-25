import { notFound, redirect } from "next/navigation";
import BlogDetail from "@/components/BlogDetail";
import { createClient } from "@/lib/supabase/server";
import { getBooleanSetting } from "@/lib/settings";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .or("archived.is.null,archived.eq.false")
    .single();

  if (!blog) {
    return {
      title: "Blog Post Not Found - Starwood Interiors",
    };
  }

  const title = `${blog.title} - Starwood Interiors`;
  const description =
    blog.excerpt ||
    `Read our latest blog post: ${blog.title.toLowerCase()}. Discover expert insights and inspiration for your interior design journey.`;
  const url = `/blogs/${blog.slug}`;

  // Extract first paragraph from content for better Open Graph description
  let ogDescription = description;
  if (blog.content) {
    const descriptionMatch = blog.content.match(/<p>(.*?)<\/p>/);
    if (descriptionMatch) {
      ogDescription = descriptionMatch[1]
        .replace(/<[^>]*>/g, "")
        .substring(0, 160);
    }
  }

  const imageUrl =
    blog.image ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAcENDP2w6i8b0OvG5_ZaeBxeX3eqGGY-P9nvn7qxkUQHlbhNQNfZlntBdw8Vk9k5peYUdgWnTTBoMYbntApUzL6G-QkUfCHsQZ11ZwWwqimPebCMEkBPO48lDlqaHPW3oUwUNFpJ61zXBtvExHAcJ5pABYkPNyb_RoJ_nyR_MrmkaEMIsql5uncB1R2jl6J2NT5BworFrBvc0t4_oaXZKtnbT1dN4e_iKfNf1AL1WU6XyfO6YSVRfmOop-RSK2Qyc29-hTwatb8gM";

  return {
    title,
    description,
    openGraph: {
      title,
      description: ogDescription,
      url,
      siteName: "Starwood Interiors",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  
  // Check if blogs are enabled
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);
  if (!blogsEnabled) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .or("archived.is.null,archived.eq.false")
    .single();

  if (error || !blog) {
    notFound();
  }

  // Fetch related blogs (same category, excluding current blog)
  let relatedBlogsQuery = supabase
    .from("blogs")
    .select("id, title, slug, image, excerpt, blog_categories(*)")
    .or("archived.is.null,archived.eq.false")
    .neq("id", blog.id)
    .limit(3);

  // If blog has a category, filter by category
  if (blog.category_id) {
    relatedBlogsQuery = relatedBlogsQuery.eq("category_id", blog.category_id);
  }

  const { data: relatedBlogs } = await relatedBlogsQuery;

  // Format blog data for component
  const blogData = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    image: blog.image,
    excerpt: blog.excerpt,
    content: blog.content,
    author: blog.author,
    created_at: blog.created_at,
    category: blog.blog_categories
      ? {
          name: blog.blog_categories.name,
        }
      : null,
    tags: blog.tags,
  };

  const relatedBlogsData =
    relatedBlogs?.map((rb) => ({
      id: rb.id,
      title: rb.title,
      slug: rb.slug || "",
      image: rb.image,
      excerpt: rb.excerpt,
      category: rb.blog_categories
        ? {
            name: rb.blog_categories.name,
          }
        : null,
    })) || [];

  return <BlogDetail blog={blogData} relatedBlogs={relatedBlogsData} />;
}
