import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getBooleanSetting } from "@/lib/settings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Check if services are enabled
    const servicesEnabled = await getBooleanSetting("services_enabled", true);
    if (!servicesEnabled) {
      return NextResponse.json(
        { error: "Services section is disabled" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const supabase = await createClient();

    // Fetch service by slug
    const { data: service, error } = await supabase
      .from("services")
      .select("*, blog_categories(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Fetch gallery images for this service
    const { data: galleryImages } = await supabase
      .from("service_gallery_images")
      .select("*")
      .eq("service_id", service.id)
      .order("display_order", { ascending: true });

    return NextResponse.json({
      service: {
        ...service,
        galleryImages: galleryImages || [],
      },
    });
  } catch (error) {
    console.error("Error in service detail API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

