import React from "react";
import Link from "next/link";
import Image from "@/components/ui/SkeletonImage";
import { Blog, BlogCategory } from "@/lib/supabase/types";

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

interface BlogCardProps {
    blog: BlogWithCategory;
    index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const isValidImageUrl = (url: string | null | undefined): boolean => {
        if (!url) return false;
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        } catch {
            return false;
        }
    };

    return (
        <article className="flex flex-col group h-full">
            {/* Image Container with Dynamic Background */}
            <Link href={`/blogs/${blog.slug}`} className="block mb-6">
                <div className="rounded-3xl aspect-[4/3] relative overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="relative w-full h-full shadow-sm overflow-hidden">
                        {isValidImageUrl(blog.image) ? (
                            <Image
                                alt={blog.title}
                                src={blog.image!}
                                fill
                                className="object-cover"
                                unoptimized={blog.image!.startsWith("http")}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white text-gray-400">
                                <span className="material-symbols-outlined text-4xl">image</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <span className="text-gray-800">{blog.blog_categories?.name || "General"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{/* Read time would go here, hardcoded for now or calc */} 5 min read</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-sm">
                    {blog.excerpt || "No description available."}
                </p>

                <div className="mt-auto flex items-center text-xs text-gray-500 font-medium">
                    <span className="mr-2">{blog.author || "Author"}</span>
                    <span className="mr-2 text-gray-300">|</span>
                    <span>{formatDate(blog.created_at)}</span>
                </div>
            </div>
        </article>
    );
}
