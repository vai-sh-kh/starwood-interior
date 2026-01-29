import { SERVICES_DATA } from "@/lib/services-data";

export interface ServicesResponse {
    services: any[];
    hasMore: boolean;
    total: number;
    page: number;
    limit: number;
}

export interface FetchServicesParams {
    page?: number;
    limit?: number;
}

export async function getServices({
    page = 1,
    limit = 9
}: FetchServicesParams): Promise<ServicesResponse> {
    // Simulate async network delay if needed, but not necessary for static client logic

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedServices = SERVICES_DATA.slice(start, end).map(service => ({
        id: service.slug,
        title: service.listingTitle,
        slug: service.slug,
        image: service.listingImage,
        description: service.listingDescription,
        created_at: new Date().toISOString(), // Mock dates as per original API
        updated_at: new Date().toISOString(),
        category_id: null,
        status: 'published'
    }));

    const hasMore = end < SERVICES_DATA.length;

    return {
        services: paginatedServices,
        hasMore,
        total: SERVICES_DATA.length,
        page,
        limit
    };
}
