"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

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
      setReadingTime(`${minutes < 10 ? '0' + minutes : minutes} Min`);
    }
  }, [blog.content]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "AUGUST 24, 2024";
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
    <div className={`${playfair.variable} ${inter.variable} font-sans antialiased text-stone-900 bg-white selection:bg-stone-900 selection:text-white`}>

      {/* Simple Header */}
      <header className="pt-32 pb-16 bg-stone-50">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-6">
              {blog.category?.name || "Journal"}
            </span>
            <h1 className="text-stone-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic font-light leading-tight tracking-tighter">
              {blog.title}
            </h1>
            <div className="mt-8 w-24 h-[1px] bg-stone-300"></div>
          </div>
        </div>
      </header>

      {/* Detail Section & Intro */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left Column: Featured Image Context */}
            <div className="lg:col-span-7">
              {isValidImageUrl(blog.image) && (
                <div className="w-full relative bg-stone-100 overflow-hidden rounded-sm shadow-sm aspect-[4/3]">
                  <Image
                    src={blog.image!}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    unoptimized={blog.image!.startsWith("http")}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Meta Details */}
            <div className="lg:col-span-5 space-y-10 lg:pl-10 lg:pt-12">
              <span className="block text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400">
                Context
              </span>

              <div className="space-y-8">
                <div className="border-b border-stone-200 pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                    Author
                  </p>
                  <p className="text-lg text-stone-900 font-light">
                    {authorName}
                  </p>
                </div>

                <div className="border-b border-stone-200 pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                    Date
                  </p>
                  <p className="text-lg text-stone-900 font-light">
                    {formattedDate}
                  </p>
                </div>

                <div className="border-b border-stone-200 pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                    Read Time
                  </p>
                  <p className="text-lg text-stone-900 font-light">
                    {readingTime} Reading
                  </p>
                </div>

                <div className="pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {blog.tags && blog.tags.length > 0 ? (
                      blog.tags.map((tag) => (
                        <span key={tag} className="text-sm text-stone-700 bg-white px-4 py-2 border border-stone-200">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Main Content Body */}
      <section className="py-24 md:py-32 bg-white border-y border-stone-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex flex-col gap-4 lg:gap-10">
            <div className="max-w-4xl">
              <span className="block text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400 mb-6">
                Story Deep Dive
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif text-stone-900 leading-[0.9] tracking-tighter">
                Story <span className="italic">Overview</span>
              </h3>
            </div>
            <div className="w-full">
              <div className={`prose prose-lg prose-stone max-w-none
                    prose-headings:font-serif prose-headings:font-normal prose-headings:text-stone-900
                    prose-h1:text-5xl prose-h1:mt-16 prose-h1:mb-8
                    prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-6
                    prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-5
                    prose-p:text-xl prose-p:text-stone-600 prose-p:font-light prose-p:leading-relaxed prose-p:mb-10
                    prose-a:text-stone-900 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-stone-600
                    prose-strong:text-stone-900 prose-strong:font-semibold
                    prose-em:text-stone-700 prose-em:italic
                    prose-ul:my-10 prose-ul:pl-10 prose-ul:list-disc
                    prose-ol:my-10 prose-ol:pl-10 prose-ol:list-decimal
                    prose-li:text-stone-600 prose-li:font-light prose-li:mb-4 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-stone-300 prose-blockquote:pl-10 prose-blockquote:italic prose-blockquote:text-stone-500 prose-blockquote:my-12
                    prose-img:rounded-[2.5rem] prose-img:my-16 prose-img:shadow-2xl
                    prose-hr:my-16 prose-hr:border-stone-200
                    first:prose-p:mt-0`}>
                {/* Dropcap style injection */}
                <style jsx global>{`
                    .prose > p:first-of-type::first-letter {
                        float: left;
                        font-family: var(--font-playfair), serif;
                        font-size: 5rem;
                        line-height: 0.8;
                        padding-top: 0.1em;
                        padding-right: 0.2em;
                        color: #1c1917;
                    }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Visual Study / Gallery Section (Refactored to match Project Gallery Grid) */}
      <section className="pt-24 pb-24 bg-stone-50">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-6">
              Visual Study
            </span>
            <h3 className="text-4xl md:text-5xl font-serif italic text-stone-900">
              Curated Gallery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Item 1 */}
            <div className="aspect-square relative group overflow-hidden bg-stone-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVOUiDvMeNEZOD68Ox9l7z9Bb6dViHtu6CKJXaJ9mYNoTFf07giYUfDCFc1rX6S4Tw1fEXeweKRRXwcfWv5yo2A1SRHQk9AMtpFuVTgfFDafqPaR977Ko5miN1i-H3abnwpSr-OB8ZIM02KXFLdmsP0NeBw53PieLzEO7IpNEahvId3EZe6OitMv2apIeS4DmilhimYW5i4PyKfU5S4ufnE03aoGfrbVh_mo9W6uTymDKLFLkGtu7puGwE5ex6kjx6geQxk1Qsyf_Y"
                alt="Visual Detail 1"
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Item 2 */}
            <div className="aspect-square relative group overflow-hidden bg-stone-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBneXdBr40h9kX9PaOdIoqqNsclodF8P2F5-q7qtOn0MtM5Xz_VPotHE4FfzbuuYFTjxk_ATyvTxjgKTjC4Fa6DMjvHXzde9r-b6OiRrsad7TPLb5XrWjrPprGZ_tZGCeMqlz40wtAhKu0Ydel6Gte3kaNC4MeLwzq4EpCQkb4fsraKsImRtBiKlRUxJ2yBILjJAglHeITxDZbkxH3RGSBZRdLj309W2tRo1a01U8vHosZNc1QMDoSLs-fzQu9e33JfJk0wFCuSWGFv"
                alt="Visual Detail 2"
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Item 3 */}
            <div className="aspect-square relative group overflow-hidden bg-stone-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDhCPM1raOER3Wk_YcMPmv-D92ViT3bJlqR1DEdgN4dVNCu0qztUZ3IjJMbG1JJNBMrGTN2Q0BqHs-BG2TcVM-d1fkKa4-_CNRF6_Ivz9mGQEA1zOiCve1xrSK9-bNpMozbiSxyqc7BxNec0Ayf8aYYLUBtHDGqmNaSy5qs2lRIwnbNztrOM2y60cIWQl4GMU2X1t0tYAT5mygDcvEn4SszlAvDHkbPjHMrFoGFHWt-MlGeRvuIQOXCC9u8b1pVtFdhhDg1I-Jhy9x"
                alt="Visual Detail 3"
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Related Stories */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 block">Archive</span>
              <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900">Related Blogs</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => Math.min(relatedBlogs.length - itemsPerPage, prev + 1))}
                  disabled={currentSlide >= relatedBlogs.length - itemsPerPage || relatedBlogs.length <= itemsPerPage}
                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="w-px h-8 bg-stone-200 mx-2 hidden md:block"></div>
              <Link href="/blogs" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-stone-900 pb-2 hover:opacity-60 transition hidden md:block">
                View Journal Index
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)` }}
            >
              {relatedBlogs.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <Link href={`/blogs/${item.slug}`} className="group block h-full">
                    <div className="aspect-square relative overflow-hidden bg-gray-200 animate-pulse mb-6">
                      {isValidImageUrl(item.image) ? (
                        <Image
                          src={item.image!}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized={item.image!.startsWith("http")}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement?.classList.remove('animate-pulse', 'bg-gray-200');
                            target.parentElement?.classList.add('bg-stone-100');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-100">
                          <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                        {item.category?.name || "Journal"}
                      </span>
                      <h3 className="text-xl font-serif group-hover:italic transition-all duration-300 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {relatedBlogs.length === 0 && (
              <div className="py-12 text-center text-stone-400 font-light italic">
                More stories coming soon.
              </div>
            )}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link href="/blogs" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-stone-900 pb-2 hover:opacity-60 transition">
              View Journal Index
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
