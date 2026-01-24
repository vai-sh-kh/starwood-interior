"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Blog, BlogCategory } from "@/lib/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Playfair_Display, Inter } from "next/font/google";

// Initialize fonts
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-inter" });

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };


const BLOG_HERO_IMAGE = "/images/blog-main.png";

const ITEMS_PER_PAGE = 9;

interface BlogsResponse {
  blogs: BlogWithCategory[];
  hasMore: boolean;
  total: number;
}

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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        category: categoryId,
      });

      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data: BlogsResponse = await response.json();

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
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);



  return (
    <div className={`${playfair.variable} ${inter.variable} font-sans min-h-screen bg-[#faf9f6] text-[#1a1a1a] selection:bg-[#d4cdc3] selection:text-[#1a1a1a]`}>

      {/* Hero Header */}
      <header className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 w-full h-full">
          {/* Const hero image */}
          <Image
            alt="Minimalist interior"
            src={BLOG_HERO_IMAGE}
            fill
            className="object-cover grayscale-[20%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-6 filter drop-shadow-md">
          <h1 className="font-display text-6xl md:text-8xl mb-6 tracking-tight">The Journal</h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl font-light opacity-90 leading-relaxed italic font-display">
            Curated insights on high-end interior architecture, material narratives, and the art of living well.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b ${selectedCategory === "all"
              ? "text-[#1a1a1a] border-[#1a1a1a] font-medium"
              : "text-gray-400 border-transparent hover:text-[#1a1a1a]"
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b ${selectedCategory === category.id
                ? "text-[#1a1a1a] border-[#1a1a1a] font-medium"
                : "text-gray-400 border-transparent hover:text-[#1a1a1a]"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {/* Featured Story */}
        {isLoading && !featuredBlog ? (
          <section className="mb-48">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <Skeleton className="aspect-[4/5] w-full" />
              </div>
              <div className="md:col-span-5 md:pl-12 space-y-6">
                <Skeleton className="h-3 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          </section>
        ) : featuredBlog ? (
          <section className="mb-48">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <div className="overflow-hidden group relative aspect-[4/5] bg-gray-100">
                  {isValidImageUrl(featuredBlog.image) ? (
                    <Image
                      alt={featuredBlog.title}
                      src={featuredBlog.image!}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized={featuredBlog.image!.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-5 md:pl-12">
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase mb-6 block text-gray-500">
                  Volume 01 • Featured Story
                </span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-8 text-[#1a1a1a]">
                  {featuredBlog.title}
                </h2>
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8 font-display">
                  {featuredBlog.excerpt || "Explore how minimalist architecture and tactile materiality create sanctuaries of calm in the modern home."}
                </p>
                <Link href={`/blogs/${featuredBlog.slug}`} className="inline-flex items-center space-x-4 group">
                  <span className="text-xs font-medium uppercase tracking-widest border-b border-[#1a1a1a] pb-1 text-[#1a1a1a]">
                    Read the perspective
                  </span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform text-[#1a1a1a]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Article Grid */}
        <section className="grid md:grid-cols-2 gap-x-16 gap-y-32 ">
          {/* Initial Loading Skeletons */}
          {isLoading && remainingBlogs.length === 0 && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <article key={`skeleton-${index}`} className={`flex flex-col ${index % 2 !== 0 ? 'md:translate-y-[100px]' : ''}`}>
                  <Skeleton className="mb-8 aspect-[3/4] w-full" />
                  <Skeleton className="h-3 w-32 mb-4" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-8 w-2/3 mb-6" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </article>
              ))}
            </>
          )}

          {remainingBlogs.map((blog, index) => (
            <article key={blog.id} className={`flex flex-col ${index % 2 !== 0 ? 'md:translate-y-[100px]' : ''}`}>
              <div className="mb-8 overflow-hidden group aspect-[3/4] relative bg-gray-100">
                <Link href={`/blogs/${blog.slug}`}>
                  {isValidImageUrl(blog.image) ? (
                    <Image
                      alt={blog.title}
                      src={blog.image!}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                      unoptimized={blog.image!.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </Link>
              </div>
              <span className="text-[10px] tracking-[0.3em] font-medium uppercase mb-4 block text-gray-500">
                Insights • {blog.blog_categories?.name || "Design"}
              </span>
              <h3 className="font-display text-3xl mb-6 text-[#1a1a1a]">
                <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
              </h3>
              <p className="text-gray-600 font-light leading-relaxed mb-6 font-display line-clamp-3">
                {blog.excerpt || "Exploring the impact of design on our daily well-being."}
              </p>
              <Link href={`/blogs/${blog.slug}`} className="text-xs font-medium uppercase tracking-widest hover:opacity-50 transition text-[#1a1a1a] w-fit">
                Read Article
              </Link>
            </article>
          ))}

          {/* Loading More Skeletons */}
          {isLoadingMore && (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <article key={`loading-more-${index}`} className={`flex flex-col ${(remainingBlogs.length + index) % 2 !== 0 ? 'md:translate-y-[100px]' : ''}`}>
                  <Skeleton className="mb-8 aspect-[3/4] w-full" />
                  <Skeleton className="h-3 w-32 mb-4" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-8 w-2/3 mb-6" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </article>
              ))}
            </>
          )}

          {/* Static Insert from Design: "Curated Mood" Banner */}
          <div className="md:col-span-2 py-12 my-12">
            <div className="relative w-full h-96 overflow-hidden">
              <Image
                alt="Marble texture"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCinG-OqKAwGh55zkUxoUQt6WffGUV89Eyg-SDFA2jlHysm-i7naBd42c39_Ab3WLULZKsPoLPLKifuqIhyu3QPv3nV-FaoPiTR0i-wZmgP-yZux-vLP51fPlLH-j3xkRdU6aX05QWGfVie6ad30AQ1dZ60Fwpwtks_I_WCTcv50YNc-pNO7GoXDIvSzgBEjyHsY16O4g4yczdbiv71qXMtDYrBWlaTWQQKMZOgjt0Qo77gSXM6f5M6gYpR3d4KYUiTar0mTkElUXqq"
                fill
                className="object-cover opacity-80"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-12 py-8 text-center max-w-lg border border-[#d4cdc3]/20 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[.4em] mb-4 text-gray-500">Curated Mood</p>
                  <h4 className="font-display text-2xl italic">"Design is not just what it looks like and feels like. Design is how it works."</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-10 w-full" />


      </main>
    </div>
  );
}

