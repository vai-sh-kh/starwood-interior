"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadInsert, LeadUpdate } from "@/lib/supabase/types";
import { LEAD_STATUSES } from "@/lib/constants";
import { getAvatarHexColor } from "@/lib/utils";
import LeadAvatar from "@/components/LeadAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
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
  Download,
  Search,
  Users,
  Loader2,
  Eye,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MessageSquare,
  ExternalLink,
  Plus,
  Edit,
  MoreVertical,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Bot,
  Hammer,
  Filter,
} from "lucide-react";
import { SERVICES_DATA } from "@/lib/services-data";
import { Calendar } from "@/components/ui/calendar";

import { MultiSelect } from "@/components/ui/multi-select";

const ITEMS_PER_PAGE = 10;

// Zod validation schema for lead form
const leadFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .min(5, "Email address is too short")
    .max(255, "Email address must be less than 255 characters")
    .refine(
      (email: string) => {
        // Check for consecutive dots
        if (email.includes("..")) return false;

        // Check for dot at start or end of local part
        const [localPart] = email.split("@");
        if (!localPart || localPart.length === 0) return false;
        if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

        // Check for valid domain
        const domain = email.split("@")[1];
        if (!domain || domain.length < 3) return false;
        if (!domain.includes(".")) return false;

        // Check domain doesn't start or end with dot or hyphen
        if (domain.startsWith(".") || domain.endsWith(".")) return false;
        if (domain.startsWith("-") || domain.endsWith("-")) return false;

        // Check for valid TLD (top-level domain should be at least 2 characters)
        const domainParts = domain.split(".");
        const tld = domainParts[domainParts.length - 1];
        if (!tld || tld.length < 2) return false;

        // Check that domain parts don't start or end with hyphen
        for (const part of domainParts) {
          if (part.startsWith("-") || part.endsWith("-")) return false;
        }

        return true;
      },
      {
        message: "Please enter a valid email address",
      }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true; // Optional field
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      {
        message: "Phone number must contain between 10 and 15 digits",
      }
    ),
  message: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  source: z.string().min(1, "Source is required"),
  service_interest: z.array(z.string()).optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

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
    service_interest: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LeadFormData, string>>
  >({});

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // List of services from constant
  const services = useMemo(() => SERVICES_DATA.map(service => ({
    id: service.listingTitle,
    title: service.listingTitle
  })), []);

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date()
  });
  const [filterServices, setFilterServices] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);


  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

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
      service_interest: [],
    });
    setFormErrors({});
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
      service_interest: lead.service_interest || [],
    });
    setFormErrors({});
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    // Validate form using Zod
    const validationResult = leadFormSchema.safeParse({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || "",
      message: formData.message?.trim() || "",
      status: formData.status,
      source: formData.source,
      service_interest: formData.service_interest,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LeadFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setFormErrors(fieldErrors);

      // Show first error in toast
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    // Clear errors if validation passes
    setFormErrors({});

    setIsSaving(true);

    try {
      if (isEditing && selectedLead) {
        const updateData: LeadUpdate = {
          name: validationResult.data.name,
          email: validationResult.data.email,
          phone: validationResult.data.phone?.trim() || null,
          message: validationResult.data.message?.trim() || null,
          status: validationResult.data.status,
          source: validationResult.data.source,
          service_interest: validationResult.data.service_interest || null,
          avatar_color: getAvatarHexColor(validationResult.data.name),
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
          name: validationResult.data.name,
          email: validationResult.data.email,
          phone: validationResult.data.phone?.trim() || null,
          message: validationResult.data.message?.trim() || null,
          status: validationResult.data.status,
          source: validationResult.data.source,
          service_interest: validationResult.data.service_interest || null,
          avatar_color: getAvatarHexColor(validationResult.data.name),
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
    return leads.filter((lead) => {
      // Text search
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Date Range Filter
      if (dateRange.from) {
        const leadDate = new Date(lead.created_at || "");
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        const leadDateCheck = new Date(leadDate);
        leadDateCheck.setHours(0, 0, 0, 0);

        if (leadDateCheck < fromDate) return false;
      }
      if (dateRange.to) {
        const leadDate = new Date(lead.created_at || "");
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);

        if (leadDate > toDate) return false;
      }

      // Service Filter
      if (filterServices.length > 0) {
        if (!lead.service_interest || lead.service_interest.length === 0) return false;
        const hasService = lead.service_interest.some(s => filterServices.includes(s));
        if (!hasService) return false;
      }

      // Status Filter
      if (filterStatus.length > 0) {
        if (!filterStatus.includes(lead.status || "new")) return false;
      }

      return true;
    });
  }, [leads, searchQuery, dateRange, filterServices, filterStatus]);

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
      case "collect_chat":
        return "bg-pink-100 text-pink-700";
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

  const handleExport = () => {
    const exportData = filteredLeads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone || "",
      Message: lead.message || "",
      Status: lead.status,
      Source: lead.source,
      Service_Interest: lead.service_interest ? lead.service_interest.join(", ") : "",
      Created_At: lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `Starwood_Leads_${new Date().getFullYear()}.xlsx`);
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport} className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                <span>Export Excel</span>
              </Button>
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="gap-2 shrink-0">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button onClick={openAddSheet} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span>New Lead</span>
              </Button>
            </div>
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
          <div className="flex-1 overflow-auto overflow-x-hidden min-h-0">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50/80">
                  <TableHead className="w-[60px] max-w-[60px] px-4">
                    No
                  </TableHead>
                  <TableHead className="w-[20%] max-w-[20%] px-4">
                    Contact
                  </TableHead>
                  <TableHead className="max-w-[200px] px-4">Email</TableHead>
                  <TableHead className="max-w-[150px] px-4">Phone</TableHead>
                  <TableHead className="max-w-[150px] px-4">Service</TableHead>
                  <TableHead className="max-w-[140px] px-4">Status</TableHead>
                  <TableHead className="max-w-[120px] px-4">Source</TableHead>
                  <TableHead className="max-w-[120px] px-4">Date</TableHead>
                  <TableHead className="text-right w-[80px] max-w-[80px] px-4">
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
                        <TableCell className="px-4 max-w-[20%]">
                          <div className="flex items-center gap-3 min-w-0">
                            <LeadAvatar
                              name={lead.name}
                              avatarColor={lead.avatar_color}
                              size="md"
                            />
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-medium text-gray-900 truncate max-w-[500px]">
                                {lead.name}
                              </span>
                              {lead.source === "collect_chat" && (
                                <span title="From Chatbot">
                                  <Bot className="h-4 w-4 text-pink-600 shrink-0" />
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 max-w-[200px]">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline truncate block"
                            title={lead.email}
                          >
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell className="text-gray-600 px-4 max-w-[150px] truncate">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="hover:text-gray-900 truncate block"
                              title={lead.phone}
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 px-4 max-w-[150px] truncate">
                          {lead.service_interest && lead.service_interest.length > 0 ? (
                            <div className="flex flex-col gap-1 max-h-[60px] overflow-hidden">
                              {lead.service_interest.map((service, i) => (
                                <span key={i} className="truncate block text-xs bg-gray-100 rounded px-1.5 py-0.5 w-fit max-w-full" title={service}>
                                  {service}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">_</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 max-w-[140px]">
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
                        <TableCell className="px-4 max-w-[120px]">
                          <Badge
                            variant="secondary"
                            className={`${getSourceBadgeColor(
                              lead.source
                            )} truncate max-w-full flex items-center gap-1`}
                          >
                            {lead.source === "collect_chat" && (
                              <Bot className="h-3 w-3 shrink-0" />
                            )}
                            <span className="truncate">
                              {formatSource(lead.source)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 px-4 max-w-[120px] truncate">
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
        {!isLoading && filteredLeads.length > 0 && (
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

                {totalPages > 0 && (
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
                )}

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

      {/* Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto flex flex-col p-0 bg-white">
          <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <SheetTitle>Filter Leads</SheetTitle>
              <SheetDescription>
                Filter leads by date range, services, and status
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
              <div className="space-y-6">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Date Range</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        const r = range as { from?: Date; to?: Date } | undefined;
                        setDateRange({ from: r?.from, to: r?.to });
                      }}
                      className="rounded-md border-0 w-full"
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Services</Label>
                  <MultiSelect
                    options={services}
                    selected={filterServices}
                    onChange={setFilterServices}
                    placeholder="Select services..."
                    className="w-full"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Status</Label>
                  <MultiSelect
                    options={LEAD_STATUSES.map((s) => ({
                      id: s.value,
                      title: s.label,
                    }))}
                    selected={filterStatus}
                    onChange={setFilterStatus}
                    placeholder="Select status..."
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer with Clear Button */}
            <div className="flex justify-end gap-3 pt-4 px-6 pb-6 border-t shrink-0 bg-white">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  setFilterServices([]);
                  setFilterStatus([]);
                  setSearchQuery("");
                  setIsFilterOpen(false);
                }}
              >
                Clear All Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-5xl overflow-y-auto flex flex-col p-0 bg-white">
          <div className="flex flex-col h-full overflow-hidden">
            <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <SheetTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</SheetTitle>
              <SheetDescription>
                {isEditing
                  ? "Update lead information"
                  : "Create a new lead manually"}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: undefined });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (formData.name && formData.email) {
                          handleSave();
                        }
                      }
                    }}
                    placeholder="Enter full name"
                    className={`h-12 text-base ${formErrors.name ? "border-red-500" : ""}`}
                  />
                  {formErrors.name && (
                    <span className="text-red-500 text-sm">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: undefined });
                      }
                    }}
                    onBlur={() => {
                      // Validate email on blur
                      const testData = {
                        ...formData,
                        email: formData.email.trim(),
                      };
                      const validationResult = leadFormSchema.safeParse({
                        name: testData.name.trim(),
                        email: testData.email.trim(),
                        phone: testData.phone?.trim() || "",
                        message: testData.message?.trim() || "",
                        status: testData.status,
                        source: testData.source,
                      });
                      if (!validationResult.success) {
                        const emailError = validationResult.error.issues.find(
                          (issue) => issue.path[0] === "email"
                        );
                        if (emailError) {
                          setFormErrors({
                            ...formErrors,
                            email: emailError.message,
                          });
                        }
                      } else if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: undefined });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (formData.name && formData.email) {
                          handleSave();
                        }
                      }
                    }}
                    placeholder="Enter email address"
                    className={`h-12 text-base ${formErrors.email ? "border-red-500" : ""}`}
                  />
                  {formErrors.email && (
                    <span className="text-red-500 text-sm">
                      {formErrors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) {
                        setFormErrors({ ...formErrors, phone: undefined });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (formData.name && formData.email) {
                          handleSave();
                        }
                      }
                    }}
                    placeholder="Enter phone number"
                    className={`h-12 text-base ${formErrors.phone ? "border-red-500" : ""}`}
                  />
                  {formErrors.phone && (
                    <span className="text-red-500 text-sm">
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="w-full h-12 text-base">
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
                  <Label htmlFor="source" className="text-base">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value })
                    }
                  >
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="contact_form">Contact Form</SelectItem>
                      <SelectItem value="collect_chat">Chatbot</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="service_interest" className="text-base">Service Interest</Label>
                  <MultiSelect
                    options={services}
                    selected={formData.service_interest}
                    onChange={(selected) =>
                      setFormData({ ...formData, service_interest: selected })
                    }
                    placeholder="Select services..."
                    className="w-full"
                  />
                  {formErrors.service_interest && (
                    <p className="text-sm text-red-500">
                      {formErrors.service_interest}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) {
                        setFormErrors({ ...formErrors, message: undefined });
                      }
                    }}
                    placeholder="Enter message or notes"
                    rows={5}
                    className={`min-h-[140px] text-base ${formErrors.message ? "border-red-500" : ""}`}
                  />
                  {formErrors.message && (
                    <span className="text-red-500 text-sm">
                      {formErrors.message}
                    </span>
                  )}
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
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Dialog Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Contact information and message from this lead
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6 py-4">
              {/* Contact Info */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <LeadAvatar
                  name={selectedLead.name}
                  avatarColor={selectedLead.avatar_color}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedLead.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
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
                      className={`${getSourceBadgeColor(selectedLead.source)} flex items-center gap-1`}
                    >
                      {selectedLead.source === "collect_chat" && (
                        <Bot className="h-3 w-3 shrink-0" />
                      )}
                      {formatSource(selectedLead.source)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="shrink-0">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-blue-600 hover:text-blue-700 font-medium break-all"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                  <div className="shrink-0">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Send email"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                  </div>
                </div>

                {selectedLead.phone && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="shrink-0">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-gray-900 font-medium"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div className="shrink-0">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Call"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="shrink-0">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Submitted
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedLead.created_at
                        ? new Date(selectedLead.created_at).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="shrink-0">
                    <Hammer className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Service Interest
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedLead.service_interest && selectedLead.service_interest.length > 0 ? selectedLead.service_interest.join(", ") : "—"}
                    </p>
                  </div>
                </div>


                {selectedLead.chat_id && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="shrink-0">
                      <Bot className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Chat ID
                      </p>
                      <p className="text-gray-900 font-medium font-mono text-sm">
                        {selectedLead.chat_id}
                      </p>
                    </div>
                  </div>
                )}

                {(selectedLead.message || selectedLead.chatbot_metadata) && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Message
                      </p>
                    </div>
                    {selectedLead.message && (
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                        {selectedLead.message}
                      </p>
                    )}
                    {selectedLead.chatbot_metadata && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                          Additional Chatbot Information
                        </p>
                        <div className="space-y-2">
                          {Object.entries(selectedLead.chatbot_metadata as Record<string, any>).map(([key, value]) => {
                            // Skip if value is null, undefined, or empty
                            if (value === null || value === undefined || value === '') return null;

                            // Format the key for display
                            const displayKey = key
                              .replace(/_/g, ' ')
                              .replace(/([A-Z])/g, ' $1')
                              .trim()
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join(' ');

                            // Format the value
                            let displayValue: string;
                            if (typeof value === 'object') {
                              displayValue = JSON.stringify(value, null, 2);
                            } else {
                              displayValue = String(value);
                            }

                            return (
                              <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-gray-200 last:border-0">
                                <span className="text-xs font-medium text-gray-600 min-w-[120px] sm:min-w-[150px]">
                                  {displayKey}:
                                </span>
                                <span className="text-sm text-gray-800 flex-1 break-words">
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
        </DialogContent>
      </Dialog>

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
