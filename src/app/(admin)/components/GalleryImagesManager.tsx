"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id?: string;
  image_url: string;
  display_order: number;
}

interface GalleryImagesManagerProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  bucket?: string;
  folder?: string;
  maxSize?: number;
  acceptedTypes?: string[];
  onUploadingChange?: (isUploading: boolean) => void;
}

export default function GalleryImagesManager({
  images,
  onChange,
  bucket = "project-images",
  folder = "uploads",
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  onUploadingChange,
}: GalleryImagesManagerProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  const supabase = createClient();

  // Keep ref in sync with images prop
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleFile = useCallback(
    async (file: File, insertIndex?: number) => {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        return;
      }

      // Check if we've reached the maximum limit of 5 images
      if (images.length >= 5 && insertIndex === undefined) {
        alert(
          "Maximum 5 gallery images allowed. Please remove an image first."
        );
        return;
      }

      const tempIndex = insertIndex ?? images.length;

      try {
        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

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

        // Add to images array
        const newImage: GalleryImage = {
          image_url: publicUrl,
          display_order: tempIndex,
        };

        const newImages = [...images];
        if (insertIndex !== undefined) {
          newImages.splice(insertIndex, 0, newImage);
        } else {
          newImages.push(newImage);
        }

        // Update display_order for all images
        const reorderedImages = newImages.map((img, idx) => ({
          ...img,
          display_order: idx,
        }));

        onChange(reorderedImages);
      } catch (error) {
        console.error("Upload error:", error);
        alert(
          `Failed to upload image: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [bucket, folder, maxSize, acceptedTypes, images, onChange, supabase]
  );

  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      const currentImages = imagesRef.current;
      const remainingSlots = 5 - currentImages.length;
      const filesToProcess = files.slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        alert(
          `You can only add ${remainingSlots} more image(s). Maximum 5 gallery images allowed.`
        );
      }

      if (filesToProcess.length === 0) return;

      // Process files sequentially
      setUploadProgress({ current: 0, total: filesToProcess.length });
      onUploadingChange?.(true);

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const currentImagesLength = imagesRef.current.length;
        const insertIndex = currentImagesLength;
        setUploadingIndex(insertIndex);
        setUploadProgress({ current: i + 1, total: filesToProcess.length });

        await handleFile(file, insertIndex);
      }

      setUploadingIndex(null);
      setUploadProgress(null);
      onUploadingChange?.(false);
    },
    [handleFile, onUploadingChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      handleMultipleFiles(files);
    },
    [handleMultipleFiles]
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
      const files = Array.from(e.target.files || []);
      handleMultipleFiles(files);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleMultipleFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Update display_order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
    }));
    onChange(reorderedImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    // Update display_order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
    }));
    onChange(reorderedImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    // Update display_order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
    }));
    onChange(reorderedImages);
  };

  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Update slider index when images change
  useEffect(() => {
    if (sortedImages.length > 0 && currentSliderIndex >= sortedImages.length) {
      setCurrentSliderIndex(Math.max(0, sortedImages.length - 1));
    }
  }, [sortedImages.length, currentSliderIndex]);

  const handleSliderPrevious = () => {
    setCurrentSliderIndex((prev) =>
      prev > 0 ? prev - 1 : sortedImages.length - 1
    );
  };

  const handleSliderNext = () => {
    setCurrentSliderIndex((prev) =>
      prev < sortedImages.length - 1 ? prev + 1 : 0
    );
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < sortedImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      setSelectedImageIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Gallery Images</Label>

      {/* Images Slider */}
      {sortedImages.length > 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full">
          <div className="relative w-full">
            {/* Current Image */}
            {sortedImages[currentSliderIndex] && (
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => handleImageClick(currentSliderIndex)}
              >
                <img
                  src={sortedImages[currentSliderIndex].image_url}
                  alt={`Gallery image ${currentSliderIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {uploadingIndex === currentSliderIndex && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={handleSliderPrevious}
                  disabled={uploadingIndex !== null}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md"
                  title="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={handleSliderNext}
                  disabled={uploadingIndex !== null}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md"
                  title="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Image Counter and Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {currentSliderIndex + 1} / {sortedImages.length}
                </span>
                <span className="text-xs text-gray-500">
                  Order: {sortedImages[currentSliderIndex]?.display_order + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleMoveUp(currentSliderIndex)}
                  disabled={currentSliderIndex === 0 || uploadingIndex !== null}
                  className="h-8 w-8"
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(currentSliderIndex)}
                  disabled={uploadingIndex !== null}
                  className="h-8 w-8"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleMoveDown(currentSliderIndex)}
                  disabled={
                    currentSliderIndex === sortedImages.length - 1 ||
                    uploadingIndex !== null
                  }
                  className="h-8 w-8"
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Width Image Slider Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-[100vw] w-full h-screen max-h-screen p-0 gap-0 bg-black/95 border-0"
          showCloseButton={true}
        >
          {selectedImageIndex !== null && sortedImages[selectedImageIndex] && (
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
                  className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {/* Image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={sortedImages[selectedImageIndex].image_url}
                  alt={`Gallery image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Next Button */}
              {selectedImageIndex < sortedImages.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {sortedImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={
          images.length >= 5 ||
          uploadingIndex !== null ||
          uploadProgress !== null
            ? undefined
            : handleClick
        }
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          images.length >= 5 ||
            uploadingIndex !== null ||
            uploadProgress !== null
            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : isDragActive
            ? "border-primary bg-primary/5 cursor-pointer"
            : "border-gray-300 hover:border-gray-400 cursor-pointer"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
          multiple
          disabled={
            uploadingIndex !== null ||
            images.length >= 5 ||
            uploadProgress !== null
          }
        />
        <div className="flex flex-col items-center gap-4">
          {uploadingIndex !== null || uploadProgress ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploadProgress
                  ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`
                  : "Uploading..."}
              </p>
            </>
          ) : images.length >= 5 ? (
            <>
              <div className="rounded-full bg-gray-200 p-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Maximum 5 gallery images reached
                </p>
                <p className="text-xs text-gray-400">
                  Remove an image to add a new one
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-gray-100 p-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              {isDragActive ? (
                <p className="text-sm font-medium text-primary">
                  Drop the images here
                </p>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Drag & drop images here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPEG, PNG, WebP (max{" "}
                      {Math.round(maxSize / 1024 / 1024)}MB per image)
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum 5 images ({images.length}/5 used)
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      You can select multiple images at once
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={images.length >= 5 || uploadingIndex !== null}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
