"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const headerRef = useRef<HTMLDivElement>(null);
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

  // Intersection Observer for header animation
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
        rootMargin: "100px", // Start loading before reaching the bottom
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, currentPage, fetchProjects]);

  // Parallax effect with Lenis
  useEffect(() => {
    interface LenisInstance {
      scroll: number;
      on: (event: string, handler: () => void) => void;
      off: (event: string, handler: () => void) => void;
    }

    const lenis = (window as unknown as { lenis?: LenisInstance }).lenis;
    if (!lenis) return;

    const handleScroll = () => {
      if (headerRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;

        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - elementTop) / (windowHeight + rect.height)
          )
        );

        const translateY = (scrollProgress - 0.5) * 20;
        headerRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="max-w-7xl mx-auto  lg:px-8"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className={`flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-4">
            — Our Works
          </span>
          <h2 className="text-3xl lg:text-[2.5rem] leading-[1.2] font-display font-medium mb-4 text-black">
            Delivering impact through <br /> every structure we create
          </h2>
          <p className="text-gray-600 text-sm lg:text-[15px] font-light max-w-lg mt-4">
            Every project is a reflection of our dedication to quality,
            innovation, and purpose. From urban landmarks to essential community
            spaces — we build with integrity and intention.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
          </button>
          <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity group shadow-lg">
            <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden h-[420px] shadow-md"
            >
              {/* Image skeleton */}
              <Skeleton className="w-full h-full rounded-none" />

              {/* New badge skeleton */}
              <Skeleton className="absolute top-4 left-4 h-6 w-16 rounded-full" />

              {/* Arrow icon skeleton */}
              <Skeleton className="absolute top-4 right-4 w-10 h-10 rounded-full" />

              {/* Content skeleton */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                {/* Title skeleton */}
                <div className="mb-2 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>

                {/* Description skeleton */}
                <div className="mb-5 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Tags skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug || project.id}`}
                className={`group relative rounded-2xl overflow-hidden h-[420px] cursor-pointer shadow-md transition-all duration-1000 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {project.image && !imageErrors[project.id] ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-4xl">
                      image_not_supported
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>

                {/* New Badge */}
                {project.is_new && (
                  <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    New
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/10 rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="material-symbols-outlined text-white text-sm transform -rotate-45">
                    arrow_forward
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-white text-xl font-bold mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-white text-xs leading-relaxed line-clamp-2 mb-5 font-bold">
                    {project.description || "No description available"}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-white/20 backdrop-blur-lg border border-white/30 text-white/95 text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg shadow-black/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Loading more skeleton */}
          {isLoadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="relative rounded-2xl overflow-hidden h-[420px] shadow-md"
                >
                  <Skeleton className="w-full h-full rounded-none" />
                  <Skeleton className="absolute top-4 left-4 h-6 w-16 rounded-full" />
                  <Skeleton className="absolute top-4 right-4 w-10 h-10 rounded-full" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="mb-2 space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="mb-5 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sentinel element for infinite scroll */}
          <div ref={sentinelRef} className="h-10 w-full" />
        </>
      )}
    </section>
  );
}
