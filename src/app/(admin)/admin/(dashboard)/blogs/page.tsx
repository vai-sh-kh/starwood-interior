"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
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

type BlogWithCategory = Blog & { blog_categories: BlogCategory | null };

type SortField = "title" | "created_at" | "author" | "category";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

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
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  content: z.string().optional(),
  image: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      "Image must be a valid URL"
    )
    .optional(),
  author: z
    .string()
    .max(100, "Author name must be less than 100 characters")
    .optional(),
  categoryId: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().uuid().safeParse(val).success,
      "Invalid category"
    )
    .optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogsPage() {
  const isMobile = useIsMobile();
  const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
  const [author, setAuthor] = useState("");

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
  }, [searchQuery, selectedCategory, sortField, sortDirection]);

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
    setAuthor("");
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

  const openEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt || "");
    setContent(blog.content || "");
    setImage(blog.image || "");
    setCategoryId(blog.category_id || "");
    setAuthor(blog.author || "");
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const sanitizedSlug = generateSlug(slug);
    const finalSlug =
      sanitizedSlug || generateSlug(title) || slug.trim().toLowerCase();
    const result = blogSchema.safeParse({
      title,
      slug: finalSlug,
      excerpt,
      content,
      image,
      author,
      categoryId: categoryId || undefined,
    });
    return result.success;
  }, [title, slug, excerpt, content, image, author, categoryId]);

  const handleSave = async () => {
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
      author,
      categoryId: categoryId || undefined,
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
      }
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && selectedBlog) {
        const updateData: BlogUpdate = {
          title,
          slug: finalSlug,
          excerpt: excerpt || null,
          content: content || null,
          image: image || null,
          category_id: categoryId || null,
          author: author || null,
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
          author: author || null,
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

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt &&
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.author &&
          blog.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.blog_categories?.name &&
          blog.blog_categories.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

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
  }, [blogs, searchQuery, sortField, sortDirection]);

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

  const formContent = (
    <div className="space-y-6 pb-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
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
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
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
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
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
              <SelectTrigger className="flex-1">
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
                      className="pl-8 h-8 text-sm"
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
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              // Clear error when user types
              if (errors.author) {
                setErrors((prev) => ({ ...prev, author: undefined }));
              }
            }}
            placeholder="Author name"
            className={errors.author ? "border-red-500" : ""}
          />
          {errors.author && (
            <p className="text-sm text-red-500">{errors.author}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
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
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
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
          placeholder="Brief summary of the blog post"
          rows={3}
          className={errors.excerpt ? "border-red-500" : ""}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
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
    </div>
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
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                <TableHead className="w-[60px] px-4">No</TableHead>
                <TableHead className="w-[35%] px-4">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Title
                    {getSortIcon("title")}
                  </button>
                </TableHead>
                <TableHead className="px-4">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Category
                    {getSortIcon("category")}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell px-4">
                  <button
                    onClick={() => handleSort("author")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Author
                    {getSortIcon("author")}
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Date
                    {getSortIcon("created_at")}
                  </button>
                </TableHead>
                <TableHead className="text-right w-[80px] px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="px-4">
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell className="px-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="px-4">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="px-4">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedBlogs.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-[400px] px-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 text-center">
                        {searchQuery || selectedCategory !== "all"
                          ? "No blogs found matching your filters"
                          : "No blogs yet"}
                      </p>
                      {!searchQuery && selectedCategory === "all" && (
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
                    <TableCell className="px-4 text-gray-600">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        {blog.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden hidden sm:block shrink-0 relative">
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              onError={() => {}}
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {blog.title}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      {blog.blog_categories ? (
                        <Badge variant="secondary">
                          {blog.blog_categories.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-4 text-gray-600">
                      {blog.author || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4 text-gray-600">
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
                    <TableCell className="px-4">
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
                            <DropdownMenuItem onClick={() => openEdit(blog)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={`/blogs/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </a>
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
        {!isLoading && filteredBlogs.length > 0 && totalPages > 1 && (
          <div className="border-t p-4 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
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
                blogs
              </div>
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
                        (page >= currentPage - 1 && page <= currentPage + 1) ||
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
            </div>
          </div>
        )}
      </div>

      {/* Desktop Modal (Right Side) - Using Sheet for consistent right-side behavior */}
      {!isMobile && (
        <Sheet open={isOpen} onOpenChange={handleClose}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0"
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
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isSaving &&
                    !isImageUploading &&
                    isFormValid
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
                  disabled={isSaving || isImageUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !isFormValid || isImageUploading}
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
            className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0"
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
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isSaving &&
                    !isImageUploading &&
                    isFormValid
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
                  disabled={isSaving || isImageUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !isFormValid || isImageUploading}
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
