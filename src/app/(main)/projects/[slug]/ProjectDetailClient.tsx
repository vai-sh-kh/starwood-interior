"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail"; // Ensure this path is correct based on your project structure
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailClient({ slug }: { slug: string }) {
    const [projectData, setProjectData] = useState<any>(null);
    const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!slug) return;

            const supabase = createClient();

            const { data: project, error } = await supabase
                .from("projects")
                .select("*, blog_categories(*)")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error || !project) {
                setIsLoading(false);
                return; // Will trigger not found or empty state
            }

            // Fetch gallery images
            const { data: galleryImages } = await supabase
                .from("project_gallery_images")
                .select("*")
                .eq("project_id", project.id)
                .order("display_order", { ascending: true });

            // Fetch related projects
            let relatedQuery = supabase
                .from("projects")
                .select("id, title, slug, image, description, blog_categories(*)")
                .eq("status", "published")
                .neq("id", project.id)
                .limit(4);

            if (project.category_id) {
                relatedQuery = relatedQuery.eq("category_id", project.category_id);
            }

            const { data: related } = await relatedQuery;

            // Transform Data
            const formattedProject = {
                id: project.id,
                title: project.title,
                slug: project.slug || "",
                image: project.image,
                description: project.description,
                content: project.content,
                category: project.blog_categories
                    ? {
                        name: project.blog_categories.name,
                    }
                    : null,
                tags: project.tags,
                is_new: project.is_new,
                banner_title: project.banner_title,
                client_name: project.client_name,
                sarea: project.sarea,
                project_type: project.project_type,
                completion_date: project.completion_date,
                project_info: project.project_info as
                    | {
                        client?: string;
                        location?: string;
                        size?: string;
                        completion?: string;
                        services?: string[];
                    }
                    | null,
                quote: project.quote,
                quote_author: project.quote_author,
                galleryImages: galleryImages?.map((img) => ({
                    id: img.id,
                    image_url: img.image_url,
                    display_order: img.display_order,
                })) || [],
            };

            const formattedRelated =
                related?.map((rp) => ({
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

            setProjectData(formattedProject);
            setRelatedProjects(formattedRelated);
            setIsLoading(false);
        }

        fetchData();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                {/* Hero Skeleton */}
                <div className="h-[60vh] md:h-[80vh] bg-stone-100 animate-pulse relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Skeleton className="h-12 w-1/3 bg-stone-200" />
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-6 w-full bg-stone-100" />
                            <Skeleton className="h-6 w-full bg-stone-100" />
                            <Skeleton className="h-6 w-2/3 bg-stone-100" />
                            <Skeleton className="h-96 w-full bg-stone-100 mt-12" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full bg-stone-100" />
                            <Skeleton className="h-64 w-full bg-stone-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!projectData) {
        return notFound();
    }

    return (
        <ProjectDetail
            project={projectData}
            relatedProjects={relatedProjects}
        />
    );
}
