"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import ProjectShareButton from "@/components/ProjectShareButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectInfo {
  client?: string;
  location?: string;
  size?: string;
  completion?: string;
  services?: string[];
}

interface Project {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  description: string | null;
  content: string | null;
  category?: {
    name: string;
  } | null;
  tags?: string[] | null;
  is_new?: boolean | null;
  project_info?: ProjectInfo | null;
  quote?: string | null;
  quote_author?: string | null;
  galleryImages?: Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>;
}

interface ProjectDetailProps {
  project: Project;
  relatedProjects?: Array<{
    id: string;
    title: string;
    slug: string;
    image: string | null;
    description: string | null;
    category?: {
      name: string;
    } | null;
  }>;
}

const BANNER_IMAGE = "/images/project-detail.png";

export default function ProjectDetail({
  project,
  relatedProjects = [],
}: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const projectInfo = project.project_info || {};
  const categoryName =
    project.category?.name ||
    (projectInfo as ProjectInfo)?.location?.split(",")[0] ||
    "Residential Design";

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
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }));
  };

  // Extract content sections
  const contentHtml = project.content || "";
  const overviewMatch = contentHtml.match(
    /<h3[^>]*>Project Overview<\/h3>[\s\S]*?<p[^>]*>(.*?)<\/p>/i
  );
  const designMatch = contentHtml.match(
    /<h3[^>]*>Design Approach<\/h3>[\s\S]*?<p[^>]*>(.*?)<\/p>/i
  );

  // Get gallery images - use first gallery image as featured, rest for gallery
  const galleryImages = project.galleryImages || [];
  const featuredImage = project.image || galleryImages[0]?.image_url || "";
  // Show all gallery images (excluding the first one if it's used as featured)
  const allGalleryImages =
    galleryImages.length > 0 && !project.image
      ? galleryImages.slice(1)
      : galleryImages;

  // Handle lightbox navigation
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < allGalleryImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "ArrowLeft" &&
      selectedImageIndex !== null &&
      selectedImageIndex > 0
    ) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (
      e.key === "ArrowRight" &&
      selectedImageIndex !== null &&
      selectedImageIndex < allGalleryImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else if (e.key === "Escape") {
      setSelectedImageIndex(null);
    }
  };

  // Get previous/next projects
  const currentIndex = relatedProjects.findIndex((p) => p.id === project.id);
  const previousProject =
    currentIndex > 0 ? relatedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < relatedProjects.length - 1
      ? relatedProjects[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-background-light text-[#111618] font-display antialiased">
      {/* Hero Section */}
      <header className="relative pt-24 min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src={BANNER_IMAGE}
            alt="Project banner"
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
            {project.title}
          </h1>
          <p className="text-gray-200 text-base md:text-lg lg:text-xl font-serif italic max-w-2xl leading-relaxed drop-shadow-sm opacity-95">
            {project.description ||
              "A modern approach to design, blending heritage with contemporary comfort."}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 bg-background-light -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-16 lg:py-24">
          {/* Featured Image */}
          {featuredImage && isValidImageUrl(featuredImage) && (
            <div className="w-full mb-12 md:mb-24 flex flex-col items-center">
              <div className="w-full max-w-5xl rounded-2xl overflow-hidden border-black relative aspect-video bg-gray-100">
                {!imageErrors["featured"] ? (
                  <>
                    <Image
                      alt={`${project.title} - Main living area`}
                      src={featuredImage}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                      onError={() => handleImageError("featured")}
                      unoptimized={featuredImage.includes("supabase.co")}
                    />
                  </>
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 mb-8 md:mb-14">
            {/* Left Sidebar - Project Info */}
            <aside className="lg:col-span-3 lg:block order-2 lg:order-1">
              <div className="sticky top-28 space-y-10 border-l-2 border-[#f0f3f4] pl-6 lg:pl-8">
                <h3 className="font-serif text-2xl text-[#111618] mb-6">
                  Project Info
                </h3>

                {projectInfo.client && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Client
                    </p>
                    <p className="text-[#111618] text-base font-medium">
                      {projectInfo.client}
                    </p>
                  </div>
                )}

                {projectInfo.location && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Location
                    </p>
                    <p className="text-[#111618] text-base font-medium">
                      {projectInfo.location}
                    </p>
                  </div>
                )}

                {projectInfo.size && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Size
                    </p>
                    <p className="text-[#111618] text-base font-medium">
                      {projectInfo.size}
                    </p>
                  </div>
                )}

                {projectInfo.completion && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Completion
                    </p>
                    <p className="text-[#111618] text-base font-medium">
                      {projectInfo.completion}
                    </p>
                  </div>
                )}

                {projectInfo.services && projectInfo.services.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Services
                    </p>
                    <div className="flex flex-col gap-2">
                      {projectInfo.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-[#111618] text-sm border-b border-gray-100 pb-1 w-fit"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <ProjectShareButton
                    title={project.title}
                    slug={project.slug}
                    variant="button"
                  />
                </div>
              </div>
            </aside>

            {/* Right Content */}
            <div className="lg:col-span-8 lg:col-start-5 order-1 lg:order-2">
              <div className="prose prose-lg max-w-none">
                <h3 className="font-serif text-3xl md:text-4xl text-[#111618] mb-8">
                  Project Overview
                </h3>
                {overviewMatch ? (
                  <p
                    className="text-lg text-gray-600 leading-relaxed mb-12"
                    dangerouslySetInnerHTML={{
                      __html: overviewMatch[1],
                    }}
                  />
                ) : (
                  <p className="text-lg text-gray-600 leading-relaxed mb-12">
                    {project.description ||
                      "This project showcases our commitment to creating exceptional spaces that blend functionality with aesthetic excellence."}
                  </p>
                )}

                {/* Second Image - After Project Overview */}
                {allGalleryImages.length > 0 &&
                  allGalleryImages[0] &&
                  isValidImageUrl(allGalleryImages[0].image_url) && (
                    <div className="w-full mb-12 md:mb-16 flex flex-col items-center">
                      <div
                        className="w-full max-w-5xl rounded-2xl overflow-hidden border-black relative aspect-video cursor-pointer group bg-gray-100"
                        onClick={() => setSelectedImageIndex(0)}
                      >
                        {!imageErrors[`gallery-0`] ? (
                          <>
                            <Image
                              alt={`${project.title} - Project detail`}
                              src={allGalleryImages[0].image_url}
                              fill
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                              onError={() => handleImageError(`gallery-0`)}
                              unoptimized={allGalleryImages[0].image_url.includes(
                                "supabase.co"
                              )}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                  <svg
                                    className="w-6 h-6 text-[#111618]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </>
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

                <h3 className="font-serif text-3xl md:text-4xl text-[#111618] mb-8">
                  Design Approach
                </h3>
                {designMatch ? (
                  <div
                    className="text-lg text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: designMatch[1],
                    }}
                  />
                ) : (
                  <div
                    className="text-lg text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: contentHtml || project.description || "",
                    }}
                  />
                )}
              </div>

              {/* Quote Block */}
              {project.quote && (
                <div className="my-16 border-y border-[#dce3e5] py-12">
                  <blockquote className="text-center max-w-2xl mx-auto">
                    <span className="material-symbols-outlined text-5xl text-primary/20 mb-6 block">
                      format_quote
                    </span>
                    <p className="font-serif text-2xl md:text-3xl italic text-[#111618] mb-6 leading-relaxed">
                      &quot;{project.quote}&quot;
                    </p>
                    {project.quote_author && (
                      <footer className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        — {project.quote_author}
                      </footer>
                    )}
                  </blockquote>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          {allGalleryImages.length > 1 && (
            <section className="mb-0 md:mb-16">
              <h3 className="font-serif text-3xl md:text-4xl text-[#111618] mb-12 text-center">
                Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {allGalleryImages.slice(1).map((img, index) => {
                  const imageKey = `gallery-${index + 1}`;
                  const isValid = isValidImageUrl(img.image_url);
                  return (
                    <div
                      key={img.id || index}
                      className="relative group overflow-hidden rounded-xl cursor-pointer aspect-square bg-gray-100"
                      onClick={() =>
                        isValid &&
                        !imageErrors[imageKey] &&
                        setSelectedImageIndex(index + 1)
                      }
                    >
                      {isValid && !imageErrors[imageKey] ? (
                        <>
                          <Image
                            alt={`${project.title} - Gallery image ${
                              index + 1
                            }`}
                            src={img.image_url}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => handleImageError(imageKey)}
                            unoptimized={img.image_url.includes("supabase.co")}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                <svg
                                  className="w-6 h-6 text-[#111618]"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="material-symbols-outlined text-gray-400 text-4xl">
                            image_not_supported
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Lightbox Modal */}
          <Dialog
            open={selectedImageIndex !== null}
            onOpenChange={(open) => !open && setSelectedImageIndex(null)}
          >
            <DialogContent
              className="max-w-[100vw] w-full h-screen max-h-screen p-0 gap-0 bg-black/95 border-0"
              showCloseButton={true}
            >
              {selectedImageIndex !== null &&
                allGalleryImages[selectedImageIndex] && (
                  <div
                    className="relative w-full h-full flex items-center justify-center"
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  >
                    {/* Previous Button */}
                    {selectedImageIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={handlePrevious}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    )}

                    {/* Image */}
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
                      {isValidImageUrl(
                        allGalleryImages[selectedImageIndex].image_url
                      ) ? (
                        <img
                          src={allGalleryImages[selectedImageIndex].image_url}
                          alt={`${project.title} - Gallery image ${
                            selectedImageIndex + 1
                          }`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const errorDiv = document.createElement("div");
                            errorDiv.className = "text-white text-center";
                            errorDiv.innerHTML = `
                              <span class="material-symbols-outlined text-6xl mb-4 block">image_not_supported</span>
                              <p>Image failed to load</p>
                            `;
                            target.parentElement?.appendChild(errorDiv);
                          }}
                        />
                      ) : (
                        <div className="text-white text-center">
                          <span className="material-symbols-outlined text-6xl mb-4 block">
                            image_not_supported
                          </span>
                          <p>Invalid image URL</p>
                        </div>
                      )}
                    </div>

                    {/* Next Button */}
                    {selectedImageIndex < allGalleryImages.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={handleNext}
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      {selectedImageIndex + 1} / {allGalleryImages.length}
                    </div>
                  </div>
                )}
            </DialogContent>
          </Dialog>

          {/* Previous/Next Navigation */}
          {(previousProject || nextProject) && (
            <div className="border-t border-[#dce3e5] pt-8 pb-4 md:pt-16 md:pb-8">
              <div className="grid grid-cols-2 gap-8">
                {previousProject ? (
                  <Link
                    href={`/projects/${previousProject.slug}`}
                    className="group flex flex-col items-start gap-2 text-left"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                      Previous Project
                    </span>
                    <h4 className="font-serif text-2xl md:text-3xl font-medium text-[#111618] group-hover:underline decoration-1 underline-offset-4">
                      {previousProject.title}
                    </h4>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextProject ? (
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    className="group flex flex-col items-end gap-2 text-right"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                      Next Project
                    </span>
                    <h4 className="font-serif text-2xl md:text-3xl font-medium text-[#111618] group-hover:underline decoration-1 underline-offset-4">
                      {nextProject.title}
                    </h4>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
