"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import BlogShareButton from "@/components/BlogShareButton";

// Add styles for blog content
const blogContentStyles = `
  .blog-content {
    font-size: 1.125rem;
    line-height: 1.75;
  }
  .blog-content p {
    margin-bottom: 1.5rem;
    color: #374151;
  }
  .blog-content h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.3;
  }
  .blog-content h2:first-of-type {
    margin-top: 0;
  }
  .blog-content p:last-child {
    margin-bottom: 0;
  }
`;

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  created_at: string | null;
  category: {
    name: string;
  } | null;
  tags?: string[] | null;
}

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string | null;
  category: {
    name: string;
  } | null;
}

interface BlogDetailProps {
  blog: BlogPost;
  relatedBlogs?: RelatedBlog[];
}

const BANNER_IMAGE = "/images/blog_detail.png";

export default function BlogDetail({
  blog,
  relatedBlogs = [],
}: BlogDetailProps) {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [relatedImageErrors, setRelatedImageErrors] = useState<{
    [key: string]: boolean;
  }>({});

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(blog.created_at);
  const categoryName = blog.category?.name || "Uncategorized";
  const authorName = blog.author || "Starwood Interiors Team";

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

  // Handle image error
  const handleImageError = (imageKey: string) => {
    setImageError((prev) => ({ ...prev, [imageKey]: true }));
  };

  // Handle related blog image error
  const handleRelatedImageError = (imageKey: string) => {
    setRelatedImageErrors((prev) => ({ ...prev, [imageKey]: true }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blogContentStyles }} />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        {/* Hero Section */}
        <header className="relative pt-24 min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 w-full h-full">
            <Image
              src={BANNER_IMAGE}
              alt="Blog banner"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
            <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30"></div>
          </div>

          <div
            className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full flex flex-col justify-end pb-16 md:pb-24"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 w-fit text-xs font-bold tracking-[0.15em] text-white uppercase border border-white/30 bg-white/10 backdrop-blur-sm rounded-full">
              {categoryName}
            </span>
            <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium leading-tight tracking-tight mb-4 max-w-4xl drop-shadow-sm">
              {blog.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-200 text-base md:text-lg lg:text-xl font-serif italic mb-2 drop-shadow-sm opacity-95">
              {formattedDate && <span>{formattedDate}</span>}
              {formattedDate && authorName && <span className="mx-2">•</span>}
              {authorName && <span>{authorName}</span>}
            </div>
          </div>
        </header>

        {/* Main Content - Rounded Section */}
        <main className="relative z-20 bg-background-light -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-16 lg:py-24">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                href="/blogs"
                className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all w-fit"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                Back to Blogs
              </Link>
            </div>

            {/* Blog Content */}
            <article className="max-w-4xl mx-auto">
              {/* Featured Image - Blog Image from Admin */}
              {blog.image && isValidImageUrl(blog.image) && (
                <div className="w-full mb-12 md:mb-24 flex flex-col items-center">
                  <div className="w-full max-w-5xl rounded-2xl overflow-hidden border-black relative aspect-video bg-gray-100">
                    {!imageError["main"] ? (
                      <Image
                        alt={blog.title}
                        src={blog.image}
                        fill
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                        priority
                        onError={() => handleImageError("main")}
                        unoptimized={blog.image.includes("supabase.co")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="material-symbols-outlined text-gray-400 text-6xl">
                          image_not_supported
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              {blog.content && (
                <div className="prose prose-lg max-w-none">
                  <div
                    className="blog-content text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 mb-8">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-12"></div>

              {/* Author Info */}
              {(authorName || formattedDate || blog.excerpt) && (
                <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        person
                      </span>
                    </div>
                    <div className="flex-1">
                      {authorName && (
                        <h3 className="text-primary text-lg font-bold mb-1">
                          {authorName}
                        </h3>
                      )}
                      {formattedDate && (
                        <p className="text-gray-600 text-sm mb-3">
                          Published on {formattedDate}
                        </p>
                      )}
                      {blog.excerpt && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Blogs */}
              {relatedBlogs.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id}
                        href={`/blogs/${relatedBlog.slug}`}
                        className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          {relatedBlog.image &&
                          isValidImageUrl(relatedBlog.image) &&
                          !relatedImageErrors[relatedBlog.id] ? (
                            <Image
                              src={relatedBlog.image}
                              alt={relatedBlog.title}
                              fill
                              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              onError={() =>
                                handleRelatedImageError(relatedBlog.id)
                              }
                              unoptimized={relatedBlog.image.includes(
                                "supabase.co"
                              )}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <span className="material-symbols-outlined text-gray-400 text-4xl">
                                article
                              </span>
                            </div>
                          )}
                          {relatedBlog.category && (
                            <span className="absolute top-3 left-3 bg-white backdrop-blur text-xs font-bold uppercase tracking-wider py-1 px-2 rounded shadow-sm">
                              {relatedBlog.category.name}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-4">
                          <h3 className="text-lg font-bold text-primary-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedBlog.title}
                          </h3>
                          {relatedBlog.excerpt && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {relatedBlog.excerpt}
                            </p>
                          )}
                          <span className="text-primary text-sm font-semibold mt-auto flex items-center gap-1">
                            Read more
                            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                              arrow_forward
                            </span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Posts / Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                <Link
                  href="/blogs"
                  className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_back
                  </span>
                  View All Blogs
                </Link>
                <BlogShareButton title={blog.title} slug={blog.slug} />
              </div>
            </article>
          </div>
          <BottomNav />
        </main>
        <Footer />
      </div>
    </>
  );
}
