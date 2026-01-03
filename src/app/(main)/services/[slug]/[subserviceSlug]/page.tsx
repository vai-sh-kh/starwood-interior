import { notFound, redirect } from "next/navigation";
import SubServiceDetail from "@/components/SubServiceDetail";
import { createClient } from "@/lib/supabase/server";
import { getBooleanSetting } from "@/lib/settings";
import type { Metadata } from "next";
import { ServiceWithGallery } from "@/lib/supabase/types";

export async function generateMetadata({
  params,
}: {
  params:
    | Promise<{ slug: string; subserviceSlug: string }>
    | { slug: string; subserviceSlug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  // First, get the parent service
  const { data: parentService } = await supabase
    .from("services")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!parentService) {
    return {
      title: "Service Not Found - Starwood Interiors",
    };
  }

  // Then get the subservice from subservices table
  // Verify it belongs to the parent service via parent_service_id
  const { data: subservice } = await supabase
    .from("subservices")
    .select("*")
    .eq("slug", resolvedParams.subserviceSlug)
    .eq("status", "published")
    .eq("parent_service_id", parentService.id)
    .single();

  if (!subservice) {
    return {
      title: "Subservice Not Found - Starwood Interiors",
    };
  }

  const title = `${subservice.title} - ${parentService.title} - Starwood Interiors`;
  const description =
    subservice.meta_description ||
    subservice.description?.substring(0, 160) ||
    `Discover our ${subservice.title.toLowerCase()} service. Premium design solutions tailored to your unique vision.`;
  const url = `/services/${parentService.slug}/${subservice.slug}`;

  return {
    title: subservice.meta_title || title,
    description,
    openGraph: {
      title: subservice.meta_title || title,
      description,
      url,
      siteName: "Starwood Interiors",
      images: subservice.image
        ? [
            {
              url: subservice.image,
              width: 1200,
              height: 630,
              alt: subservice.title,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: subservice.meta_title || title,
      description,
      images: subservice.image ? [subservice.image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function SubServiceDetailPage({
  params,
}: {
  params:
    | Promise<{ slug: string; subserviceSlug: string }>
    | { slug: string; subserviceSlug: string };
}) {
  const resolvedParams = await params;

  // Check if services are enabled
  const servicesEnabled = await getBooleanSetting("services_enabled", true);
  if (!servicesEnabled) {
    redirect("/");
  }

  const supabase = await createClient();

  // First, get the parent service
  const { data: parentService, error: parentError } = await supabase
    .from("services")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (parentError || !parentService) {
    notFound();
  }

  // Then get the subservice from subservices table
  // Verify it belongs to the parent service via parent_service_id
  const { data: subservice, error: subserviceError } = await supabase
    .from("subservices")
    .select("*")
    .eq("slug", resolvedParams.subserviceSlug)
    .eq("status", "published")
    .eq("parent_service_id", parentService.id)
    .single();

  if (subserviceError || !subservice) {
    notFound();
  }

  // Fetch gallery images for the subservice (subservices have their own gallery table)
  const { data: subserviceGalleryImages } = await supabase
    .from("subservice_gallery_images")
    .select("*")
    .eq("subservice_id", subservice.id)
    .order("display_order", { ascending: true });

  // Fetch gallery images for the parent service (optional, for fallback)
  const { data: parentGalleryImages } = await supabase
    .from("service_gallery_images")
    .select("*")
    .eq("service_id", parentService.id)
    .order("display_order", { ascending: true });

  // Transform subservice to match ServiceWithGallery format
  const subserviceData: ServiceWithGallery & { faq?: Array<{ question: string; answer: string }> | null } = {
    id: subservice.id,
    title: subservice.title,
    slug: subservice.slug,
    description: subservice.description,
    content: subservice.content,
    image: subservice.image,
    status: subservice.status,
    category_id: null,
    tags: null,
    is_new: false,
    meta_title: subservice.meta_title,
    meta_description: subservice.meta_description,
    created_at: subservice.created_at,
    updated_at: subservice.updated_at,
    faq: subservice.faq as Array<{ question: string; answer: string }> | null,
    service_gallery_images: (subserviceGalleryImages || []).map((img) => ({
      id: img.id,
      service_id: subservice.id, // Map subservice_id to service_id for compatibility
      image_url: img.image_url,
      display_order: img.display_order,
      created_at: img.created_at,
    })),
    blog_categories: null,
  };

  const parentServiceData: ServiceWithGallery = {
    ...parentService,
    service_gallery_images: parentGalleryImages || [],
    blog_categories: parentService.blog_categories || null,
  };

  return (
    <SubServiceDetail
      subservice={subserviceData}
      parentService={parentServiceData}
    />
  );
}

