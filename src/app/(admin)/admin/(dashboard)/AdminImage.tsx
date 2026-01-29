"use client";

import { useState } from "react";
import Image from "@/components/ui/SkeletonImage";
import { FileText, FolderKanban, Briefcase } from "lucide-react";

interface AdminImageProps {
  src: string | null | undefined;
  alt: string;
  type?: "blog" | "project" | "service";
  size?: "sm" | "md";
}

export default function AdminImage({
  src,
  alt,
  type = "blog",
  size = "sm",
}: AdminImageProps) {
  const [hasError, setHasError] = useState(false);

  const iconMap = {
    blog: FileText,
    project: FolderKanban,
    service: Briefcase,
  };

  const Icon = iconMap[type];
  const sizeClasses = size === "sm" ? "w-12 h-12" : "w-16 h-16";

  // Use local placeholder image if src is placeholder.com or invalid
  const imageSrc =
    !src ||
    src.includes("placeholder.com") ||
    src === "https://placeholder.com/image.png"
      ? "/images/default-project-image.png"
      : src;

  // Show icon fallback only if image fails to load and it's not our default placeholder
  if (hasError && imageSrc !== "/images/default-project-image.png") {
    const gradientClasses = {
      blog: "from-blue-100 to-purple-100",
      project: "from-green-100 to-teal-100",
      service: "from-orange-100 to-amber-100",
    };

    const iconColorClasses = {
      blog: "text-blue-600",
      project: "text-green-600",
      service: "text-orange-600",
    };

    return (
      <div
        className={`${sizeClasses} rounded-lg bg-linear-to-br ${gradientClasses[type]} hidden sm:flex items-center justify-center shrink-0`}
      >
        <Icon className={`h-4 w-4 ${iconColorClasses[type]}`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-lg overflow-hidden hidden sm:block shrink-0 relative`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={() => {
          // Only set error if it's not already our default placeholder
          if (imageSrc !== "/images/default-project-image.png") {
            setHasError(true);
          }
        }}
        unoptimized={imageSrc?.includes("supabase.co") ?? false}
      />
    </div>
  );
}
