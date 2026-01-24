"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";

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
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
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
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
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
        className="w-full flex items-center justify-between px-6 py-4 bg-stone-900 text-white rounded-full group hover:bg-stone-800 transition-all duration-300 shadow-lg shadow-stone-200"
        aria-label="Share this project"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          {isCopied ? "Link Copied!" : "Share Project"}
        </span>
        {isCopied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Share2 className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
      aria-label="Share this project"
    >
      {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      {isCopied ? "Link Copied!" : "Share Project"}
    </button>
  );
}

