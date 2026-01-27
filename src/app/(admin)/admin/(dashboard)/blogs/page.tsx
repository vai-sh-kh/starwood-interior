"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  Blog,
  BlogCategory,
  BlogCategoryInsert,
  BlogInsert,
  BlogUpdate,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Loader2,
  ExternalLink,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import TipTapEditor from "@/app/(admin)/components/TipTapEditor";
import ImageDropzone from "@/app/(admin)/components/ImageDropzone";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminImage from "../AdminImage";

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

type SortField = "title" | "created_at" | "category";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 7;

// Zod validation schema
const blogSchema = z.object({
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
  excerpt: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must be less than 500 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Summary cannot be empty or only whitespace",
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
    required_error: "Status is required",
    message: "Status is required",
  }),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogsPage() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
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
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // SEO state
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof BlogFormData, string>>
  >({});

  // Category search state
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Image uploading state
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add category dialog
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const supabase = createClient();

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from("blogs").select("*, blog_categories(*)");

    // Always show only active (non-archived) blogs
    query = query.or("archived.is.null,archived.eq.false");

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    // Apply sorting
    const orderField =
      sortField === "category" ? "blog_categories.name" : sortField;
    query = query.order(orderField, { ascending: sortDirection === "asc" });
    // Add secondary sort by id for deterministic ordering (especially important when sorting by created_at)
    query = query.order("id", { ascending: sortDirection === "asc" });

    const { data, error } = await query;

    if (error) {
      setIsLoading(false);
      return;
    }

    setBlogs(data as BlogWithCategory[]);
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
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, sortField, sortDirection]);

  const generateSlug = (text: string) => {
    if (!text || typeof text !== "string") return "";
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    return slug;
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setImage("");
    setCategoryId("");
    setStatus("draft");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setSelectedBlog(null);
    setIsEditing(false);
    setErrors({});
    setCategorySearchQuery("");
    setIsImageUploading(false);
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  // Check for action=add query parameter and open modal
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      openCreate();
      // Remove query parameter from URL
      router.replace("/admin/blogs");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const openEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt || "");
    setContent(blog.content || "");
    setImage(blog.image || "");
    setCategoryId(blog.category_id || "");
    setStatus((blog.status as "draft" | "published") || "draft");
    // Load SEO fields
    setMetaTitle(blog.meta_title || "");
    setMetaDescription(blog.meta_description || "");
    setMetaKeywords(blog.meta_keywords || "");
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
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
    const validationResult = blogSchema.safeParse({
      title,
      slug: finalSlug,
      excerpt,
      content,
      image,
      categoryId: categoryId || undefined,
      status,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof BlogFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BlogFormData;
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
            excerpt: "excerpt",
            content: "content-editor",
            image: "image-dropzone",
            categoryId: "category-select",
          };

          const selector = fieldMap[fieldName];
          if (selector) {
            element = document.getElementById(selector);

            // For select fields, try to find the select trigger
            if (!element && fieldName === "categoryId") {
              const label = Array.from(document.querySelectorAll("label")).find(
                (l) => l.textContent?.includes("Category")
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

    try {
      if (isEditing && selectedBlog) {
        const updateData: BlogUpdate = {
          title,
          slug: finalSlug,
          excerpt: excerpt || null,
          content: content || null,
          image: image || null,
          category_id: categoryId || null,
          status: status,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          meta_keywords: metaKeywords || null,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("blogs")
          .update(updateData)
          .eq("id", selectedBlog.id);

        if (error) throw error;

        toast.success("Blog updated successfully");
      } else {
        const insertData: BlogInsert = {
          title,
          slug: finalSlug,
          excerpt: excerpt || null,
          content: content || null,
          image: image || null,
          category_id: categoryId || null,
          status: status,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          meta_keywords: metaKeywords || null,
        };

        const { error } = await supabase.from("blogs").insert(insertData);

        if (error) throw error;

        toast.success("Blog created successfully");
      }

      handleClose();
      fetchBlogs();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save blog";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogToDelete.id);

      if (error) throw error;

      toast.success("Blog deleted successfully");
      setIsDeleteOpen(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch {
      // Silent failure
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSavingCategory(true);

    try {
      const categorySlug = generateSlug(categoryName);

      const insertData: BlogCategoryInsert = {
        name: categoryName.trim(),
        slug: categorySlug,
      };

      const { data, error } = await supabase
        .from("blog_categories")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Category added successfully");
      setCategoryName("");
      setIsCategoryDialogOpen(false);
      await fetchCategories();

      // Auto-select the newly created category
      if (data) {
        setCategoryId(data.id);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add category";
      toast.error(errorMessage);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleStatusChange = async (
    blogId: string,
    newStatus: "draft" | "published"
  ) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blogId);

      if (error) throw error;

      toast.success(
        `Blog status changed to ${newStatus === "published" ? "Published" : "Draft"
        }`
      );
      fetchBlogs();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter((blog) => {
      // Apply status filter - drafts only show when filter is "draft", published only when "published"
      if (selectedStatus !== "all") {
        if (selectedStatus === "draft" && blog.status !== "draft") {
          return false;
        }
        if (selectedStatus === "published" && blog.status !== "published") {
          return false;
        }
      }

      // Apply search filter
      return (
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt &&
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.blog_categories?.name &&
          blog.blog_categories.name
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
  }, [blogs, searchQuery, selectedStatus, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

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
    if (!isSaving && !isImageUploading) {
      handleSave();
    }
  };

  const formContent = (
    <form
      id="blog-form"
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
          <Label htmlFor="title" className="text-base">
            Title *
          </Label>
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
            placeholder="Enter blog title"
            className={`h-12 text-base ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="slug" className="text-base">
            Slug *
          </Label>
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
            placeholder="blog-post-slug"
            className={`h-12 text-base ${errors.slug ? "border-red-500" : ""}`}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3" id="category-select">
          <Label htmlFor="category" className="text-base">
            Category
          </Label>
          <div className="flex gap-2">
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
              <SelectTrigger className="flex-1 h-12 text-base">
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
                        // Prevent dropdown from repositioning
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
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsCategoryDialogOpen(true)}
              className="shrink-0"
              title="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="status" className="text-base">
            Status *
          </Label>
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
        <Label className="text-base">Image</Label>
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
          bucket="blog-images"
          folder="uploads"
          showLabel={false}
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

      <div className="space-y-3">
        <Label htmlFor="excerpt" className="text-base">
          Summary
        </Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => {
            setExcerpt(e.target.value);
            // Clear error when user types
            if (errors.excerpt) {
              setErrors((prev) => ({ ...prev, excerpt: undefined }));
            }
          }}
          onKeyDown={(e) => {
            // Allow Shift+Enter for new line, but prevent Enter from submitting
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
            }
          }}
          placeholder="Brief summary of the blog post"
          rows={4}
          className={`min-h-[120px] text-base ${errors.excerpt ? "border-red-500" : ""
            }`}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt}</p>
        )}
      </div>

      <div className="space-y-3" id="content-editor">
        <Label className="text-base">Content</Label>
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
            placeholder="Write your blog content here..."
          />
        </div>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      {/* Note: Blogs don't currently support is_new field in the database schema */}
      {/* <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-200">
        <div className="space-y-0.5">
          <Label className="text-base">Mark as New</Label>
          <p className="text-sm text-gray-600">
            Display a &quot;New&quot; badge on this blog
          </p>
        </div>
        <Switch checked={false} onCheckedChange={() => {}} />
      </div> */}

      {/* SEO Section */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">SEO Settings</h3>
            <p className="text-sm text-gray-500">
              Optimize how this blog appears in search engines
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setMetaTitle(title ? `${title} - Starwood Interiors` : "");
              setMetaDescription(excerpt || "");
            }}
            disabled={!title}
          >
            Generate from Title
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle" className="text-base">
            Meta Title
          </Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="e.g., Interior Design Tips - Starwood Interiors"
            className="h-12 text-base"
          />
          <p className="text-xs text-gray-400">Recommended: 50-60 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="text-base">
            Meta Description
          </Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            placeholder="A brief description of this blog for search engines..."
            rows={3}
            className="min-h-[80px] text-base"
          />
          <p className="text-xs text-gray-400">Recommended: 150-160 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaKeywords" className="text-base">
            Meta Keywords
          </Label>
          <Input
            id="metaKeywords"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            placeholder="e.g., interior design, home decor, renovation tips"
            className="h-12 text-base"
          />
          <p className="text-xs text-gray-400">Comma-separated keywords</p>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog posts and articles
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>New Blog</span>
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
                placeholder="Search by title, slug, excerpt, author, or category..."
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

              {(selectedCategory !== "all" || selectedStatus !== "all") && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="gap-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {filteredBlogs.length}
              </span>
              <span>blogs found</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto overflow-x-auto">
          <Table className="w-full min-w-[1000px] table-fixed">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                <TableHead className="w-[60px] px-4 py-4">No</TableHead>
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
                    onClick={() => handleSort("created_at")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Date
                    {getSortIcon("created_at")}
                  </button>
                </TableHead>
                <TableHead className="w-[120px] px-4 py-4">Status</TableHead>
                <TableHead className="text-right w-[80px] px-4 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableCell className="hidden lg:table-cell w-[120px] px-4 py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="w-[80px] px-4 py-4">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedBlogs.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-[400px] px-4 py-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 text-center">
                        {searchQuery ||
                          selectedCategory !== "all" ||
                          selectedStatus !== "all"
                          ? "No blogs found matching your filters"
                          : "No blogs yet"}
                      </p>
                      {!searchQuery &&
                        selectedCategory === "all" &&
                        selectedStatus === "all" && (
                          <Button
                            variant="link"
                            onClick={openCreate}
                            className="mt-2 hover:no-underline hover:text-current"
                          >
                            Create your first blog
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBlogs.map((blog, index) => (
                  <TableRow key={blog.id} className="hover:bg-transparent">
                    <TableCell className="w-[60px] px-4 py-4 text-gray-600">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="w-[250px] px-4 py-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <AdminImage
                          src={blog.image}
                          alt={blog.title}
                          type="blog"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">
                              {blog.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell w-[200px] px-4 py-4">
                      <div className="truncate">
                        <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded font-mono truncate block">
                          {blog.slug || "—"}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="w-[150px] px-4 py-4">
                      <div className="truncate">
                        {blog.blog_categories ? (
                          <Badge
                            variant="secondary"
                            className="truncate max-w-full"
                          >
                            <span className="truncate">
                              {blog.blog_categories.name}
                            </span>
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[120px] px-4 py-4 text-gray-600 truncate">
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                        : "—"}
                    </TableCell>
                    <TableCell className="w-[120px] px-4 py-4">
                      <Select
                        value={blog.status || "draft"}
                        onValueChange={(value) =>
                          handleStatusChange(
                            blog.id,
                            value as "draft" | "published"
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] h-8 text-xs border-0 ${blog.status === "published"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          <SelectValue>
                            {blog.status === "published" ? (
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
                    <TableCell className="w-[80px] px-4 py-4">
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
                                const blogUrl = `/blogs/${blog.slug || blog.id
                                  }`;
                                window.open(blogUrl, "_blank");
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEdit(blog)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setBlogToDelete(blog);
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
        {!isLoading && filteredBlogs.length > 0 && (
          <div className="border-t p-4 bg-gray-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredBlogs.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredBlogs.length}
                </span>{" "}
                {filteredBlogs.length === 1 ? "blog" : "blogs"}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2 order-1 sm:order-2">
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

                  <div className="flex items-center gap-1 flex-wrap justify-center">
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
            className="w-full sm:max-w-5xl flex flex-col p-0 bg-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                <SheetTitle>
                  {isEditing ? "Edit Blog" : "Create New Blog"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the blog post details below"
                    : "Fill in the details for your new blog post"}
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
                  disabled={isSaving || isImageUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="blog-form"
                  disabled={isSaving || isImageUploading}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Blog" : "Create Blog"}
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
            className="w-full sm:max-w-5xl flex flex-col p-0 bg-white"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                <SheetTitle>
                  {isEditing ? "Edit Blog" : "Create New Blog"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? "Update the blog post details below"
                    : "Fill in the details for your new blog post"}
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
                  disabled={isSaving || isImageUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="blog-form"
                  disabled={isSaving || isImageUploading}
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
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{blogToDelete?.title}&quot;?
              This action cannot be undone.
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

      {/* Add Category Dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new blog category. The slug will be generated
              automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && categoryName.trim()) {
                    handleAddCategory();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCategoryDialogOpen(false);
                setCategoryName("");
              }}
              disabled={isSavingCategory}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={isSavingCategory}>
              {isSavingCategory && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
