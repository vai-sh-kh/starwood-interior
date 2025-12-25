"use client";

import Link from "next/link";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LeadAvatar from "@/components/LeadAvatar";

interface RecentLeadItemProps {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string | null;
  status: string | null;
  avatar_color: string | null;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

function getStatusBadgeColor(status: string | null) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "contacted":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "qualified":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "converted":
      return "bg-green-100 text-green-700 border-green-200";
    case "lost":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "converted":
      return "Converted";
    case "lost":
      return "Lost";
    default:
      return "Unknown";
  }
}

export default function RecentLeadItem({
  name,
  email,
  phone,
  created_at,
  status,
  avatar_color,
}: RecentLeadItemProps) {
  return (
    <Link
      href={`/admin/leads`}
      className="group flex items-start gap-2.5 p-2.5 hover:bg-gray-50 transition-colors"
    >
      <LeadAvatar name={name} avatarColor={avatar_color} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {name}
          </p>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-4 ${getStatusBadgeColor(
              status
            )} shrink-0`}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail className="h-3 w-3 text-gray-400 shrink-0" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${email}`;
              }}
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors truncate text-left"
            >
              {email}
            </button>
          </div>
          {phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-gray-400 shrink-0" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${phone}`;
                }}
                className="text-xs text-gray-600 hover:text-blue-600 transition-colors truncate text-left"
              >
                {phone}
              </button>
            </div>
          )}
          <span className="text-xs text-gray-400 mt-0.5">
            {formatDate(created_at)}
          </span>
        </div>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
    </Link>
  );
}
