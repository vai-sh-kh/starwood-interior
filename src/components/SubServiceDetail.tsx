"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import SubServiceShareButton from "./SubServiceShareButton";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServiceWithGallery } from "@/lib/supabase/types";
import { Subservice } from "@/lib/supabase/types";

interface SubServiceDetailProps {
  subservice: ServiceWithGallery & {
    faq?: Array<{ question: string; answer: string }> | null;
  };
  parentService: ServiceWithGallery;
  relatedSubservices?: Subservice[];
}

const BANNER_IMAGE = "/images/service-detail.png";

export default function SubServiceDetail({
  subservice,
  parentService,
  relatedSubservices = [],
}: SubServiceDetailProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

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

  // Get gallery images
  const galleryImages = subservice.service_gallery_images || [];
  const featuredImage =
    subservice.image || galleryImages[0]?.image_url || BANNER_IMAGE;

  // All images for lightbox: featured image first, then all gallery images
  const allImagesForLightbox = useMemo(() => {
    const images: string[] = [];
    if (featuredImage && isValidImageUrl(featuredImage)) {
      images.push(featuredImage);
    }
    // Include all gallery images, sorted by display_order
    const sortedGalleryImages = [...galleryImages].sort(
      (a, b) => a.display_order - b.display_order
    );
    sortedGalleryImages.forEach((img) => {
      if (isValidImageUrl(img.image_url) && img.image_url !== featuredImage) {
        images.push(img.image_url);
      }
    });
    return images;
  }, [featuredImage, galleryImages]);

  // Gallery images to display in grid (excluding featured if it's already in gallery)
  const displayGalleryImages = useMemo(() => {
    return galleryImages
      .filter((img) => img.image_url !== featuredImage || !subservice.image)
      .sort((a, b) => a.display_order - b.display_order);
  }, [galleryImages, featuredImage, subservice.image]);

  // Add image after "What We Offer" heading if gallery images exist
  useEffect(() => {
    if (!descriptionRef.current || displayGalleryImages.length === 0) return;

    const roots: ReturnType<typeof createRoot>[] = [];

    const h2Elements = descriptionRef.current.querySelectorAll("h2");
    h2Elements.forEach((h2) => {
      if (h2.textContent?.trim() === "What We Offer") {
        // Check if image already exists
        if (h2.nextElementSibling?.classList.contains("what-we-offer-image")) {
          return;
        }

        // Create image container
        const imageContainer = document.createElement("div");
        imageContainer.className =
          "what-we-offer-image my-8 relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl";

        // Create inner wrapper for Image component with fill
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "relative w-full h-full";
        imageContainer.appendChild(imageWrapper);

        // Insert after the h2
        h2.parentNode?.insertBefore(imageContainer, h2.nextSibling);

        // Use first gallery image
        const galleryImageUrl =
          displayGalleryImages[0]?.image_url || subservice.image || "";

        // Render Next.js Image component into the wrapper
        const root = createRoot(imageWrapper);
        roots.push(root);
        root.render(
          <>
            <Image
              src={galleryImageUrl}
              alt={`${subservice.title} - What We Offer`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent"></div>
          </>
        );
      }
    });

    // Cleanup function
    return () => {
      roots.forEach((root) => {
        root.unmount();
      });
    };
  }, [
    subservice.description,
    displayGalleryImages,
    subservice.title,
    subservice.image,
  ]);

  // Handle image error
  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }));
  };

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
      selectedImageIndex < allImagesForLightbox.length - 1
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
      selectedImageIndex < allImagesForLightbox.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else if (e.key === "Escape") {
      setSelectedImageIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-background-light text-gray-800 font-body antialiased">
      {/* Hero Section */}
      <header className="relative pt-24 min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">

          <Image
            src={BANNER_IMAGE}
            alt={subservice.title}
            fill
            className="w-full h-full object-cover object-center scale-105"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30"></div>
        </div>

        <div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-medium text-white mb-6 leading-tight tracking-tight">
            {subservice.title}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto font-serif italic tracking-wide leading-relaxed opacity-95">
            {subservice.description
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 120) ||
              "Premium design solutions tailored to your unique vision, creating spaces that breathe life into your home."}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 bg-background-light -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 pb-0 md:pb-1">
          {/* Back Button */}
          <div className="mb-12">
            <Link
              href={`/services/${parentService.slug}`}
              className="inline-flex items-center group text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wide"
            >
              <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back to {parentService.title}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-20">
              {/* Mobile Image - Show featured image on mobile */}
              {subservice.image &&
                isValidImageUrl(subservice.image) &&
                !imageErrors["mobile"] && (
                  <div className="md:hidden mb-8 relative w-full h-48 rounded-2xl overflow-hidden shadow-xl bg-stone-200">
                    <Image
                      src={subservice.image}
                      alt={subservice.title}
                      fill
                      className="w-full h-full object-cover"
                      sizes="100vw"
                      unoptimized={subservice.image.includes("supabase.co")}
                      onError={() => handleImageError("mobile")}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent"></div>
                  </div>
                )}

              {/* Content */}
              <div className="prose prose-lg max-w-none project-content">
                {(subservice.content || subservice.description) && (
                  <div
                    ref={descriptionRef}
                    className="project-content-html"
                    dangerouslySetInnerHTML={{
                      __html:
                        subservice.content || subservice.description || "",
                    }}
                  />
                )}
              </div>

              {/* FAQ Section */}
              {subservice.faq &&
                Array.isArray(subservice.faq) &&
                subservice.faq.length > 0 && (
                  <section>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-dark mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-0">
                      {subservice.faq.map(
                        (
                          faqItem: { question?: string; answer?: string },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-6 transition-all"
                          >
                            <div
                              className="flex items-center justify-between w-full cursor-pointer group"
                              onClick={() =>
                                setOpenFaqId(openFaqId === index ? null : index)
                              }
                            >
                              <h3
                                className={`text-lg font-bold transition-colors flex-1 pr-4 ${openFaqId === index
                                    ? "text-primary-dark"
                                    : "text-gray-900"
                                  }`}
                              >
                                {faqItem.question || `Question ${index + 1}`}
                              </h3>
                              <span className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors shrink-0">
                                <span
                                  className={`material-symbols-outlined text-xl transition-transform duration-300 ${openFaqId === index ? "rotate-45" : ""
                                    }`}
                                >
                                  add
                                </span>
                              </span>
                            </div>
                            {openFaqId === index && faqItem.answer && (
                              <div className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                                {faqItem.answer}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}
            </div>

            {/* Right Column - Images & CTA */}
            <div className="lg:col-span-5 space-y-6 md:space-y-12">
              {/* Main Image */}
              {subservice.image &&
                isValidImageUrl(subservice.image) &&
                !imageErrors["main"] && (
                  <div
                    className="rounded-3xl overflow-hidden shadow-soft aspect-4/3 group relative cursor-pointer bg-stone-200"
                    onClick={() =>
                      allImagesForLightbox.length > 0 &&
                      setSelectedImageIndex(0)
                    }
                  >
                    <Image
                      src={subservice.image}
                      alt={subservice.title}
                      fill
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      unoptimized={subservice.image.includes("supabase.co")}
                      onError={() => handleImageError("main")}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                )}

              {/* Grid Images */}
              {displayGalleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {displayGalleryImages.map((galleryImg, index) => {
                    // Find index in allImagesForLightbox
                    const lightboxIndex = allImagesForLightbox.findIndex(
                      (url) => url === galleryImg.image_url
                    );
                    const imageKey = galleryImg.id || `gallery-${index}`;
                    return (
                      <div
                        key={imageKey}
                        className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                        onClick={() =>
                          lightboxIndex >= 0 &&
                          setSelectedImageIndex(lightboxIndex)
                        }
                      >
                        {isValidImageUrl(galleryImg.image_url) &&
                          !imageErrors[imageKey] ? (
                          <>
                            <Image
                              src={galleryImg.image_url}
                              alt={`${subservice.title} ${index + 1}`}
                              fill
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                              sizes="(max-width: 1024px) 50vw, 16vw"
                              unoptimized={galleryImg.image_url.includes(
                                "supabase.co"
                              )}
                              onError={() => handleImageError(imageKey)}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                                <svg
                                  className="w-5 h-5"
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
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-sm">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA Card */}
              <div className="sticky top-28 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <h3 className="text-2xl font-display font-bold text-primary mb-3">
                  Ready to transform your space?
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Let&apos;s discuss how we can bring your vision to life. Book
                  a free consultation today.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-4 px-6 bg-primary text-white rounded-xl hover:bg-black transition mb-4 group"
                >
                  <span className="font-medium">Contact Us</span>
                  <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <SubServiceShareButton
                    title={subservice.title}
                    slug={subservice.slug}
                    parentSlug={parentService.slug}
                  />
                  <Link
                    href={`/services/${parentService.slug}`}
                    className="text-sm font-medium text-gray-500 hover:text-primary transition"
                  >
                    Back to {parentService.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          {selectedImageIndex !== null &&
            allImagesForLightbox[selectedImageIndex] && (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={allImagesForLightbox[selectedImageIndex]}
                  alt={`${subservice.title} ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain p-4"
                  sizes="95vw"
                  unoptimized={allImagesForLightbox[
                    selectedImageIndex
                  ].includes("supabase.co")}
                />
                {allImagesForLightbox.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={handlePrevious}
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={handleNext}
                      disabled={
                        selectedImageIndex === allImagesForLightbox.length - 1
                      }
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                      {selectedImageIndex + 1} / {allImagesForLightbox.length}
                    </div>
                  </>
                )}
              </div>
            )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
