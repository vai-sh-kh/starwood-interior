"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export default function SkeletonImage({
    className,
    onLoad,
    alt,
    ...props
}: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Image
            className={cn(
                className,
                isLoading ? "bg-gray-200 animate-pulse" : ""
            )}
            onLoad={(e) => {
                setIsLoading(false);
                if (onLoad) onLoad(e);
            }}
            alt={alt}
            {...props}
        />
    );
}
