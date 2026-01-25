"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Blog, BlogCategory } from "@/lib/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

interface RecentBlogsProps {
    blogsEnabled: boolean;
}

export default function RecentBlogs({ blogsEnabled }: RecentBlogsProps) {
    const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchRecentBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from("blogs")
                    .select("*, blog_categories(*)")
                    .eq("status", "published")
                    .or("archived.is.null,archived.eq.false")
                    .order("created_at", { ascending: false })
                    .limit(3);

                if (error) {
                    console.error("Error fetching recent blogs:", error);
                } else {
                    setBlogs(data || []);
                }
            } catch (err) {
                console.error("Unexpected error fetching blogs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentBlogs();
    }, [supabase]);

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

    // Don't render section if blogs are disabled or no blogs are available
    if (!blogsEnabled || (!isLoading && blogs.length === 0)) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-[#faf9f6]">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 md:gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500 mb-3 md:mb-4">The Journal</p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-black">Latest Insights</h2>
                    </motion.div>

                    {blogsEnabled && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Link href="/blogs" className="group flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-medium text-black hover:opacity-70 transition-opacity">
                                View All Articles
                                <span className="material-symbols-outlined text-base md:text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
                    {isLoading ? (
                        // Loading Skeletons
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="flex flex-col">
                                <Skeleton className="mb-6 aspect-[3/4] w-full" />
                                <Skeleton className="h-3 w-24 mb-4" />
                                <Skeleton className="h-8 w-full mb-3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mt-2" />
                            </div>
                        ))
                    ) : blogs.length > 0 ? (
                        blogs.map((blog, index) => (
                            <motion.article
                                key={blog.id}
                                className="flex flex-col group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="mb-6 overflow-hidden aspect-[3/4] relative bg-stone-100">
                                    <Link href={`/blogs/${blog.slug}`}>
                                        {isValidImageUrl(blog.image) ? (
                                            <Image
                                                alt={blog.title}
                                                src={blog.image!}
                                                fill
                                                className="object-cover transition duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                unoptimized={blog.image!.startsWith("http")}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                <span className="material-symbols-outlined text-4xl">image</span>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-medium uppercase mb-2 md:mb-3 block text-gray-400">
                                        {blog.blog_categories?.name || "Design"}
                                    </span>
                                    <h3 className="font-serif text-xl md:text-2xl mb-3 md:mb-4 text-[#1a1a1a] leading-tight group-hover:underline decoration-1 underline-offset-4">
                                        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                                    </h3>
                                    <p className="text-gray-600 font-light leading-relaxed mb-4 md:mb-6 line-clamp-3 text-sm">
                                        {blog.excerpt || "Explore how minimalist architecture and tactile materiality create sanctuaries of calm in the modern home."}
                                    </p>
                                    <Link href={`/blogs/${blog.slug}`} className="mt-auto text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#1a1a1a] hover:opacity-60 transition-opacity w-fit border-b border-black pb-0.5">
                                        Read Article
                                    </Link>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <p>No articles found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
