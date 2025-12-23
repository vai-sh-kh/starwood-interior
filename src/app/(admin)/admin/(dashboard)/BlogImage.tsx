"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

interface BlogImageProps {
  src: string | null;
  alt: string;
}

export default function BlogImage({ src, alt }: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
        <FileText className="h-5 w-5 text-blue-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 rounded-lg object-cover shrink-0"
      onError={() => setHasError(true)}
    />
  );
}
