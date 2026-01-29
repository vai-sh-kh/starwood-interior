"use client";

import Link from "next/link";
import Image from "@/components/ui/SkeletonImage";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Font Inter is inherited from RootLayout

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

export default function BlogDetail({
  blog,
  relatedBlogs = [],
}: BlogDetailProps) {
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Responsive slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate reading time
  const [readingTime, setReadingTime] = useState("5 min");

  useEffect(() => {
    if (blog.content) {
      const words = blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      setReadingTime(`${minutes < 10 ? '0' + minutes : minutes} min`);
    }
  }, [blog.content]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "August 24, 2024";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(blog.created_at);
  const authorName = blog.author || "Starwood Interiors";

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

  return (
    <div className={`font-sans antialiased text-gray-900 bg-white selection:bg-gray-100 selection:text-black`}>

      <main className="max-w-[1000px] mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <header className="mb-12">
          {/* Meta Top */}
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-6">
            <Link href="/blogs" className="hover:text-black transition-colors">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-900">{blog.category?.name || "Journal"}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{authorName}</span>
            </div>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{readingTime} read</span>
          </div>
        </header>

        {/* Featured Image */}
        {isValidImageUrl(blog.image) && (
          <div className="w-full relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-16 shadow-sm">
            <Image
              src={blog.image!}
              alt={blog.title}
              fill
              className="object-cover"
              unoptimized={blog.image!.startsWith("http")}
              priority
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mb-8
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-lg prose-p:leading-8 prose-p:text-gray-700 prose-p:mb-6
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-gray-900
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:marker:text-gray-400
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
            prose-li:my-2 prose-li:text-gray-700
            prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-8
            prose-img:rounded-xl prose-img:shadow-md prose-img:my-10
            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-900 prose-code:before:content-none prose-code:after:content-none
            prose-hr:my-12 prose-hr:border-gray-100
        ">
          <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Related Stories */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Read Next</h2>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => Math.min(relatedBlogs.length - itemsPerPage, prev + 1))}
                  disabled={currentSlide >= relatedBlogs.length - itemsPerPage}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden -mx-4 px-4 py-4">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)` }}
              >
                {relatedBlogs.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <Link href={`/blogs/${item.slug}`} className="group block h-full">
                      <div className="aspect-[3/2] relative overflow-hidden bg-gray-200 rounded-xl mb-4 shadow-sm">
                        {isValidImageUrl(item.image) ? (
                          <Image
                            src={item.image!}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized={item.image!.startsWith("http")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                          {item.category?.name || "Journal"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:underline transition-all decoration-1 underline-offset-4 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
