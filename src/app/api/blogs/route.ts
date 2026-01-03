import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const supabase = await createClient();

    // Build base query - only show published, non-archived blogs
    let query = supabase
      .from("blogs")
      .select("*, blog_categories(*)", { count: "exact" })
      .eq("status", "published")
      .or("archived.is.null,archived.eq.false")
      .order("created_at", { ascending: false });

    // Apply category filter if provided
    if (category && category !== "all") {
      query = query.eq("category_id", category);
    }

    let data: any[] = [];
    let error: any = null;
    let count: number | null = null;

    // If search is active, fetch all results first, then filter and paginate
    // This ensures we don't miss results due to pagination before filtering
    if (search && search.trim()) {
      // Fetch all matching results (no pagination yet)
      const result = await query;
      data = (result.data || []) as any[];
      error = result.error;
      count = result.count;

      if (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
          { error: "Failed to fetch blogs" },
          { status: 500 }
        );
      }

      // Apply search filter
      const searchLower = search.trim().toLowerCase();
      data = data.filter((blog) => {
        const titleMatch = blog.title?.toLowerCase().includes(searchLower);
        const authorMatch = blog.author?.toLowerCase().includes(searchLower);
        const excerptMatch = blog.excerpt?.toLowerCase().includes(searchLower);
        const contentMatch = blog.content?.toLowerCase().includes(searchLower);
        const tagsMatch =
          blog.tags &&
          blog.tags.length > 0 &&
          blog.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
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

      // Apply pagination to filtered results
      const from = (page - 1) * limit;
      const to = from + limit;
      const paginatedData = data.slice(from, to);
      const total = data.length;
      const hasMore = to < total;

      return NextResponse.json({
        blogs: paginatedData,
        hasMore,
        total,
        page,
        limit,
      });
    } else {
      // No search: use normal pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const result = await query;
      data = (result.data || []) as any[];
      error = result.error;
      count = result.count;

      if (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
          { error: "Failed to fetch blogs" },
          { status: 500 }
        );
      }

      const total = count || 0;
      const hasMore = to < total - 1;

      return NextResponse.json({
        blogs: data,
        hasMore,
        total,
        page,
        limit,
      });
    }
  } catch (error) {
    console.error("Error in blogs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

