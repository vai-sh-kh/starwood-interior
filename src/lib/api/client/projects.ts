import { createClient } from "@/lib/supabase/client";
import { getBooleanSettingClient } from "./settings";

// Since Project type might not be exported from types fully or handled generically, we use any or infer
// But better to try to import specific type if possible. 
// Given previous code uses `any` in some places but `Project` exists likely..
// Checking src/lib/supabase/types.ts would be ideal but I will infer from usage in route.
// Route uses `any` in some places implicitly but `supabase` returns typed data.

export interface ProjectsResponse {
    projects: any[]; // Using any to be safe as types file not inspected fully, but likely matches DB
    hasMore: boolean;
    total: number;
    page: number;
    limit: number;
}

export interface FetchProjectsParams {
    page?: number;
    limit?: number;
    category?: string;
}

export async function getProjects({
    page = 1,
    limit = 9,
    category
}: FetchProjectsParams): Promise<ProjectsResponse> {

    // Check if projects are enabled
    const projectsEnabled = await getBooleanSettingClient("projects_enabled", true);
    if (!projectsEnabled) {
        throw new Error("Projects section is disabled");
    }

    const supabase = createClient();

    let query = supabase
        .from("projects")
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
        throw error;
    }

    const total = count || 0;
    const hasMore = to < total - 1;

    return {
        projects: data || [],
        hasMore,
        total,
        page,
        limit
    };
}
