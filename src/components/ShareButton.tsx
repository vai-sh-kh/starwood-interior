"use client";

import { useState, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Get the full URL on client side
    setShareUrl(`${window.location.origin}/services/${slug}`);
  }, [slug]);

  const handleShare = async () => {
    if (!shareUrl) return;

    const shareData = {
      title: title,
      text: `Check out ${title} service`,
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

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
      aria-label="Share this service"
    >
      <span className="material-symbols-outlined mr-2 text-lg">share</span>
      {isSharing ? "Link copied!" : "Share this service"}
    </button>
  );
}

