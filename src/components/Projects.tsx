"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectWithCategory } from "@/lib/supabase/types";

const ITEMS_PER_PAGE = 9;

interface ProjectsResponse {
    projects: ProjectWithCategory[];
    hasMore: boolean;
    total: number;
    page: number;
    limit: number;
}

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [projects, setProjects] = useState<ProjectWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
        {}
    );

    // Fetch projects from API
    const fetchProjects = useCallback(
        async (page: number, append: boolean = false) => {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response = await fetch(
                    `/api/projects?page=${page}&limit=${ITEMS_PER_PAGE}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data: ProjectsResponse = await response.json();

                if (append) {
                    setProjects((prev) => [...prev, ...data.projects]);
                } else {
                    setProjects(data.projects);
                }

                setHasMore(data.hasMore);
                setCurrentPage(page);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        []
    );

    // Initial load
    useEffect(() => {
        fetchProjects(1, false);
    }, [fetchProjects]);

    // Intersection Observer for animation
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore || isLoading || isLoadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && hasMore && !isLoadingMore) {
                        fetchProjects(currentPage + 1, true);
                    }
                });
            },
            {
                rootMargin: "100px",
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, isLoading, isLoadingMore, currentPage, fetchProjects]);

    // Helper to get year from project
    const getProjectYear = (project: ProjectWithCategory) => {
        if (project.created_at) {
            return new Date(project.created_at).getFullYear().toString();
        }
        return "2024";
    };

    return (
        <section ref={sectionRef} className="pt-16 pb-20">
            {/* Header */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12">
                <div
                    className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-12 h-px bg-stone-900/20"></span>
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400">
                            Our Portfolio
                        </span>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-24">
                        <div className="flex-1">
                            <h2 className="text-2xl mb-8 md:text-5xl lg:text-[4.5rem] font-serif text-stone-900 leading-none tracking-tighter">
                                Exceptional <span className="italic">Design</span> Stories
                            </h2>
                            <p className="text-stone-500 text-base max-w-[1000px]  md:text-lg font-light leading-relaxed">
                                Every project is a reflection of our dedication to quality,
                                innovation, and purpose. We transform spaces into meaningful
                                environments with integrity and intention.
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 w-full h-px bg-stone-100"></div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex flex-col">
                                <Skeleton className="aspect-[4/5] w-full mb-8" />
                                <Skeleton className="h-4 w-16 mb-4" />
                                <Skeleton className="h-8 w-3/4 mb-2" />
                                <Skeleton className="h-8 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg">
                            No projects available yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                            {projects.map((project, index) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug || project.id}`}
                                    className={`project-card flex flex-col cursor-pointer group transition-all duration-700 ease-out ${isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="aspect-[4/5] overflow-hidden mb-8 bg-stone-100 relative">
                                        {project.image &&
                                            !imageErrors[project.id] &&
                                            !project.image.includes("placeholder.com") ? (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.02]"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                unoptimized={project.image.includes("supabase.co")}
                                                onError={() =>
                                                    setImageErrors((prev) => ({
                                                        ...prev,
                                                        [project.id]: true,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                                                <span className="text-stone-400 text-sm">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">
                                            {getProjectYear(project)}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight text-stone-900">
                                            {project.title}
                                        </h3>
                                        {project.description && (
                                            <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Loading more skeleton */}
                        {isLoadingMore && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 mt-20">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={`loading-${index}`} className="flex flex-col">
                                        <Skeleton className="aspect-[4/5] w-full mb-8" />
                                        <Skeleton className="h-4 w-16 mb-4" />
                                        <Skeleton className="h-8 w-3/4 mb-2" />
                                        <Skeleton className="h-8 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sentinel element for infinite scroll */}
                        <div ref={sentinelRef} className="h-10 w-full" />
                    </>
                )}
            </div>
        </section>
    );
}
