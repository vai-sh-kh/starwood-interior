"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  BlogCategory,
  BlogCategoryInsert,
  BlogCategoryUpdate,
} from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Tags,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type SortField = "name" | "slug" | "created_at";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

// Zod validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal/Drawer state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<BlogCategory | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from("blog_categories").select("*");

    // Apply sorting
    query = query.order(sortField, { ascending: sortDirection === "asc" });

    const { data, error } = await query;

    if (error) {
      setIsLoading(false);
      return;
    }

    setCategories(data || []);
    setIsLoading(false);
  }, [supabase, sortField, sortDirection]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

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
    setName("");
    setSlug("");
    setSelectedCategory(null);
    setIsEditing(false);
    setErrors({});
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (category: BlogCategory) => {
    setSelectedCategory(category);
    setName(category.name);
    setSlug(category.slug);
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
    // Sanitize slug before validation
    const sanitizedSlug = generateSlug(slug);

    // If slug is empty after sanitization, try generating from name
    const finalSlug =
      sanitizedSlug || generateSlug(name) || slug.trim().toLowerCase();

    // Validate form using Zod
    const validationResult = categorySchema.safeParse({
      name,
      slug: finalSlug,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof CategoryFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CategoryFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      // Show first error in toast
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    setIsSaving(true);

    try {
      if (isEditing && selectedCategory) {
        const updateData: BlogCategoryUpdate = {
          name,
          slug: finalSlug,
        };

        const { error } = await supabase
          .from("blog_categories")
          .update(updateData)
          .eq("id", selectedCategory.id);

        if (error) throw error;

        toast.success("Category updated successfully");
      } else {
        const insertData: BlogCategoryInsert = {
          name,
          slug: finalSlug,
        };

        const { error } = await supabase
          .from("blog_categories")
          .insert(insertData);

        if (error) throw error;

        toast.success("Category created successfully");
      }

      handleClose();
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save category";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("blog_categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (error) throw error;

      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered;
  }, [categories, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-6"
      onKeyDown={handleKeyDown}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Clear error when user starts typing
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
            if (!isEditing) {
              setSlug(generateSlug(e.target.value));
            }
          }}
          placeholder="Enter category name"
          className={
            errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
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
          placeholder="category-slug"
          className={
            errors.slug ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        {errors.slug ? (
          <p className="text-xs text-red-500">{errors.slug}</p>
        ) : (
          <p className="text-xs text-gray-500">
            URL-friendly identifier for this category
          </p>
        )}
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
              <h1 className="text-2xl font-bold text-gray-900">
                Blog Categories
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog categories for organizing content
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>New Category</span>
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
                placeholder="Search by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {filteredCategories.length}
              </span>
              <span>categories found</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                <TableHead className="w-[35%] px-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Name
                    {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead className="px-4">
                  <button
                    onClick={() => handleSort("slug")}
                    className="flex items-center hover:bg-transparent hover:text-current"
                  >
                    Slug
                    {getSortIcon("slug")}
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
                <TableHead className="text-right w-[140px] px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="px-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="px-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="px-4">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedCategories.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-[400px] px-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <Tags className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 text-center">
                        {searchQuery
                          ? "No categories found matching your search"
                          : "No categories yet"}
                      </p>
                      {!searchQuery && (
                        <Button
                          variant="link"
                          onClick={openCreate}
                          className="mt-2 hover:no-underline hover:text-current"
                        >
                          Create your first category
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-transparent">
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <Tags className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {category.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="secondary" className="font-mono text-xs">
                        /{category.slug}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-600 px-4">
                      {category.created_at
                        ? new Date(category.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(category)}
                          title="Edit"
                          className="h-8 w-8 hover:bg-transparent hover:text-current"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCategoryToDelete(category);
                            setIsDeleteOpen(true);
                          }}
                          className="h-8 w-8 text-red-600 hover:bg-transparent hover:text-current"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {!isLoading && filteredCategories.length > 0 && totalPages > 1 && (
          <div className="border-t p-4 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredCategories.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredCategories.length}
                </span>{" "}
                categories
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
            className="w-full sm:max-w-2xl overflow-hidden flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>
                {isEditing ? "Edit Category" : "Create New Category"}
              </SheetTitle>
              <SheetDescription>
                {isEditing
                  ? "Update the category details below"
                  : "Fill in the details for your new category"}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-6">
              <div className="p-6 pb-8">{formContent}</div>
            </ScrollArea>
            <div className="flex justify-end gap-3 pt-4 pb-4 pr-6 border-t mt-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={handleClose}>
          <SheetContent side="right" className="w-full sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>
                {isEditing ? "Edit Category" : "Create New Category"}
              </SheetTitle>
              <SheetDescription>
                {isEditing
                  ? "Update the category details below"
                  : "Fill in the details for your new category"}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-6">
              <div className="p-6 pb-8">{formContent}</div>
            </ScrollArea>
            <div className="flex justify-end gap-3 pt-4 pb-4 pr-6 border-t mt-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{categoryToDelete?.name}
              &quot;? This action cannot be undone. Blog posts using this
              category will have their category removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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
