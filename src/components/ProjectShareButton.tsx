"use client";

import { useState, useEffect } from "react";

interface ProjectShareButtonProps {
  title: string;
  slug: string;
  variant?: "default" | "button";
}

export default function ProjectShareButton({
  title,
  slug,
  variant = "default",
}: ProjectShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Get the full URL on client side
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/projects/${slug}`);
    }
  }, [slug]);

  const handleShare = async () => {
    if (!shareUrl) return;

    const shareData = {
      title: title,
      text: `Check out ${title} project`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== "AbortError") {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          setIsSharing(true);
          setTimeout(() => setIsSharing(false), 2000);
        } catch (clipboardError) {
          console.error("Failed to copy to clipboard:", clipboardError);
        }
      }
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f6f7f8] dark:bg-gray-800 rounded-lg group hover:bg-primary transition-colors"
        aria-label="Share this project"
      >
        <span className="text-sm font-bold text-[#111618] dark:text-white group-hover:text-white">
          {isSharing ? "Link copied!" : "Share Project"}
        </span>
        <span className="material-symbols-outlined text-sm text-[#111618] dark:text-white group-hover:text-white">
          share
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
      aria-label="Share this project"
    >
      <span className="material-symbols-outlined mr-2 text-lg">share</span>
      {isSharing ? "Link copied!" : "Share this project"}
    </button>
  );
}

