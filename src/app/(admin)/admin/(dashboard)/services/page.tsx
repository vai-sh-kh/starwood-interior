"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  Service,
  ServiceInsert,
  ServiceUpdate,
  BlogCategory,
  ServiceWithCategory,
  ServiceGalleryImageInsert,
} from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FolderKanban,
  Eye,
  ExternalLink,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  FileSearch,
} from "lucide-react";
import TipTapEditor from "@/app/(admin)/components/TipTapEditor";
import ImageDropzone from "@/app/(admin)/components/ImageDropzone";
import GalleryImagesManager from "@/app/(admin)/components/GalleryImagesManager";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminImage from "../AdminImage";

type SortField = "title" | "created_at" | "category" | "status";
type SortDirection = "asc" | "desc";

// Extended Service type with SEO fields
type ServiceWithSeo = Service & {
  meta_title?: string | null;
  meta_description?: string | null;
};

const ITEMS_PER_PAGE = 6;

// Zod validation schema
const serviceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Description cannot be empty or only whitespace",
    }),
  content: z
    .string()
    .min(1, "Content is required")
    .refine((val) => val.trim().length > 0, {
      message: "Content cannot be empty or only whitespace",
    }),
  image: z
    .string()
    .min(1, "Featured image is required")
    .refine(
      (val) => z.string().url().safeParse(val).success,
      "Image must be a valid URL"
    ),
  categoryId: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().uuid().safeParse(val).success,
      "Invalid category"
    )
    .optional(),
  status: z.enum(["draft", "published"], {
    message: "Status is required",
  }),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const isMobile = useIsMobile();
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal/Drawer state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isNew, setIsNew] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof ServiceFormData, string>>
  >({});

  // Category search state
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Image uploading state
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<
    Array<{ id?: string; image_url: string; display_order: number }>
  >([]);

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // SEO dialog state
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoProject, setSeoProject] = useState<Service | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isSavingSeo, setIsSavingSeo] = useState(false);

  const supabase = createClient();

  const generateSlug = (text: string) => {
    if (!text || typeof text !== "string") return "";
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    return slug;
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    // Fetch all services - filtering by status will be done client-side
    let query = supabase.from("services").select("*, blog_categories(*)");

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    // Don't filter by status here - we'll do it client-side to ensure proper separation
    // This ensures drafts only show in draft section and published only in published section

    // Apply sorting
    const orderField =
      sortField === "category" ? "blog_categories.name" : sortField;
    query = query.order(orderField, { ascending: sortDirection === "asc" });
    // Add secondary sort by id for deterministic ordering (especially important when sorting by created_at)
    query = query.order("id", { ascending: sortDirection === "asc" });

    const { data, error } = await query;

    if (error) {
      setIsLoading(false);
      toast.error("Failed to fetch services");
      return;
    }

    setServices(data as ServiceWithCategory[]);
    setIsLoading(false);
  }, [supabase, selectedCategory, sortField, sortDirection]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      return;
    }

    setCategories(data);
  }, [supabase]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, sortField, sortDirection]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setImage("");
    setCategoryId("");
    setStatus("draft");
    setTags([]);
    setTagInput("");
    setIsNew(false);
    setSelectedService(null);
    setIsEditing(false);
    setErrors({});
    setCategorySearchQuery("");
    setIsImageUploading(false);
    setIsGalleryUploading(false); // Setter is used by GalleryImagesManager
    setGalleryImages([]);
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = async (service: Service) => {
    setSelectedService(service);
    setTitle(service.title);
    setSlug(service.slug || "");
    setDescription(service.description || "");
    setContent(service.content || "");
    setImage(service.image || "");
    setCategoryId(service.category_id || "");
    setStatus((service.status as "draft" | "published") || "draft");
    setTags(service.tags || []);
    setIsNew(service.is_new || false);
    setIsEditing(true);
    setIsOpen(true);

    // Fetch gallery images for this service
    const { data: galleryData, error } = await supabase
      .from("service_gallery_images")
      .select("*")
      .eq("service_id", service.id)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching gallery images:", error);
      setGalleryImages([]);
    } else {
      setGalleryImages(
        galleryData?.map((img) => ({
          id: img.id,
          image_url: img.image_url,
          display_order: img.display_order,
        })) || []
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };


  const handleSave = async () => {
    // Prevent multiple submissions
    if (isSaving) return;
    
    setIsSaving(true);

    // Sanitize slug before validation
    const sanitizedSlug = generateSlug(slug);
    const finalSlug =
      sanitizedSlug || generateSlug(title) || slug.trim().toLowerCase();

    // Validate form using Zod with sanitized slug
    const validationResult = serviceSchema.safeParse({
      title,
      slug: finalSlug,
      description,
      content,
      image,
      categoryId: categoryId || undefined,
      status,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ServiceFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ServiceFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      const firstError = validationResult.error.issues[0];
      if (firstError) {
        toast.error(firstError.message);

        // Scroll to the first error field
        const fieldName = firstError.path[0] as string;
        setTimeout(() => {
          let element: HTMLElement | null = null;

          // Map field names to element IDs or selectors
          const fieldMap: Record<string, string> = {
            title: "title",
            slug: "slug",
            description: "description",
            content: "content-editor",
            image: "image-dropzone",
            categoryId: "category-select",
            status: "status-select",
          };

          const selector = fieldMap[fieldName];
          if (selector) {
            element = document.getElementById(selector);

            // For select fields, try to find the select trigger
            if (
              !element &&
              (fieldName === "categoryId" || fieldName === "status")
            ) {
              const label = Array.from(document.querySelectorAll("label")).find(
                (l) =>
                  (fieldName === "categoryId" &&
                    l.textContent?.includes("Category")) ||
                  (fieldName === "status" && l.textContent?.includes("Status"))
              );
              if (label) {
                const selectTrigger = label.parentElement?.querySelector(
                  '[role="combobox"]'
                ) as HTMLElement;
                element = selectTrigger || (label.parentElement as HTMLElement);
              }
            }

            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
              // Focus the element if it's focusable
              if (
                element instanceof HTMLInputElement ||
                element instanceof HTMLTextAreaElement
              ) {
                element.focus();
              } else if (element instanceof HTMLElement) {
                // Try to find a focusable child element
                const focusable = element.querySelector(
                  'input, textarea, [role="combobox"]'
                ) as HTMLElement;
                if (focusable) {
                  focusable.focus();
                }
              }
            }
          }
        }, 100);
      }
      setIsSaving(false);
      return;
    }

    // Check if slug already exists
    let slugCheckQuery = supabase
      .from("services")
      .select("id, slug")
      .eq("slug", finalSlug)
      .limit(1);

    // If editing, exclude current service from the check
    if (isEditing && selectedService) {
      slugCheckQuery = slugCheckQuery.neq("id", selectedService.id);
    }

    const { data: existingService, error: slugCheckError } =
      await slugCheckQuery;

    if (slugCheckError) {
      setIsSaving(false);
      toast.error("Failed to check slug availability");
      return;
    }

    if (existingService && existingService.length > 0) {
      setIsSaving(false);
      setErrors({ slug: "Slug already exists" });
      toast.error("Slug already exists");
      return;
    }

    try {
      let serviceId: string;

      if (isEditing && selectedService) {
        serviceId = selectedService.id;

        const updateData: ServiceUpdate = {
          title,
          slug: finalSlug,
          description: description || null,
          content: content || null,
          image: image || null,
          category_id: categoryId || null,
          status,
          tags: tags.length > 0 ? tags : null,
          is_new: isNew,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("services")
          .update(updateData)
          .eq("id", serviceId);

        if (error) throw error;

        toast.success("Service updated successfully");
      } else {
        const insertData: ServiceInsert = {
          title,
          slug: finalSlug,
          description: description || null,
          content: content || null,
          image: image || null,
          category_id: categoryId || null,
          status,
          tags: tags.length > 0 ? tags : null,
          is_new: isNew,
        };

        const { data, error } = await supabase
          .from("services")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("Failed to create service");

        serviceId = data.id;
        toast.success("Service created successfully");
      }

      // Save gallery images
      if (serviceId) {
        // Get existing gallery images IDs
        const existingImageIds = galleryImages
          .map((img) => img.id)
          .filter((id): id is string => !!id);

        // Delete gallery images that are no longer in the list
        if (existingImageIds.length > 0) {
          const { data: existingImages } = await supabase
            .from("service_gallery_images")
            .select("id")
            .eq("service_id", serviceId);

          const existingIds = existingImages?.map((img) => img.id) || [];
          const idsToDelete = existingIds.filter(
            (id) => !existingImageIds.includes(id)
          );

          if (idsToDelete.length > 0) {
            await supabase
              .from("service_gallery_images")
              .delete()
              .in("id", idsToDelete);
          }
        } else {
          // Delete all existing images if no images are present
          await supabase
            .from("service_gallery_images")
            .delete()
            .eq("service_id", serviceId);
        }

        // Insert or update gallery images
        const imagesToInsert: ServiceGalleryImageInsert[] = galleryImages.map(
          (img) => ({
            service_id: serviceId,
            image_url: img.image_url,
            display_order: img.display_order,
          })
        );

        // Delete all existing and re-insert for simplicity
        // (Alternative: could do upsert with more complex logic)
        if (galleryImages.length > 0) {
          await supabase
            .from("service_gallery_images")
            .delete()
            .eq("service_id", serviceId);

          const { error: galleryError } = await supabase
            .from("service_gallery_images")
            .insert(imagesToInsert);

          if (galleryError) throw galleryError;
        }
      }

      handleClose();
      fetchServices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save service";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceToDelete.id);

      if (error) throw error;

      toast.success("Service deleted successfully");
      setIsDeleteOpen(false);
      setServiceToDelete(null);
      fetchServices();
    } catch {
      // Silent failure
    } finally {
      setIsDeleting(false);
    }
  };

  const openSeoDialog = (service: Service) => {
    setSeoProject(service);
    const projectWithSeo = service as ServiceWithSeo;
    setMetaTitle(projectWithSeo.meta_title || "");
    setMetaDescription(projectWithSeo.meta_description || "");
    setIsSeoOpen(true);
  };

  const handleSaveSeo = async () => {
    if (!seoProject) return;

    setIsSavingSeo(true);

    try {
      const { error } = await supabase
        .from("services")
        .update({
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", seoProject.id);

      if (error) throw error;

      toast.success("SEO settings updated successfully");
      setIsSeoOpen(false);
      setSeoProject(null);
      setMetaTitle("");
      setMetaDescription("");
      fetchServices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save SEO settings";
      toast.error(errorMessage);
    } finally {
      setIsSavingSeo(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const handleStatusChange = async (
    serviceId: string,
    newStatus: "draft" | "published"
  ) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", serviceId);

      if (error) throw error;

      toast.success(
        `Service status changed to ${
          newStatus === "published" ? "Published" : "Draft"
        }`
      );
      fetchServices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  // Filter and sort services
  const filteredServices = useMemo(() => {
    const filtered = services.filter((service) => {
      // Apply status filter - drafts only show when filter is "draft", published only when "published"
      if (selectedStatus !== "all") {
        if (selectedStatus === "draft" && service.status !== "draft") {
          return false;
        }
        if (selectedStatus === "published" && service.status !== "published") {
          return false;
        }
      }

      // Apply search filter
      return (
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description &&
          service.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (service.blog_categories?.name &&
          service.blog_categories.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    });

    // Apply client-side sorting if needed (for category sorting)
    if (sortField === "category") {
      filtered.sort((a, b) => {
        const aName = a.blog_categories?.name || "";
        const bName = b.blog_categories?.name || "";
        if (sortDirection === "asc") {
          return aName.localeCompare(bName);
        }
        return bName.localeCompare(aName);
      });
    }

    return filtered;
  }, [services, searchQuery, selectedStatus, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaving && !isImageUploading && !isGalleryUploading) {
      handleSave();
    }
  };

  const formContent = (
    <form
      id="service-form"
      onSubmit={handleFormSubmit}
      className="space-y-8 pb-4"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="title" className="text-base">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEditing) {
                setSlug(generateSlug(e.target.value));
              }
              // Clear error when user types
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="Enter service title"
            className={`h-12 text-base ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="slug" className="text-base">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              const inputValue = e.target.value;
              // When editing, allow manual input and only sanitize on blur or save
              // When creating, auto-sanitize as user types
              if (isEditing) {
                // Preserve user input when editing - validation will catch invalid slugs
                setSlug(inputValue);
              } else {
                // Auto-sanitize when creating
                setSlug(generateSlug(inputValue));
              }
              // Clear error when user types
              if (errors.slug) {
                setErrors((prev) => ({ ...prev, slug: undefined }));
              }
            }}
            onBlur={(e) => {
              // Sanitize slug on blur to ensure it's valid format
              if (e.target.value) {
                const sanitized = generateSlug(e.target.value);
                if (sanitized && sanitized !== e.target.value) {
                  setSlug(sanitized);
                }
              }
            }}
            placeholder="service-slug"
            className={`h-12 text-base ${errors.slug ? "border-red-500" : ""}`}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="category" className="text-base">Category</Label>
          <Select
            value={categoryId || "none"}
            onValueChange={(value) => {
              setCategoryId(value === "none" ? "" : value);
              // Clear error when user selects
              if (errors.categoryId) {
                setErrors((prev) => ({ ...prev, categoryId: undefined }));
              }
              setCategorySearchQuery("");
            }}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent
              className="max-h-[300px]"
              position="popper"
              sideOffset={4}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white border-b p-2 mb-1 -mx-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Search categories..."
                      value={categorySearchQuery}
                      onChange={(e) => {
                        setCategorySearchQuery(e.target.value);
                        e.stopPropagation();
                      }}
                      className="pl-8 h-12 text-base"
                      onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Escape") {
                        setCategorySearchQuery("");
                      }
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    autoFocus={false}
                  />
                </div>
              </div>
              <div className="max-h-[250px] overflow-y-auto">
                <SelectItem value="none">None</SelectItem>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-6 text-center text-sm text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="status" className="text-base">Status *</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "draft" | "published");
              // Clear error when user selects
              if (errors.status) {
                setErrors((prev) => ({ ...prev, status: undefined }));
              }
            }}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="space-y-3" id="image-dropzone">
        <Label className="text-base">Image *</Label>
        <ImageDropzone
          value={image}
          onChange={(value) => {
            setImage(value);
            // Clear error when user changes image
            if (errors.image) {
              setErrors((prev) => ({ ...prev, image: undefined }));
            }
          }}
          onUploadingChange={setIsImageUploading}
          bucket="service-images"
          folder="uploads"
          showLabel={false}
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

      <div className="space-y-3">
        <Label htmlFor="description" className="text-base">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            // Clear error when user types
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          placeholder="Brief description of the service"
          rows={4}
          className={`min-h-[120px] text-base ${errors.description ? "border-red-500" : ""}`}
          onKeyDown={(e) => {
            // Allow Shift+Enter for new line, but prevent Enter from submitting
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
            }
          }}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-3" id="content-editor">
        <Label className="text-base">Content *</Label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={(value) => {
              setContent(value);
              // Clear error when user types
              if (errors.content) {
                setErrors((prev) => ({ ...prev, content: undefined }));
              }
            }}
            placeholder="Write your service content here..."
          />
        </div>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag"
            className="flex-1 h-12 text-base"
          />
          <Button type="button" onClick={handleAddTag} className="bg-black text-white hover:bg-gray-800">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-200">
        <div className="space-y-0.5">
          <Label className="text-base">Mark as New</Label>
          <p className="text-sm text-gray-600">
            Display a &quot;New&quot; badge on this service
          </p>
        </div>
        <Switch checked={isNew} onCheckedChange={setIsNew} />
      </div>

      <div className="space-y-3">
        <GalleryImagesManager
          images={galleryImages}
          onChange={setGalleryImages}
          bucket="service-images"
          folder="uploads"
          onUploadingChange={setIsGalleryUploading}
        />
      </div>
    </form>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Single Block Container */}
      <div className="flex-1 flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="border-b bg-gray-50/50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your portfolio services
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>New Service</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="border-b p-4 bg-white">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 flex-wrap">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {(selectedCategory !== "all" || selectedStatus !== "all") && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {filteredServices.length}
              </span>
              <span>services found</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto overflow-x-auto min-h-0">
          <Table className="w-full min-w-[1000px] table-fixed">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                <TableHead className="w-[60px] px-4 py-4">
                  No
                </TableHead>
                <TableHead className="w-[250px] px-4 py-4">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Title
                    {getSortIcon("title")}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell w-[200px] px-4 py-4">
                  Slug
                </TableHead>
                <TableHead className="w-[150px] px-4 py-4">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Category
                    {getSortIcon("category")}
                  </button>
                </TableHead>
                <TableHead className="w-[120px] px-4 py-4">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[120px] px-4 py-4">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Date
                    {getSortIcon("created_at")}
                  </button>
                </TableHead>
                <TableHead className="text-right w-[80px] px-4 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="w-[60px] px-4 py-4">
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell className="w-[250px] px-4 py-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell w-[200px] px-4 py-4">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="w-[150px] px-4 py-4">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="w-[120px] px-4 py-4">
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell w-[120px] px-4 py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="w-[80px] px-4 py-4">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedServices.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-[400px] px-4 py-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FolderKanban className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 text-center">
                        {searchQuery ||
                        selectedCategory !== "all" ||
                        selectedStatus !== "all"
                          ? "No services found matching your filters"
                          : "No services yet"}
                      </p>
                      {!searchQuery &&
                        selectedCategory === "all" &&
                        selectedStatus === "all" && (
                          <Button
                            variant="link"
                            onClick={openCreate}
                            className="mt-2 hover:no-underline hover:text-current"
                          >
                            Create your first service
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedServices.map((service, index) => (
                  <TableRow key={service.id} className="hover:bg-transparent">
                    <TableCell className="w-[60px] px-4 py-4 text-gray-600">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="w-[250px] px-4 py-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <AdminImage
                          src={service.image}
                          alt={service.title}
                          type="service"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">
                              {service.title}
                            </p>
                            {service.is_new && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell w-[200px] px-4 py-4">
                      <div className="truncate">
                        <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded font-mono truncate block">
                          {service.slug || "—"}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="w-[150px] px-4 py-4">
                      <div className="truncate">
                        {service.blog_categories ? (
                          <Badge
                            variant="secondary"
                            className="truncate max-w-full"
                          >
                            <span className="truncate">
                              {service.blog_categories.name}
                            </span>
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[120px] px-4 py-4">
                      <Select
                        value={service.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            service.id,
                            value as "draft" | "published"
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] h-8 text-xs border-0 ${
                            service.status === "published"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <SelectValue>
                            {service.status === "published" ? (
                              <span className="font-medium">Published</span>
                            ) : (
                              <span className="font-medium">Draft</span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4 py-4 text-gray-600 max-w-[120px] truncate">
                      {service.created_at
                        ? new Date(service.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-transparent hover:text-current"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                const serviceUrl = `/services/${
                                  service.slug || service.id
                                }`;
                                window.open(serviceUrl, "_blank");
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEdit(service)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {service.status === "draft" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openSeoDialog(service)}
                                >
                                  <FileSearch className="mr-2 h-4 w-4" />
                                  SEO Settings
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setServiceToDelete(service);
                                setIsDeleteOpen(true);
                              }}
                              variant="destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {!isLoading && filteredServices.length > 0 && (
          <div className="border-t p-4 bg-gray-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredServices.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredServices.length}
                </span>{" "}
                services
              </div>
              {totalPages > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 &&
                            page <= currentPage + 1) ||
                          totalPages <= 7
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-9 h-9 p-0"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Modal (Right Side) - Using Sheet for consistent right-side behavior */}
      {!isMobile && (
        <Sheet open={isOpen} onOpenChange={handleClose}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-5xl overflow-hidden flex flex-col p-0 bg-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                <SheetTitle>
                  {isEditing ? "Edit Service" : "Create New Service"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the service details below"
                    : "Fill in the details for your new service"}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
                {formContent}
              </div>
              <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="service-form"
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={handleClose}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-5xl overflow-hidden flex flex-col p-0 bg-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                <SheetTitle>
                  {isEditing ? "Edit Service" : "Create New Service"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the service details below"
                    : "Fill in the details for your new service"}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
                {formContent}
              </div>
              <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="service-form"
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{serviceToDelete?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SEO Dialog */}
      <Dialog open={isSeoOpen} onOpenChange={setIsSeoOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>SEO Settings</DialogTitle>
            <DialogDescription>
              Configure SEO metadata for &quot;{seoProject?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter SEO title (recommended: 50-60 characters)"
                maxLength={60}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isSavingSeo) {
                    e.preventDefault();
                    handleSaveSeo();
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                {metaTitle.length}/60 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter SEO description (recommended: 150-160 characters)"
                rows={4}
                maxLength={160}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    // Allow Shift+Enter for new lines
                    return;
                  }
                  if (e.key === "Enter" && !isSavingSeo) {
                    e.preventDefault();
                    handleSaveSeo();
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                {metaDescription.length}/160 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSeoOpen(false);
                setSeoProject(null);
                setMetaTitle("");
                setMetaDescription("");
              }}
              disabled={isSavingSeo}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSeo} disabled={isSavingSeo}>
              {isSavingSeo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save SEO Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

