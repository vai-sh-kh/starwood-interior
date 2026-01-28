import { notFound, redirect } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { createClient } from "@/lib/supabase/server";
import { getBooleanSetting } from "@/lib/settings";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!project) {
    return {
      title: "Project Not Found - Starwood Interiors",
    };
  }

  // Use custom meta fields if available, otherwise use defaults
  const title = project.meta_title || `${project.title} - Starwood Interiors`;
  const description =
    project.meta_description ||
    project.description ||
    `Discover our ${project.title.toLowerCase()} project. Premium design solutions tailored to your unique vision.`;
  const url = `/projects/${project.slug}`;

  // Extract first paragraph from content for better Open Graph description if no meta description
  let ogDescription = description;
  if (!project.meta_description && project.content) {
    const descriptionMatch = project.content.match(/<p>(.*?)<\/p>/);
    if (descriptionMatch) {
      ogDescription = descriptionMatch[1]
        .replace(/<[^>]*>/g, "")
        .substring(0, 160);
    }
  }

  const imageUrl =
    project.image ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAcENDP2w6i8b0OvG5_ZaeBxeX3eqGGY-P9nvn7qxkUQHlbhNQNfZlntBdw8Vk9k5peYUdgWnTTBoMYbntApUzL6G-QkUfCHsQZ11ZwWwqimPebCMEkBPO48lDlqaHPW3oUwUNFpJ61zXBtvExHAcJ5pABYkPNyb_RoJ_nyR_MrmkaEMIsql5uncB1R2jl6J2NT5BworFrBvc0t4_oaXZKtnbT1dN4e_iKfNf1AL1WU6XyfO6YSVRfmOop-RSK2Qyc29-hTwatb8gM";

  return {
    title,
    description,
    keywords: project.meta_keywords ? project.meta_keywords.split(',').map(k => k.trim()) : undefined,
    openGraph: {
      title: project.meta_title || title,
      description: ogDescription,
      url,
      siteName: "Starwood Interiors",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.meta_title || title,
      description: ogDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;

  // Check if projects are enabled
  const projectsEnabled = await getBooleanSetting("projects_enabled", true);
  if (!projectsEnabled) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, blog_categories(*)")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch gallery images for this project
  const { data: galleryImages } = await supabase
    .from("project_gallery_images")
    .select("*")
    .eq("project_id", project.id)
    .order("display_order", { ascending: true });

  // Fetch related projects (same category, excluding current project)
  let relatedProjectsQuery = supabase
    .from("projects")
    .select("id, title, slug, image, description, blog_categories(*)")
    .eq("status", "published")
    .neq("id", project!.id)
    .limit(4);

  // If project has a category, filter by category
  if (project!.category_id) {
    relatedProjectsQuery = relatedProjectsQuery.eq(
      "category_id",
      project!.category_id
    );
  }

  const { data: relatedProjects } = await relatedProjectsQuery;

  // TypeScript: project is guaranteed to be non-null after notFound() check above
  const projectData = {
    id: project!.id,
    title: project!.title,
    slug: project!.slug || "",
    image: project!.image,
    description: project!.description,
    content: project!.content,
    category: project!.blog_categories
      ? {
        name: project!.blog_categories.name,
      }
      : null,
    tags: project!.tags,
    is_new: project!.is_new,
    banner_title: project!.banner_title,
    client_name: project!.client_name,
    sarea: project!.sarea,
    project_type: project!.project_type,
    completion_date: project!.completion_date,
    project_info: project!.project_info as
      | {
        client?: string;
        location?: string;
        size?: string;
        completion?: string;
        services?: string[];
      }
      | null,
    quote: project!.quote,
    quote_author: project!.quote_author,
    galleryImages: galleryImages?.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      display_order: img.display_order,
    })) || [],
  };

  const relatedProjectsData =
    relatedProjects?.map((rp) => ({
      id: rp.id,
      title: rp.title,
      slug: rp.slug || "",
      image: rp.image,
      description: rp.description,
      category: rp.blog_categories
        ? {
          name: rp.blog_categories.name,
        }
        : null,
    })) || [];

  return (
    <ProjectDetail
      project={projectData}
      relatedProjects={relatedProjectsData}
    />
  );
}
