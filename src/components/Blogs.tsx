"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { Blog, BlogCategory } from "@/lib/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

const ITEMS_PER_PAGE = 9;

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("blogs")
        .select("*, blog_categories(*)")
        .or("archived.is.null,archived.eq.false");

      // Apply category filter if not "all" (uses idx_blogs_category_id index)
      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } else {
        let filteredData = (data as BlogWithCategory[]) || [];

        // Apply search filter across all fields: title, author, excerpt, content, and tags
        // This ensures comprehensive search while leveraging indexes for category/archived filters
        if (debouncedSearchQuery.trim()) {
          const searchLower = debouncedSearchQuery.trim().toLowerCase();
          filteredData = filteredData.filter((blog) => {
            // Check text fields: title, author, excerpt, content (case-insensitive)
            const titleMatch = blog.title?.toLowerCase().includes(searchLower);
            const authorMatch = blog.author
              ?.toLowerCase()
              .includes(searchLower);
            const excerptMatch = blog.excerpt
              ?.toLowerCase()
              .includes(searchLower);
            const contentMatch = blog.content
              ?.toLowerCase()
              .includes(searchLower);

            // Check tags array (case-insensitive)
            const tagsMatch =
              blog.tags &&
              blog.tags.length > 0 &&
              blog.tags.some((tag) => tag.toLowerCase().includes(searchLower));

            // Include blog if search matches any field (title, author, excerpt, content, or tags)
            return (
              titleMatch ||
              authorMatch ||
              excerptMatch ||
              contentMatch ||
              tagsMatch ||
              false
            );
          });
        }

        console.log("Fetched blogs:", filteredData.length);
        setBlogs(filteredData);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, debouncedSearchQuery, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error:", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const checkScrollButtons = useCallback(() => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = categoryScrollRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      categoryScrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
      // Check scroll buttons after a short delay to allow scroll to complete
      setTimeout(checkScrollButtons, 100);
    }
  };

  // Setup scroll listeners and check scroll buttons when categories change
  useEffect(() => {
    checkScrollButtons();
    const scrollElement = categoryScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollButtons);
      // Check on resize as well
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        scrollElement.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [checkScrollButtons, categories]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Blogs are already filtered from database query, no need to filter again
  const filteredBlogs = blogs;

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedCategory]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 z-0 h-[600px] w-full">
          <Image
            alt="Warm, inviting residential interior with personalized touches"
            src="/images/blog-main.png"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background-light"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-24">
          <h1 className="text-4xl md:text-6xl font-display-serif font-bold text-white mb-6 leading-tight">
            Your Home, Your Story: <br /> Personal Design Journeys
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Find inspiration and practical advice for creating spaces that
            reflect your unique style and enhance everyday living.
          </p>
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-xl bg-white/95 backdrop-blur text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary transition-all transform group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {isLoadingCategories ? (
            <>
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center space-x-2 py-1">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-26 rounded-full" />
                <Skeleton className="h-10 w-30 rounded-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            </>
          ) : (
            <>
              <button
                onClick={() => scrollCategories("left")}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition shrink-0 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!canScrollLeft}
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>
              </button>
              <div
                ref={categoryScrollRef}
                className="flex-1 overflow-x-auto hide-scrollbar flex items-center space-x-2 py-1"
              >
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === "all"
                      ? "bg-primary text-white shadow-md"
                      : "bg-transparent hover:bg-gray-100 rounded-full text-gray-600 border border-transparent hover:border-gray-200"
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition border border-transparent ${
                      selectedCategory === category.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-transparent hover:bg-gray-100 rounded-full text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => scrollCategories("right")}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition shrink-0 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!canScrollRight}
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <article
                key={index}
                className="flex flex-col bg-white rounded-2xl w-[360px] overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Image skeleton */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Skeleton className="w-full h-full rounded-none" />
                  {/* Category badge skeleton */}
                  <Skeleton className="absolute top-4 left-4 h-6 w-24 rounded" />
                </div>

                {/* Content skeleton */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Date and author skeleton */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-1 w-1 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  {/* Title skeleton */}
                  <div className="mb-3 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/5" />
                  </div>

                  {/* Excerpt skeleton */}
                  <div className="mb-6 space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* Read More skeleton */}
                  <Skeleton className="h-5 w-28" />
                </div>
              </article>
            ))}
          </div>
        ) : paginatedBlogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-2">
              {debouncedSearchQuery || selectedCategory !== "all"
                ? "No blogs found matching your criteria"
                : "No blogs available yet"}
            </p>
            {(debouncedSearchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-primary hover:opacity-70 text-sm font-medium transition-opacity"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100"
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="flex flex-col flex-1"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title || "Blog post"}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-4xl">
                          article
                        </span>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white backdrop-blur text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-sm">
                      {blog.blog_categories?.name || "Uncategorized"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                      <span>{formatDate(blog.created_at)}</span>
                      {blog.author && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{blog.author}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-display-serif font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {blog.excerpt || "No excerpt available"}
                    </p>
                    <div className="inline-flex items-center text-sm font-bold text-primary hover:opacity-70 transition-opacity">
                      Read More{" "}
                      <span className="material-symbols-outlined text-base ml-1 transform group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredBlogs.length > 0 && totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition border border-gray-100 ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-gray-400 px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
}
