"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, FolderKanban, Tags, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    label: "New Blog Post",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    label: "Add Project",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "New Category",
    href: "/admin/categories",
    icon: Tags,
  },
];

export default function QuickActionsWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = () => {
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".quick-actions-widget")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="quick-actions-widget fixed bottom-6 right-6 z-50">
      {/* Actions Menu */}
      <div
        className={cn(
          "absolute bottom-16 right-0 mb-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 translate-y-4 pointer-events-none scale-95"
        )}
      >
        <div className="p-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                onClick={handleActionClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all group",
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : `${(quickActions.length - index - 1) * 30}ms`,
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Icon className="h-4 w-4 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={toggleOpen}
        className={cn(
          "w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all duration-300",
          "hover:scale-110 active:scale-95",
          isOpen && "rotate-45"
        )}
        aria-label="Quick Actions"
        aria-expanded={isOpen}
      >
        <Plus className="w-6 h-6 transition-transform duration-300" />
      </button>
    </div>
  );
}

