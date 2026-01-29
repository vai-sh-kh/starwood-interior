"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import BlogDetail from "@/components/BlogDetail"; // Ensure path is correct
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailClient({ slug }: { slug: string }) {
    const [blogData, setBlogData] = useState<any>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!slug) return;
            const supabase = createClient();

            const { data: blog, error } = await supabase
                .from("blogs")
                .select("*, blog_categories(*)")
                .eq("slug", slug)
                .eq("status", "published")
                .or("archived.is.null,archived.eq.false")
                .single();

            if (error || !blog) {
                setIsLoading(false);
                return;
            }

            // 1. Fetch related blogs
            let relatedBlogsQuery = supabase
                .from("blogs")
                .select("id, title, slug, image, excerpt, blog_categories(*)")
                .eq("status", "published")
                .or("archived.is.null,archived.eq.false")
                .neq("id", blog.id);

            if (blog.category_id) {
                relatedBlogsQuery = relatedBlogsQuery.eq("category_id", blog.category_id);
            }

            const { data: categoryRelatedBlogs } = await relatedBlogsQuery.limit(9);
            let finalRelatedBlogs = categoryRelatedBlogs || [];

            // 2. Backfill
            if (finalRelatedBlogs.length < 9) {
                const needed = 9 - finalRelatedBlogs.length;
                const existingIds = [blog.id, ...finalRelatedBlogs.map((b) => b.id)];

                const { data: backfillBlogs } = await supabase
                    .from("blogs")
                    .select("id, title, slug, image, excerpt, blog_categories(*)")
                    .eq("status", "published")
                    .or("archived.is.null,archived.eq.false")
                    .not("id", "in", `(${existingIds.join(",")})`)
                    .order("created_at", { ascending: false })
                    .limit(needed);

                if (backfillBlogs) {
                    finalRelatedBlogs = [...finalRelatedBlogs, ...backfillBlogs];
                }
            }

            // Format Data
            const formattedBlog = {
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

            const formattedRelated = finalRelatedBlogs.map((rb) => ({
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
            }));

            setBlogData(formattedBlog);
            setRelatedBlogs(formattedRelated);
            setIsLoading(false);
        }

        fetchData();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-24 space-y-8">
                    <Skeleton className="h-12 w-3/4 bg-stone-100" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24 bg-stone-100" />
                        <Skeleton className="h-4 w-24 bg-stone-100" />
                    </div>
                    <Skeleton className="h-[400px] w-full bg-stone-100 rounded-2xl" />
                    <div className="space-y-4 pt-8">
                        <Skeleton className="h-4 w-full bg-stone-100" />
                        <Skeleton className="h-4 w-full bg-stone-100" />
                        <Skeleton className="h-4 w-full bg-stone-100" />
                        <Skeleton className="h-4 w-2/3 bg-stone-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (!blogData) {
        return notFound();
    }

    return <BlogDetail blog={blogData} relatedBlogs={relatedBlogs} />;
}
