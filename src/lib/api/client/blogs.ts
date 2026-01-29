import { createClient } from "@/lib/supabase/client";
import { Blog, BlogCategory } from "@/lib/supabase/types";

export type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

export interface BlogsResponse {
    blogs: BlogWithCategory[];
    hasMore: boolean;
    total: number;
    page: number;
    limit: number;
}

export interface FetchBlogsParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
}

export async function getBlogs({
    page = 1,
    limit = 9,
    category,
    search,
}: FetchBlogsParams): Promise<BlogsResponse> {
    const supabase = createClient();

    let query = supabase
        .from("blogs")
        .select("*, blog_categories(*)", { count: "exact" })
        .eq("status", "published")
        .or("archived.is.null,archived.eq.false")
        .order("created_at", { ascending: false });

    if (category && category !== "all") {
        query = query.eq("category_id", category);
    }

    if (search && search.trim()) {
        // Fetch all matching results to filter in memory (replicating API route logic)
        const { data, error, count: dbCount } = await query;
        if (error) throw error;

        let blogs = (data as BlogWithCategory[]) || [];
        const searchLower = search.trim().toLowerCase();

        // Client-side filtering logic
        blogs = blogs.filter((blog) => {
            const titleMatch = blog.title?.toLowerCase().includes(searchLower);
            const authorMatch = blog.author?.toLowerCase().includes(searchLower);
            const excerptMatch = blog.excerpt?.toLowerCase().includes(searchLower);
            const contentMatch = blog.content?.toLowerCase().includes(searchLower);
            const tagsMatch =
                blog.tags &&
                Array.isArray(blog.tags) &&
                blog.tags.some((tag: any) =>
                    String(tag).toLowerCase().includes(searchLower)
                );

            return (
                titleMatch ||
                authorMatch ||
                excerptMatch ||
                contentMatch ||
                tagsMatch ||
                false
            );
        });

        const total = blogs.length;
        const from = (page - 1) * limit;
        const to = from + limit;
        const paginatedData = blogs.slice(from, to);
        const hasMore = to < total;

        return {
            blogs: paginatedData,
            hasMore,
            total,
            page,
            limit,
        };
    } else {
        // No search: use database pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        const total = count || 0;
        // to is index, so if to is 8, total is 10. 8 < 9.
        const hasMore = to < total - 1;

        return {
            blogs: (data as BlogWithCategory[]) || [],
            hasMore,
            total,
            page,
            limit,
        };
    }
}
