"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onUploadingChange?: (isUploading: boolean) => void;
  showLabel?: boolean; // Option to show/hide the internal label
}

export default function ImageDropzone({
  value,
  onChange,
  bucket = "blog-images",
  folder = "uploads",
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  onUploadingChange,
  showLabel = true, // Default to true for backward compatibility
}: ImageDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`
        );
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(
          `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
        );
        return;
      }

      setIsUploading(true);
      onUploadingChange?.(true);

      try {
        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        // Clean up preview URL
        URL.revokeObjectURL(previewUrl);

        onChange(publicUrl);
        setPreview(publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again."
        );
        setPreview(value || null);
      } finally {
        setIsUploading(false);
        onUploadingChange?.(false);
      }
    },
    [
      bucket,
      folder,
      maxSize,
      acceptedTypes,
      onChange,
      value,
      supabase,
      onUploadingChange,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update preview when value changes externally
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    } else if (!value && preview) {
      setPreview(null);
    }
  }, [value, preview]);

  return (
    <div className="space-y-2">
      {showLabel && <Label>Featured Image</Label>}
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-80 rounded-lg border overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-gray-100 p-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                {isDragActive ? (
                  <p className="text-sm font-medium text-primary">
                    Drop the image here
                  </p>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports: JPEG, PNG, WebP (max{" "}
                        {Math.round(maxSize / 1024 / 1024)}MB)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {value && <p className="text-xs text-gray-500 truncate">{value}</p>}
    </div>
  );
}
