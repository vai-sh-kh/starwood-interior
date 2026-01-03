import { notFound, redirect } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";
import { createClient } from "@/lib/supabase/server";
import { getBooleanSetting } from "@/lib/settings";
import type { Metadata } from "next";
import { ServiceWithGallery } from "@/lib/supabase/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!service) {
    return {
      title: "Service Not Found - Starwood Interiors",
    };
  }

  const title = `${service.title} - Starwood Interiors`;
  const description =
    service.meta_description ||
    service.description?.substring(0, 160) ||
    `Discover our ${service.title.toLowerCase()} service. Premium design solutions tailored to your unique vision.`;
  const url = `/services/${service.slug}`;

  return {
    title: service.meta_title || title,
    description,
    openGraph: {
      title: service.meta_title || title,
      description,
      url,
      siteName: "Starwood Interiors",
      images: service.image
        ? [
            {
              url: service.image,
              width: 1200,
              height: 630,
              alt: service.title,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.meta_title || title,
      description,
      images: service.image ? [service.image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;

  // Check if services are enabled
  const servicesEnabled = await getBooleanSetting("services_enabled", true);
  if (!servicesEnabled) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (error || !service) {
    notFound();
  }

  // Fetch gallery images for this service
  const { data: galleryImages } = await supabase
    .from("service_gallery_images")
    .select("*")
    .eq("service_id", service.id)
    .order("display_order", { ascending: true });

  // Fetch subservices for this service
  const { data: subservices } = await supabase
    .from("subservices")
    .select("*")
    .eq("parent_service_id", service.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const serviceData: ServiceWithGallery = {
    ...service,
    service_gallery_images: galleryImages || [],
    blog_categories: service.blog_categories || null,
  };

  return (
    <ServiceDetail
      service={serviceData}
      subservices={subservices || []}
    />
  );
}
