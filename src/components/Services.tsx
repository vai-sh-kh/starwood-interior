"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "@/components/ui/SkeletonImage";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceWithCategory } from "@/lib/supabase/types";

import { getServices } from "@/lib/api/client/services";

const ITEMS_PER_PAGE = 9;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Fetch services from API
  const fetchServices = useCallback(
    async (page: number, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const data = await getServices({
          page,
          limit: ITEMS_PER_PAGE
        });

        if (append) {
          setServices((prev) => [...prev, ...data.services]);
        } else {
          setServices(data.services);
        }

        setHasMore(data.hasMore);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchServices(1, false);
  }, [fetchServices]);

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
            fetchServices(currentPage + 1, true);
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
  }, [hasMore, isLoading, isLoadingMore, currentPage, fetchServices]);

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
      id="services"
      className="max-w-7xl mx-auto lg:px-8"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className={`flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-4">
            — Our Services
          </span>
          <h2 className="text-3xl lg:text-[2.5rem] leading-[1.2] font-display font-medium mb-4 text-black">
            Crafting spaces that harmonize <br /> modern elegance with timeless
            design
          </h2>
          <p className="text-gray-600 text-sm lg:text-[15px] font-light max-w-lg mt-4">
            Our contemporary services bring creativity, comfort, and refined
            functionality to the home.
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

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden aspect-4/5"
            >
              {/* Image skeleton */}
              <Skeleton className="w-full h-full rounded-none" />

              {/* Arrow icon skeleton */}
              <Skeleton className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 rounded-full" />

              {/* Content skeleton */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                {/* Title skeleton */}
                <div className="mb-2">
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            No services available yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug || service.id}`}
                className={`group relative overflow-hidden rounded-lg aspect-4/5 block transition-all duration-1000 ease-out bg-stone-200 ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {service.image && !imageErrors[service.id] ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={service.image.includes("supabase.co")}
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [service.id]: true,
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
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-end">
                  <h4 className="text-white text-lg sm:text-xl font-semibold">
                    {service.title}
                  </h4>
                  <div className="bg-white/90 backdrop-blur-sm text-black rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center group-hover:scale-110 transition-transform touch-target">
                    <span className="material-symbols-outlined text-xl">
                      arrow_outward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Loading more skeleton */}
          {isLoadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="relative rounded-lg overflow-hidden aspect-4/5"
                >
                  {/* Image skeleton */}
                  <Skeleton className="w-full h-full rounded-none" />

                  {/* Arrow icon skeleton */}
                  <Skeleton className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 rounded-full" />

                  {/* Content skeleton */}
                  <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                    {/* Title skeleton */}
                    <div className="mb-2">
                      <Skeleton className="h-6 w-3/4" />
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
