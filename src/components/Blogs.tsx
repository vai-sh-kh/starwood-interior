"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

import { createClient } from "@/lib/supabase/client";
import { Blog, BlogCategory } from "@/lib/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/ui/BlogCard";

// Fonts are inherited from RootLayout

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };




import { getBlogs } from "@/lib/api/client/blogs";

const ITEMS_PER_PAGE = 9;

export default function Blogs() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const supabase = createClient();

  // Fetch categories
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      // Step 1: Get distinct category IDs from published blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("category_id")
        .eq("status", "published")
        .or("archived.is.null,archived.eq.false")
        .not("category_id", "is", null);

      if (blogsError || !blogsData) {
        console.error("Error fetching blog categories usage:", blogsError);
        return;
      }

      // Extract unique category IDs
      const usedCategoryIds = Array.from(new Set(blogsData.map((b) => b.category_id))).filter((id): id is string => id !== null);

      if (usedCategoryIds.length === 0) {
        setCategories([]);
        return;
      }

      // Step 2: Fetch category details for these IDs
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("blog_categories")
        .select("*")
        .in("id", usedCategoryIds)
        .order("name");

      if (categoriesData) setCategories(categoriesData);
      if (categoriesError) console.error("Error fetching categories:", categoriesError);
    };

    fetchCategories();
  }, [supabase]);

  // Fetch blogs
  const fetchBlogs = useCallback(async (page: number, categoryId: string, append: boolean = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const data = await getBlogs({
        page,
        limit: ITEMS_PER_PAGE,
        category: categoryId,
      });

      setBlogs((prev) => (append ? [...prev, ...data.blogs] : data.blogs));
      setHasMore(data.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(1, selectedCategory, false);
  }, [fetchBlogs, selectedCategory]);

  // Infinite Scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading || isLoadingMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchBlogs(currentPage + 1, selectedCategory, true);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, currentPage, selectedCategory, fetchBlogs]);

  // Validate image URL






  return (
    <div className={`font-sans min-h-screen bg-white text-[#1a1a1a] selection:bg-[#d4cdc3] selection:text-[#1a1a1a]`}>

      <main className="max-w-[1600px] mx-auto px-6 pt-12 pb-24">



        {/* Category Filter */}
        {/* Category Filter */}
        {/* Category Filter */}
        <div className="relative w-full md:max-w-7xl mx-auto mb-10 px-0 md:px-12">
          <div
            className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth py-4 items-center justify-start md:justify-center px-4 md:px-4"
            id="category-container"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap text-sm font-semibold tracking-wide uppercase transition-colors duration-200 shrink-0 ${selectedCategory === "all"
                ? "text-black border-b-2 border-black pb-1"
                : "text-gray-400 hover:text-black"
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap text-sm font-semibold tracking-wide uppercase transition-colors duration-200 shrink-0 ${selectedCategory === category.id
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-gray-400 hover:text-black"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Navigation Buttons for Desktop Only */}
          <div className="hidden md:block">
            <button
              onClick={() => {
                const container = document.getElementById('category-container');
                if (container) container.scrollLeft -= 200;
              }}
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 text-gray-400 hover:text-black transition-colors z-10"
            >
              <span className="material-symbols-outlined text-sm">west</span>
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('category-container');
                if (container) container.scrollLeft += 200;
              }}
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 text-gray-400 hover:text-black transition-colors z-10"
            >
              <span className="material-symbols-outlined text-sm">east</span>
            </button>
          </div>
        </div>

        {/* Article Grid - Uniform Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {/* Initial Loading Skeletons */}
          {isLoading && blogs.length === 0 && (
            <>
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="flex flex-col">
                  <Skeleton className="mb-6 aspect-[4/3] w-full rounded-3xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </>
          )}

          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}

          {/* Loading More Skeletons */}
          {isLoadingMore && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-more-${index}`} className="flex flex-col">
                  <Skeleton className="mb-6 aspect-[4/3] w-full rounded-3xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </>
          )}

        </section>

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 text-black underline hover:no-underline"
            >
              View all articles
            </button>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-10 w-full mt-12" />


      </main>
    </div>
  );
}

