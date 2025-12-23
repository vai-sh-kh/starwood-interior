"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";

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
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
}

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blogContentStyles }} />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        {/* Hero Section */}
        <div className="flex flex-col w-full">
          <div
            className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 md:py-24 items-center justify-center relative w-full min-h-[400px] md:min-h-[500px]"
            style={{
              width: "100vw",
              marginLeft: "calc((100% - 100vw) / 2)",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0.7) 100%), url("${post.image}")`,
            }}
          >
            <div className="relative z-10 flex flex-col gap-3 text-center max-w-4xl px-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider rounded">
                  {post.category}
                </span>
              </div>
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-200 text-sm md:text-base font-medium mt-2">
                <span>{post.date}</span>
                <span className="mx-1">•</span>
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </div>

        <PageContainer>
          <main className="flex grow flex-col w-full py-8 sm:py-12 md:py-16">
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
              {/* Featured Image */}
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${post.image}")`,
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  className="blog-content text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-12"></div>

              {/* Author Info */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      person
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-primary text-lg font-bold mb-1">
                      {post.author}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Published on {post.date}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </div>

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
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                  <span>Share this article</span>
                </div>
              </div>
            </article>
          </main>
          <BottomNav />
        </PageContainer>
        <Footer />
      </div>
    </>
  );
}
