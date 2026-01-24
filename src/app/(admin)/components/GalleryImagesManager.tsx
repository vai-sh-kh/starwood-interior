"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_GALLERY_IMAGES } from "@/lib/constants";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  showResetButton?: boolean;
  onReset?: () => void;
  isResetting?: boolean;
  description?: string;
}

// Sortable Image Item Component
function SortableImageItem({
  image,
  index,
  isUploading,
  onRemove,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  isUploading: boolean;
  onRemove: () => void;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id || `image-${index}-${image.image_url}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group bg-white border-2 rounded-lg overflow-hidden",
        isDragging ? "border-primary shadow-lg z-50" : "border-gray-200"
      )}
    >
      {/* Order Badge */}
      <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
        {index + 1}
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        disabled={isUploading}
        className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700"
        title="Remove image"
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 right-2 z-10 bg-black/70 text-white p-1.5 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Image */}
      <div
        className="relative w-full aspect-video bg-gray-50 cursor-pointer"
        onClick={onClick}
      >
        <img
          src={image.image_url}
          alt={`Gallery image ${index + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryImagesManager({
  images,
  onChange,
  bucket = "project-images",
  folder = "uploads",
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  onUploadingChange,
  showResetButton = false,
  onReset,
  isResetting = false,
  description,
}: GalleryImagesManagerProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  const supabase = createClient();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Keep ref in sync with images prop
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Upload a single file
  const uploadSingleFile = useCallback(
    async (file: File): Promise<GalleryImage | null> => {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        return null;
      }

      // Validate file size
      if (file.size > maxSize) {
        return null;
      }

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
          console.error("Upload error:", error);
          return null;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        // Return new image object
        return {
          image_url: publicUrl,
          display_order: 0, // Will be updated after all uploads
        };
      } catch (error) {
        console.error("Upload error:", error);
        return null;
      }
    },
    [bucket, folder, maxSize, acceptedTypes, supabase]
  );

  // Handle multiple files upload in parallel
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      const currentImages = imagesRef.current;
      const remainingSlots = MAX_GALLERY_IMAGES - currentImages.length;

      if (remainingSlots <= 0) {
        toast.error(`Maximum ${MAX_GALLERY_IMAGES} gallery images allowed. Please remove some images before adding new ones.`);
        return;
      }

      // Check if adding these files would exceed the limit
      if (files.length > remainingSlots) {
        toast.error(`You can only add ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}. Maximum ${MAX_GALLERY_IMAGES} gallery images allowed.`);
      }

      const filesToProcess = files.slice(0, remainingSlots);

      if (filesToProcess.length === 0) return;

      // Create file identifiers for tracking
      const fileIdentifiers = filesToProcess.map(
        (file, idx) => `${file.name}-${file.size}-${idx}`
      );

      // Set uploading state for all files
      setUploadingFiles(new Set(fileIdentifiers));
      onUploadingChange?.(true);

      // Upload all files in parallel
      startTransition(async () => {
        try {
          const uploadPromises = filesToProcess.map((file) =>
            uploadSingleFile(file)
          );

          // Wait for all uploads to complete (successful or failed)
          const results = await Promise.allSettled(uploadPromises);

          // Extract only successful uploads
          const successfulUploads: GalleryImage[] = [];
          results.forEach((result) => {
            if (result.status === "fulfilled" && result.value !== null) {
              successfulUploads.push(result.value);
            }
          });

          // Update images with successful uploads
          if (successfulUploads.length > 0) {
            const currentImages = imagesRef.current;
            const newImages = [...currentImages, ...successfulUploads];

            // Update display_order for all images
            const reorderedImages = newImages.map((img, idx) => ({
              ...img,
              display_order: idx,
            }));

            onChange(reorderedImages);
          }
        } catch (error) {
          console.error("Error processing uploads:", error);
        } finally {
          setUploadingFiles(new Set());
          onUploadingChange?.(false);
        }
      });
    },
    [uploadSingleFile, onChange, onUploadingChange]
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
    const sortedImages = [...images].sort(
      (a, b) => a.display_order - b.display_order
    );
    const newImages = sortedImages.filter((_, i) => i !== index);
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

  // Get unique IDs for sortable items
  const getImageId = (image: GalleryImage, index: number) => {
    return image.id || `image-${index}-${image.image_url}`;
  };

  const imageIds = sortedImages.map((img, idx) => getImageId(img, idx));

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageIds.indexOf(active.id as string);
      const newIndex = imageIds.indexOf(over.id as string);

      const reorderedImages = arrayMove(sortedImages, oldIndex, newIndex);
      // Update display_order
      const updatedImages = reorderedImages.map((img, idx) => ({
        ...img,
        display_order: idx,
      }));
      onChange(updatedImages);
    }
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

  const isUploading = uploadingFiles.size > 0 || isPending;
  const canUploadMore = images.length < MAX_GALLERY_IMAGES;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label>Gallery Images</Label>
          {showResetButton && onReset && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={isResetting || isUploading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Reset All Images
            </Button>
          )}
        </div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {/* Images Grid with Drag and Drop */}
      {sortedImages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageIds}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sortedImages.map((image, index) => (
                <SortableImageItem
                  key={getImageId(image, index)}
                  image={image}
                  index={index}
                  isUploading={false} // Individual upload states handled differently
                  onRemove={() => handleRemove(index)}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
        onClick={!canUploadMore || isUploading ? undefined : handleClick}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          !canUploadMore || isUploading
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
          disabled={!canUploadMore || isUploading}
        />
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              <p className="text-sm text-gray-600">
                Uploading {uploadingFiles.size} image
                {uploadingFiles.size !== 1 ? "s" : ""}...
              </p>
            </>
          ) : !canUploadMore ? (
            <>
              <div className="rounded-full bg-gray-200 p-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Maximum {MAX_GALLERY_IMAGES} gallery images reached
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
                      Maximum {MAX_GALLERY_IMAGES} images ({images.length}/
                      {MAX_GALLERY_IMAGES} used)
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
                    disabled={!canUploadMore || isUploading}
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
