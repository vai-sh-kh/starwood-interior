import { notFound } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";
import { SERVICES } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const service = SERVICES.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    return {
      title: "Service Not Found - Starwood Interiors",
    };
  }

  const title = `${service.name} - Starwood Interiors`;
  const description = `Discover our ${service.name.toLowerCase()} service. Premium design solutions tailored to your unique vision.`;
  const url = `/services/${service.slug}`;

  // Extract first paragraph from description for better Open Graph description
  const descriptionMatch = service.description.match(/<p>(.*?)<\/p>/);
  const ogDescription = descriptionMatch
    ? descriptionMatch[1].replace(/<[^>]*>/g, "").substring(0, 160)
    : description;

  return {
    title,
    description,
    openGraph: {
      title,
      description: ogDescription,
      url,
      siteName: "Starwood Interiors",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.alt,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: [service.image],
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
  const service = SERVICES.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const serviceData = {
    name: service.name,
    slug: service.slug,
    image: service.image,
    alt: service.alt,
    description: service.description,
  };

  return <ServiceDetail service={serviceData} />;
}
