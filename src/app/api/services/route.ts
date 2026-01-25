import { NextResponse } from "next/server";
import { SERVICES_DATA } from "@/lib/services-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedServices = SERVICES_DATA.slice(start, end).map(service => ({
        id: service.slug,
        title: service.listingTitle,
        slug: service.slug,
        image: service.listingImage,
        description: service.listingDescription,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_id: null,
        status: 'published'
    }));
    const hasMore = end < SERVICES_DATA.length;

    return NextResponse.json({
        services: paginatedServices,
        hasMore,
        total: SERVICES_DATA.length,
        page,
        limit
    });
}
