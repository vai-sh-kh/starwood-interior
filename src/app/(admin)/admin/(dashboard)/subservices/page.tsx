"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  Subservice,
  SubserviceInsert,
  SubserviceUpdate,
  Service,
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
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
} from "lucide-react";
import TipTapEditor from "@/app/(admin)/components/TipTapEditor";
import ImageDropzone from "@/app/(admin)/components/ImageDropzone";
import GalleryImagesManager from "@/app/(admin)/components/GalleryImagesManager";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminImage from "../AdminImage";

type SortField = "title" | "created_at" | "status";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 6;

// Zod validation schema
const subserviceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  content: z.string().optional(),
  image: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      "Image must be a valid URL"
    )
    .optional(),
  status: z.enum(["draft", "published"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either 'draft' or 'published'",
  }),
  parentServiceId: z
    .string()
    .min(1, "Parent service is required")
    .uuid("Invalid parent service"),
  isNew: z.boolean().optional(),
  galleryImages: z
    .array(
      z.object({
        id: z.string().optional(),
        image_url: z.string().min(1, "Image URL is required"),
        display_order: z.number().int().min(0),
      })
    )
    .optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
});

type SubserviceFormData = z.infer<typeof subserviceSchema>;

export default function SubservicesPage() {
  const isMobile = useIsMobile();
  const [subservices, setSubservices] = useState<Subservice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal/Drawer state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubservice, setSelectedSubservice] = useState<Subservice | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [parentServiceId, setParentServiceId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);

  // Service search state
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  // Service search state for table rows (per subservice)
  const [tableServiceSearchQueries, setTableServiceSearchQueries] = useState<
    Record<string, string>
  >({});
  // Loading state for parent service updates
  const [updatingParentService, setUpdatingParentService] = useState<
    Record<string, boolean>
  >({});

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof SubserviceFormData, string>>
  >({});

  // Image uploading state
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<
    Array<{ id?: string; image_url: string; display_order: number }>
  >([]);

  // FAQ state
  const [faq, setFaq] = useState<
    Array<{ question: string; answer: string }>
  >([]);

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [subserviceToDelete, setSubserviceToDelete] = useState<Subservice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchSubservices = useCallback(async () => {
    setIsLoading(true);
    const query = supabase.from("subservices").select("*");

    // Apply sorting
    query.order(sortField, { ascending: sortDirection === "asc" });
    query.order("id", { ascending: sortDirection === "asc" });

    const { data, error } = await query;

    if (error) {
      setIsLoading(false);
      toast.error("Failed to fetch subservices");
      return;
    }

    // Fetch parent services for all subservices
    const parentServiceIds = [
      ...new Set(
        (data || [])
          .map((s) => s.parent_service_id)
          .filter((id): id is string => id !== null)
      ),
    ];

    let parentServicesMap: Record<string, Service> = {};
    if (parentServiceIds.length > 0) {
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .in("id", parentServiceIds);

      if (servicesData) {
        parentServicesMap = servicesData.reduce(
          (acc, service) => {
            acc[service.id] = service;
            return acc;
          },
          {} as Record<string, Service>
        );
      }
    }

    // Attach parent services to subservices
    const subservicesWithParents = (data || []).map((subservice) => ({
      ...subservice,
      parentService: parentServicesMap[subservice.parent_service_id] || null,
    }));

    setSubservices(subservicesWithParents as any);
    setIsLoading(false);
  }, [supabase, sortField, sortDirection]);

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("title");

    if (error) {
      return;
    }

    setServices(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchSubservices();
    fetchServices();
  }, [fetchSubservices, fetchServices]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, sortField, sortDirection]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setImage("");
    setStatus("draft");
    setParentServiceId("");
    setIsNew(false);
    setSelectedSubservice(null);
    setIsEditing(false);
    setErrors({});
    setServiceSearchQuery("");
    setIsImageUploading(false);
    setIsGalleryUploading(false);
    setGalleryImages([]);
    setFaq([]);
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = async (subservice: Subservice) => {
    try {
      setSelectedSubservice(subservice);
      setTitle(subservice.title || "");
      setSlug(subservice.slug || "");
      setDescription(subservice.description || "");
      setContent(subservice.content || "");
      setImage(subservice.image || "");
      setStatus((subservice.status as "draft" | "published") || "draft");
      setParentServiceId(subservice.parent_service_id || "");
      setIsNew(subservice.is_new || false);
      setIsEditing(true);
      setErrors({});
      setIsOpen(true);

      // Fetch gallery images for this subservice
      const { data: galleryData, error } = await supabase
        .from("subservice_gallery_images")
        .select("*")
        .eq("subservice_id", subservice.id)
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

      // Load FAQ data
      if (subservice.faq && Array.isArray(subservice.faq)) {
        setFaq(subservice.faq as Array<{ question: string; answer: string }>);
      } else {
        setFaq([]);
      }
    } catch (error) {
      console.error("Error opening edit form:", error);
      toast.error("Failed to load subservice data");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  // Filter services for parent service dropdown
  const filteredServices = useMemo(() => {
    if (!serviceSearchQuery.trim()) {
      return services;
    }
    const query = serviceSearchQuery.toLowerCase();
    return services.filter(
      (service) =>
        service.title.toLowerCase().includes(query) ||
        (service.description &&
          service.description.toLowerCase().includes(query))
    );
  }, [services, serviceSearchQuery]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const sanitizedSlug = generateSlug(slug);
    const finalSlug =
      sanitizedSlug || generateSlug(title) || slug.trim().toLowerCase();
    const result = subserviceSchema.safeParse({
      title: title.trim(),
      slug: finalSlug.trim(),
      description: description.trim() || undefined,
      content: content.trim() || undefined,
      image: image.trim() || undefined,
      status,
      parentServiceId: parentServiceId.trim(),
      isNew,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      faq: faq.length > 0 ? faq : undefined,
    });
    return result.success;
  }, [title, slug, description, content, image, status, parentServiceId, isNew, galleryImages, faq]);

  const handleSave = async () => {
    // Sanitize slug before validation
    const sanitizedSlug = generateSlug(slug);
    const finalSlug =
      sanitizedSlug || generateSlug(title) || slug.trim().toLowerCase();

    // Prepare data for validation - trim strings and handle empty values
    const formData = {
      title: title.trim(),
      slug: finalSlug.trim(),
      description: description.trim() || undefined,
      content: content.trim() || undefined,
      image: image.trim() || undefined,
      status,
      parentServiceId: parentServiceId.trim(),
      isNew,
      galleryImages: galleryImages.length > 0 
        ? galleryImages.map((img) => ({
            id: img.id,
            image_url: img.image_url.trim(),
            display_order: img.display_order,
          }))
        : undefined,
      faq: faq.length > 0 ? faq : undefined,
    };

    // Validate form using Zod with sanitized slug
    const validationResult = subserviceSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof SubserviceFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SubserviceFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);

      // Show first error in toast
      const firstError = validationResult.error.issues[0];
      if (firstError) {
        const fieldName = firstError.path[0] as string;
        toast.error(`${fieldName}: ${firstError.message}`);
      }
      return;
    }

    // Check if slug already exists
    let slugCheckQuery = supabase
      .from("subservices")
      .select("id, slug")
      .eq("slug", finalSlug)
      .limit(1);

    // If editing, exclude current subservice from the check
    if (isEditing && selectedSubservice) {
      slugCheckQuery = slugCheckQuery.neq("id", selectedSubservice.id);
    }

    const { data: existingSubservice, error: slugCheckError } =
      await slugCheckQuery;

    if (slugCheckError) {
      toast.error("Failed to check slug availability");
      console.error("Slug check error:", slugCheckError);
      return;
    }

    if (existingSubservice && existingSubservice.length > 0) {
      setErrors({ slug: "Slug already exists" });
      toast.error("Slug already exists. Please choose a different slug.");
      return;
    }

    setIsSaving(true);

    try {
      // Use validated data from schema
      const validatedData = validationResult.data;
      let subserviceId: string;

      if (isEditing && selectedSubservice) {
        subserviceId = selectedSubservice.id;

        const updateData: SubserviceUpdate = {
          title: validatedData.title,
          slug: validatedData.slug,
          description: validatedData.description || null,
          content: validatedData.content || null,
          image: validatedData.image || null,
          status: validatedData.status,
          parent_service_id: validatedData.parentServiceId,
          is_new: validatedData.isNew || false,
          faq: validatedData.faq && validatedData.faq.length > 0 ? validatedData.faq : null,
          updated_at: new Date().toISOString(),
        };

        const { data: updatedData, error } = await supabase
          .from("subservices")
          .update(updateData)
          .eq("id", subserviceId)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        if (!updatedData) {
          throw new Error("Update succeeded but no data returned");
        }

        toast.success("Subservice updated successfully");
      } else {
        const insertData: SubserviceInsert = {
          title: validatedData.title,
          slug: validatedData.slug,
          description: validatedData.description || null,
          content: validatedData.content || null,
          image: validatedData.image || null,
          status: validatedData.status,
          parent_service_id: validatedData.parentServiceId,
          is_new: validatedData.isNew || false,
          faq: validatedData.faq && validatedData.faq.length > 0 ? validatedData.faq : null,
        };

        const { data, error } = await supabase
          .from("subservices")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("Failed to create subservice");

        subserviceId = data.id;
        toast.success("Subservice created successfully");
      }

      // Save gallery images (optional)
      if (subserviceId) {
        // Delete all existing gallery images first
        await supabase
          .from("subservice_gallery_images")
          .delete()
          .eq("subservice_id", subserviceId);

        // Insert new gallery images if any
        if (validatedData.galleryImages && validatedData.galleryImages.length > 0) {
          const imagesToInsert = validatedData.galleryImages.map((img) => ({
            subservice_id: subserviceId,
            image_url: img.image_url,
            display_order: img.display_order,
          }));

          const { error: galleryError } = await supabase
            .from("subservice_gallery_images")
            .insert(imagesToInsert);

          if (galleryError) throw galleryError;
        }
      }

      handleClose();
      fetchSubservices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save subservice";
      toast.error(errorMessage);
      console.error("Error saving subservice:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!subserviceToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("subservices")
        .delete()
        .eq("id", subserviceToDelete.id);

      if (error) throw error;

      toast.success("Subservice deleted successfully");
      setIsDeleteOpen(false);
      setSubserviceToDelete(null);
      fetchSubservices();
    } catch {
      toast.error("Failed to delete subservice");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleClearFilters = () => {
    setSelectedStatus("all");
  };

  const handleStatusChange = async (
    subserviceId: string,
    newStatus: "draft" | "published"
  ) => {
    try {
      const { error } = await supabase
        .from("subservices")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subserviceId);

      if (error) throw error;

      toast.success(
        `Subservice status changed to ${
          newStatus === "published" ? "Published" : "Draft"
        }`
      );
      fetchSubservices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleParentServiceChange = async (
    subserviceId: string,
    newParentServiceId: string
  ) => {
    if (!newParentServiceId) {
      toast.error("Parent service is required");
      return;
    }

    // Clear search query for this row
    setTableServiceSearchQueries((prev) => ({
      ...prev,
      [subserviceId]: "",
    }));

    setUpdatingParentService((prev) => ({ ...prev, [subserviceId]: true }));

    try {
      const { error } = await supabase
        .from("subservices")
        .update({
          parent_service_id: newParentServiceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subserviceId);

      if (error) throw error;

      toast.success("Parent service updated successfully");
      fetchSubservices();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update parent service";
      toast.error(errorMessage);
    } finally {
      setUpdatingParentService((prev) => ({ ...prev, [subserviceId]: false }));
    }
  };

  // Filter services for table row dropdowns
  const getFilteredServicesForRow = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        return services;
      }
      const query = searchQuery.toLowerCase();
      return services.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          (service.description &&
            service.description.toLowerCase().includes(query))
      );
    },
    [services]
  );

  // Filter and sort subservices
  const filteredSubservices = useMemo(() => {
    const filtered = subservices.filter((subservice) => {
      // Apply status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "draft" && subservice.status !== "draft") {
          return false;
        }
        if (selectedStatus === "published" && subservice.status !== "published") {
          return false;
        }
      }

      // Apply search filter
      return (
        subservice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subservice.description &&
          subservice.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    });

    // Apply client-side sorting if needed
    if (sortField === "title") {
      filtered.sort((a, b) => {
        if (sortDirection === "asc") {
          return a.title.localeCompare(b.title);
        }
        return b.title.localeCompare(a.title);
      });
    }

    return filtered;
  }, [subservices, searchQuery, selectedStatus, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubservices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubservices = filteredSubservices.slice(startIndex, endIndex);

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

  const formContent = (
    <div className="space-y-6 pb-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEditing) {
                setSlug(generateSlug(e.target.value));
              }
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="Enter subservice title"
            className={`h-12 text-base ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-base">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (isEditing) {
                setSlug(inputValue);
              } else {
                setSlug(generateSlug(inputValue));
              }
              if (errors.slug) {
                setErrors((prev) => ({ ...prev, slug: undefined }));
              }
            }}
            onBlur={(e) => {
              if (e.target.value) {
                const sanitized = generateSlug(e.target.value);
                if (sanitized && sanitized !== e.target.value) {
                  setSlug(sanitized);
                }
              }
            }}
            placeholder="subservice-slug"
            className={`h-12 text-base ${errors.slug ? "border-red-500" : ""}`}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="parentService" className="text-base">Parent Service *</Label>
          <Select
            value={parentServiceId || ""}
            onValueChange={(value) => {
              setParentServiceId(value);
              if (errors.parentServiceId) {
                setErrors((prev) => ({ ...prev, parentServiceId: undefined }));
              }
              setServiceSearchQuery("");
            }}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select parent service *" />
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
                    placeholder="Search services..."
                    value={serviceSearchQuery}
                    onChange={(e) => {
                      setServiceSearchQuery(e.target.value);
                      e.stopPropagation();
                    }}
                    className="pl-8 h-12 text-base"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Escape") {
                        setServiceSearchQuery("");
                      }
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    autoFocus={false}
                  />
                </div>
              </div>
              <div className="max-h-[250px] overflow-y-auto">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-6 text-center text-sm text-gray-500">
                    No services found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          {errors.parentServiceId && (
            <p className="text-sm text-red-500">{errors.parentServiceId}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="status" className="text-base">Status *</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "draft" | "published");
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

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          placeholder="Enter subservice description"
          rows={4}
          className={`min-h-[120px] text-base ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base">Image</Label>
        <ImageDropzone
          value={image}
          onChange={(value) => {
            setImage(value);
            if (errors.image) {
              setErrors((prev) => ({ ...prev, image: undefined }));
            }
          }}
          onUploadingChange={setIsImageUploading}
          bucket="service-images"
          folder="uploads"
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-base">Content</Label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={(value) => {
              setContent(value);
              if (errors.content) {
                setErrors((prev) => ({ ...prev, content: undefined }));
              }
            }}
            placeholder="Enter subservice content..."
          />
        </div>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-200">
        <div className="space-y-0.5">
          <Label className="text-base">Mark as New</Label>
          <p className="text-sm text-gray-600">
            Display a &quot;New&quot; badge on this subservice
          </p>
        </div>
        <Switch checked={isNew} onCheckedChange={setIsNew} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Gallery Images (Optional)</Label>
        <GalleryImagesManager
          images={galleryImages}
          onChange={(newImages) => {
            setGalleryImages(newImages);
            if (errors.galleryImages) {
              setErrors((prev) => ({ ...prev, galleryImages: undefined }));
            }
          }}
          bucket="service-images"
          folder="uploads"
          onUploadingChange={setIsGalleryUploading}
        />
        {errors.galleryImages && (
          <p className="text-sm text-red-500">{errors.galleryImages}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base">FAQ (Optional)</Label>
        <div className="space-y-6 border border-gray-200 rounded-lg p-4">
          {faq.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  FAQ #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFaq(faq.filter((_, i) => i !== index));
                  }}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => {
                    const newFaq = [...faq];
                    newFaq[index] = { ...newFaq[index], question: e.target.value };
                    setFaq(newFaq);
                  }}
                  className="h-10"
                />
                <Textarea
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const newFaq = [...faq];
                    newFaq[index] = { ...newFaq[index], answer: e.target.value };
                    setFaq(newFaq);
                  }}
                  rows={3}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFaq([...faq, { question: "", answer: "" }]);
            }}
            className="w-full bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ Item
          </Button>
          {faq.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No FAQ items added. Click &quot;Add FAQ Item&quot; to add one.
            </p>
          )}
        </div>
        {errors.faq && (
          <p className="text-sm text-red-500">{errors.faq}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Single Block Container */}
      <div className="flex-1 flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="border-b bg-gray-50/50 p-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subservices</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your subservices
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>New Subservice</span>
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
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 flex-wrap">
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
              {selectedStatus !== "all" && (
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
                {filteredSubservices.length}
              </span>
              <span>subservices found</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto overflow-x-hidden min-h-0">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-white z-10 border-b">
              <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                <TableHead className="w-[60px] max-w-[60px] px-4 py-4">
                  No
                </TableHead>
                <TableHead className="max-w-[300px] px-4 py-4">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Title
                    {getSortIcon("title")}
                  </button>
                </TableHead>
                <TableHead className="max-w-[120px] px-4 py-4">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell max-w-[200px] px-4 py-4">
                  Parent Service
                </TableHead>
                <TableHead className="hidden lg:table-cell max-w-[120px] px-4 py-4">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Date
                    {getSortIcon("created_at")}
                  </button>
                </TableHead>
                <TableHead className="text-right w-[80px] max-w-[80px] px-4 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="px-4 py-4">
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-4 py-4">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4 py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedSubservices.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-[400px] px-4 py-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FolderKanban className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 text-center">
                        {searchQuery || selectedStatus !== "all"
                          ? "No subservices found matching your filters"
                          : "No subservices yet"}
                      </p>
                      {!searchQuery && selectedStatus === "all" && (
                        <Button
                          variant="link"
                          onClick={openCreate}
                          className="mt-2 hover:no-underline hover:text-current"
                        >
                          Create your first subservice
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSubservices.map((subservice, index) => (
                  <TableRow key={subservice.id} className="hover:bg-transparent">
                    <TableCell className="px-4 py-4 text-gray-600">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-4 max-w-[300px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <AdminImage
                          src={subservice.image}
                          alt={subservice.title}
                          type="service"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {subservice.title}
                            </p>
                            {subservice.is_new && (
                              <Badge variant="default" className="shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                          {subservice.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {subservice.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 max-w-[120px]">
                      <Select
                        value={subservice.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            subservice.id,
                            value as "draft" | "published"
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] h-8 text-xs border-0 ${
                            subservice.status === "published"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <SelectValue>
                            {subservice.status === "published" ? (
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
                    <TableCell className="hidden md:table-cell px-4 py-4 max-w-[200px]">
                      <Select
                        value={subservice.parent_service_id || ""}
                        onValueChange={(value) =>
                          handleParentServiceChange(subservice.id, value)
                        }
                        onOpenChange={(open) => {
                          if (!open) {
                            // Clear search query when dropdown closes
                            setTableServiceSearchQueries((prev) => ({
                              ...prev,
                              [subservice.id]: "",
                            }));
                          }
                        }}
                        disabled={updatingParentService[subservice.id]}
                      >
                        <SelectTrigger
                          className={`w-full h-8 text-xs ${
                            updatingParentService[subservice.id]
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          <SelectValue>
                            {updatingParentService[subservice.id] ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Updating...
                              </span>
                            ) : (subservice as any).parentService ? (
                              <span className="truncate block">
                                {(subservice as any).parentService.title}
                              </span>
                            ) : subservice.parent_service_id ? (
                              <span className="text-gray-500 italic text-sm">
                                Not found
                              </span>
                            ) : (
                              <span className="text-gray-400">Select...</span>
                            )}
                          </SelectValue>
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
                                placeholder="Search services..."
                                value={
                                  tableServiceSearchQueries[subservice.id] || ""
                                }
                                onChange={(e) => {
                                  setTableServiceSearchQueries((prev) => ({
                                    ...prev,
                                    [subservice.id]: e.target.value,
                                  }));
                                  e.stopPropagation();
                                }}
                                className="pl-8 h-10 text-sm"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                  if (e.key === "Escape") {
                                    setTableServiceSearchQueries((prev) => ({
                                      ...prev,
                                      [subservice.id]: "",
                                    }));
                                  }
                                }}
                                onFocus={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                autoFocus={false}
                              />
                            </div>
                          </div>
                          <div className="max-h-[250px] overflow-y-auto">
                            {getFilteredServicesForRow(
                              tableServiceSearchQueries[subservice.id] || ""
                            ).length > 0 ? (
                              getFilteredServicesForRow(
                                tableServiceSearchQueries[subservice.id] || ""
                              ).map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.title}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-6 text-center text-sm text-gray-500">
                                No services found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4 py-4 text-gray-600 max-w-[120px] truncate">
                      {subservice.created_at
                        ? new Date(subservice.created_at).toLocaleDateString(
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
                            <DropdownMenuItem onClick={() => openEdit(subservice)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSubserviceToDelete(subservice);
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
        {!isLoading && filteredSubservices.length > 0 && (
          <div className="border-t p-4 bg-gray-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredSubservices.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredSubservices.length}
                </span>{" "}
                subservices
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

      {/* Desktop Modal (Right Side) */}
      {!isMobile && (
        <Sheet open={isOpen} onOpenChange={handleClose}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-5xl overflow-hidden flex flex-col p-0 bg-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                <SheetTitle>
                  {isEditing ? "Edit Subservice" : "Create New Subservice"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the subservice details below"
                    : "Fill in the details for your new subservice"}
                </SheetDescription>
              </SheetHeader>
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isSaving &&
                    !isImageUploading &&
                    !isGalleryUploading
                  ) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              >
                {formContent}
              </div>
              <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Subservice" : "Create Subservice"}
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
                  {isEditing ? "Edit Subservice" : "Create New Subservice"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the subservice details below"
                    : "Fill in the details for your new subservice"}
                </SheetDescription>
              </SheetHeader>
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isSaving &&
                    !isImageUploading &&
                    !isGalleryUploading
                  ) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              >
                {formContent}
              </div>
              <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving || isImageUploading || isGalleryUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
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
            <AlertDialogTitle>Delete Subservice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{subserviceToDelete?.title}
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

    </div>
  );
}

