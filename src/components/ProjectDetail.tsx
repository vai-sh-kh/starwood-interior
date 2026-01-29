"use client";

import React, { useState } from "react";
import Image from "@/components/ui/SkeletonImage";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectShareButton from "@/components/ProjectShareButton";
import CTASection from "@/components/home/CTASection";

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
  banner_title?: string | null;
  client_name?: string | null;
  sarea?: string | null;
  project_type?: string | null;
  completion_date?: string | null;
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

export default function ProjectDetail({
  project,
  relatedProjects = [],
}: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const projectInfo = project.project_info || {};
  const categoryName = project.category?.name || (projectInfo as ProjectInfo)?.location?.split(",")[0] || "Residential Design";

  // Resolve fields from new columns or fallback to project_info
  const clientVal = project.client_name || projectInfo.client;
  const sizeVal = project.sarea || projectInfo.size;
  const completionVal = project.completion_date || projectInfo.completion;
  const projectTypeVal = project.project_type;
  const bannerTitleVal = project.banner_title;

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

  // Get gallery images
  const galleryImages = project.galleryImages || [];
  const featuredImage = project.image || galleryImages[0]?.image_url || "";
  const allGalleryImages = galleryImages.length > 0 && !project.image ? galleryImages.slice(1) : galleryImages;

  // Handle lightbox navigation
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex < allGalleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (e.key === "ArrowRight" && selectedImageIndex !== null && selectedImageIndex < allGalleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else if (e.key === "Escape") {
      setSelectedImageIndex(null);
    }
  };

  return (
    <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
      {/* Hero Section - Matching AboutHeader style */}
      <header className="relative w-full h-[70vh] min-h-[600px] flex flex-col justify-end pb-24">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: featuredImage ? `url("${featuredImage}")` : "none",
          }}
        ></div>
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10"></div>

        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-6 md:px-12">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-white/90 mb-6 drop-shadow-sm">
              {categoryName}
            </span>
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic font-light leading-none tracking-tighter drop-shadow-md">
              {bannerTitleVal || project.title}
            </h1>
            <div className="mt-8 w-24 h-[1px] bg-white/50"></div>
            {project.description && (
              <p className="mt-8 text-white/80 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="py-24 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Featured Image */}
            {featuredImage && isValidImageUrl(featuredImage) && (
              <div className="w-full relative overflow-hidden rounded-sm shadow-sm transition-all duration-500">
                {!imageErrors["featured"] ? (
                  <img
                    alt={project.title}
                    src={featuredImage}
                    className="w-full h-auto min-h-[400px] md:min-h-[600px] max-h-[800px] object-cover block"
                    onError={() => handleImageError("featured")}
                  />
                ) : (
                  <div className="w-full h-[60vh] flex items-center justify-center bg-stone-200">
                    <span className="material-symbols-outlined text-stone-400 text-6xl">
                      image_not_supported
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Project Details */}
            <div className="space-y-10 lg:pl-10">
              <span className="block text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400">
                Detailed View
              </span>
              <div>
                <h3 className="text-4xl font-serif leading-tight text-stone-900 mb-4">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-stone-500 text-base font-light leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="space-y-8">
                {(clientVal || projectTypeVal || projectInfo.location || sizeVal || completionVal) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 border-b border-stone-200 pb-8">
                    {clientVal && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                          Client
                        </p>
                        <p className="text-lg text-stone-900 font-light">
                          {clientVal}
                        </p>
                      </div>
                    )}

                    {projectTypeVal && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                          Project Type
                        </p>
                        <p className="text-lg text-stone-900 font-light">
                          {projectTypeVal}
                        </p>
                      </div>
                    )}

                    {projectInfo.location && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                          Location
                        </p>
                        <p className="text-lg text-stone-900 font-light">
                          {projectInfo.location}
                        </p>
                      </div>
                    )}

                    {sizeVal && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                          Size (Sarea)
                        </p>
                        <p className="text-lg text-stone-900 font-light">
                          {sizeVal}
                        </p>
                      </div>
                    )}

                    {completionVal && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">
                          Completion
                        </p>
                        <p className="text-lg text-stone-900 font-light">
                          {completionVal}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {projectInfo.services && projectInfo.services.length > 0 && (
                  <div className="pb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {projectInfo.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-sm text-stone-700 bg-white px-4 py-2 border border-stone-200"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <ProjectShareButton
                    title={project.title}
                    slug={project.slug}
                    variant="button"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Project Content Section - Vertical Stack Narrative */}
      {
        project.content && (
          <section className="py-24 md:py-32 bg-white border-y border-stone-100">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="flex flex-col gap-12 md:gap-20">
                <div className="max-w-4xl">
                  <span className="block text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400 mb-6">
                    Project Deep Dive
                  </span>
                  <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif text-stone-900 leading-[0.9] tracking-tighter">
                    Project <span className="italic">Overview</span>
                  </h3>
                </div>
                <div className="w-full">
                  <div
                    className="prose prose-lg prose-stone max-w-none
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
                    first:prose-p:mt-0"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* Gallery Section */}
      {
        allGalleryImages.length > 0 && (
          <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-stone-50">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="text-center mb-16">
                <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-6">
                  Visual Journey
                </span>
                <h3 className="text-4xl md:text-5xl font-serif italic text-stone-900">
                  Project Gallery
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allGalleryImages.map((img, index) => {
                  const imageKey = `gallery-${index}`;
                  const isValid = isValidImageUrl(img.image_url);
                  return (
                    <div
                      key={img.id || index}
                      className="relative group overflow-hidden cursor-pointer aspect-square transition-all duration-500"
                      onClick={() => isValid && !imageErrors[imageKey] && setSelectedImageIndex(index)}
                    >
                      {isValid && !imageErrors[imageKey] ? (
                        <>
                          <Image
                            alt={`${project.title} - Gallery image ${index + 1}`}
                            src={img.image_url}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => handleImageError(imageKey)}
                            unoptimized={img.image_url.includes("supabase.co")}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                                <svg
                                  className="w-6 h-6 text-stone-900"
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
                        <div className="w-full h-full flex items-center justify-center bg-stone-200">
                          <span className="material-symbols-outlined text-stone-400 text-4xl">
                            image_not_supported
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )
      }

      {/* Lightbox Modal */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-[100vw] w-full h-screen max-h-screen p-0 gap-0 bg-black/95 border-0"
          showCloseButton={true}
        >
          {selectedImageIndex !== null && allGalleryImages[selectedImageIndex] && (
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
                {isValidImageUrl(allGalleryImages[selectedImageIndex].image_url) ? (
                  <img
                    src={allGalleryImages[selectedImageIndex].image_url}
                    alt={`${project.title} - Gallery image ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
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



      {/* CTA Section - Matching Home page style with Project detail content */}
      <CTASection
        title="Ready to start your project?"
        description="Let's discuss your vision and create something extraordinary together. Our team is ready to bring your dream space to life."
        buttonText="Start Your Project"
      />
    </div >
  );
}
