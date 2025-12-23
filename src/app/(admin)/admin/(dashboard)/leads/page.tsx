"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadInsert, LeadUpdate } from "@/lib/supabase/types";
import { LEAD_STATUSES } from "@/lib/constants";
import { getAvatarColorClass } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Trash2,
  Search,
  Users,
  Loader2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ExternalLink,
  Plus,
  Edit,
  MoreVertical,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Detail sheet state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Add/Edit sheet state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "new" as string,
    source: "manual" as string,
  });

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch leads");
      setIsLoading(false);
      return;
    }

    setLeads(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const openDetailSheet = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const openAddSheet = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      status: "new",
      source: "manual",
    });
    setIsFormOpen(true);
  };

  const openEditSheet = (lead: Lead) => {
    setIsEditing(true);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      message: lead.message || "",
      status: lead.status || "new",
      source: lead.source || "manual",
    });
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && selectedLead) {
        const updateData: LeadUpdate = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          message: formData.message?.trim() || null,
          status: formData.status,
          source: formData.source,
          avatar_color: getAvatarColorClass(formData.name.trim()),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("leads")
          .update(updateData)
          .eq("id", selectedLead.id)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        if (!data) {
          throw new Error("No data returned from update");
        }

        toast.success("Lead updated successfully");
      } else {
        const insertData: LeadInsert = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          message: formData.message?.trim() || null,
          status: formData.status,
          source: formData.source,
          avatar_color: getAvatarColorClass(formData.name.trim()),
        };

        const { data, error } = await supabase
          .from("leads")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }

        if (!data) {
          throw new Error("No data returned from insert");
        }

        toast.success("Lead created successfully");
      }

      setIsFormOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error: unknown) {
      console.error("Save error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save lead. Please check the console for details.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      toast.success("Status updated successfully");
      fetchLeads();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadToDelete.id);

      if (error) throw error;

      toast.success("Lead deleted successfully");
      setIsDeleteOpen(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete lead";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.phone &&
          lead.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leads, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const getSourceBadgeColor = (source: string | null) => {
    switch (source) {
      case "contact_form":
        return "bg-blue-100 text-blue-700";
      case "newsletter":
        return "bg-green-100 text-green-700";
      case "consultation":
        return "bg-purple-100 text-purple-700";
      case "manual":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatSource = (source: string | null) => {
    if (!source) return "Unknown";
    return source
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status: string) => {
    const statusOption = LEAD_STATUSES.find((s) => s.value === status);
    return statusOption || LEAD_STATUSES[0];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      {/* Single Block Container */}
      <div className="flex-1 flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden min-h-0">
        {/* Header Section */}
        <div className="border-b bg-gray-50/50 p-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage contact form submissions
              </p>
            </div>
            <Button onClick={openAddSheet} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>New Lead</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="border-b p-4 bg-white shrink-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                {filteredLeads.length}
              </span>
              <span>leads found</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto min-h-0">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                  <TableHead className="w-[60px] px-4">No</TableHead>
                  <TableHead className="w-[20%] px-4">Contact</TableHead>
                  <TableHead className="px-4">Email</TableHead>
                  <TableHead className="px-4">Phone</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Source</TableHead>
                  <TableHead className="px-4">Date</TableHead>
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
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="px-4">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLeads.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="h-[400px] px-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <Users className="h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          {searchQuery ? "No leads found" : "No leads yet"}
                        </p>
                        {!searchQuery && (
                          <p className="text-sm text-gray-400 mt-1">
                            Leads will appear here when visitors submit your
                            contact form
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead, index) => {
                    const statusBadge = getStatusBadge(lead.status || "new");
                    return (
                      <TableRow key={lead.id} className="hover:bg-transparent">
                        <TableCell className="text-gray-600 px-4">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                lead.avatar_color ||
                                getAvatarColorClass(lead.name)
                              }`}
                            >
                              <span className="text-sm font-medium">
                                {lead.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {lead.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell className="text-gray-600 px-4">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="hover:text-gray-900"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4">
                          <Select
                            value={lead.status || "new"}
                            onValueChange={(value) =>
                              handleStatusChange(lead.id, value)
                            }
                          >
                            <SelectTrigger
                              className={`w-[140px] h-7 ${statusBadge.color} border-0 hover:opacity-80`}
                            >
                              <SelectValue>
                                <span className="text-xs font-medium">
                                  {statusBadge.label}
                                </span>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {LEAD_STATUSES.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge
                            variant="secondary"
                            className={getSourceBadgeColor(lead.source)}
                          >
                            {formatSource(lead.source)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 px-4">
                          {lead.created_at
                            ? new Date(lead.created_at).toLocaleDateString()
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
                                <DropdownMenuItem
                                  onClick={() => openDetailSheet(lead)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditSheet(lead)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLeadToDelete(lead);
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Section */}
        {!isLoading && filteredLeads.length > 0 && totalPages > 1 && (
          <div className="border-t p-4 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(endIndex, filteredLeads.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredLeads.length}
                </span>{" "}
                leads
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

      {/* Add/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update lead information"
                : "Create a new lead manually"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formData.name && formData.email) {
                        handleSave();
                      }
                    }
                  }}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formData.name && formData.email) {
                        handleSave();
                      }
                    }
                  }}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (formData.name && formData.email) {
                        handleSave();
                      }
                    }
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="contact_form">Contact Form</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Enter message or notes"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>
              Contact information and message from this lead
            </SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <div className="mt-6 space-y-6">
              {/* Contact Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedLead.avatar_color ||
                    getAvatarColorClass(selectedLead.name)
                  }`}
                >
                  <span className="text-xl font-semibold">
                    {selectedLead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedLead.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={
                        getStatusBadge(selectedLead.status || "new").color
                      }
                    >
                      {getStatusBadge(selectedLead.status || "new").label}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={getSourceBadgeColor(selectedLead.source)}
                    >
                      {formatSource(selectedLead.source)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Send email"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                </div>

                {selectedLead.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Phone
                      </p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-gray-900 font-medium"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Call"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Submitted
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedLead.created_at
                        ? new Date(selectedLead.created_at).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Message
                      </p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEditSheet(selectedLead);
                  }}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLeadToDelete(selectedLead);
                    setIsDetailOpen(false);
                    setIsDeleteOpen(true);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the lead from &quot;
              {leadToDelete?.name}&quot;? This action cannot be undone.
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
