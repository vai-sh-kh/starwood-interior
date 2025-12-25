import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getBooleanSetting } from "@/lib/settings";

export async function GET(request: NextRequest) {
  try {
    // Check if services are enabled
    const servicesEnabled = await getBooleanSetting("services_enabled", true);
    if (!servicesEnabled) {
      return NextResponse.json(
        { error: "Services section is disabled" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const category = searchParams.get("category");

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from("services")
      .select("*, blog_categories(*)", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false });

    // Apply category filter if provided
    if (category && category !== "all") {
      query = query.eq("category_id", category);
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      );
    }

    const total = count || 0;
    const hasMore = to < total - 1;

    return NextResponse.json({
      services: data || [],
      hasMore,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in services API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

