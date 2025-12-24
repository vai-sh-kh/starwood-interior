"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface BlogImageProps {
  src: string | null;
  alt: string;
}

export default function BlogImage({ src, alt }: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
        <FileText className="h-4 w-4 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
