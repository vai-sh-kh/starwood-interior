import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth-helpers";

/**
 * GET /api/settings
 * Get a setting value by key
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Setting not found
        return NextResponse.json({ value: null }, { status: 200 });
      }
      console.error("Error fetching setting:", error);
      return NextResponse.json(
        { error: "Failed to fetch setting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ value: data?.value || null });
  } catch (error) {
    console.error("Error in settings API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Update a setting value (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: "Setting value is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if setting exists
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", key)
      .single();

    if (existing) {
      // Update existing setting
      const { error } = await supabase
        .from("settings")
        .update({ value })
        .eq("key", key);

      if (error) {
        console.error("Error updating setting:", error);
        return NextResponse.json(
          { error: "Failed to update setting" },
          { status: 500 }
        );
      }
    } else {
      // Insert new setting
      const { error } = await supabase
        .from("settings")
        .insert({ key, value });

      if (error) {
        console.error("Error inserting setting:", error);
        return NextResponse.json(
          { error: "Failed to create setting" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle redirect from requireAdmin
    if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in settings API:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

