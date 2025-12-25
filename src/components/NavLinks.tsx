"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

interface NavLinksProps {
  projectsEnabled: boolean;
  blogsEnabled: boolean;
  onMobileLinkClick?: () => void;
  isMobile?: boolean;
}

export default function NavLinks({
  projectsEnabled,
  blogsEnabled,
  onMobileLinkClick,
  isMobile = false,
}: NavLinksProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Filter out projects and blogs links if disabled
  const filteredNavLinks = NAV_LINKS.filter((link) => {
    if (link.href === "/projects" && !projectsEnabled) {
      return false;
    }
    if (link.href === "/blogs" && !blogsEnabled) {
      return false;
    }
    return true;
  });

  const handleLinkClick = () => {
    startTransition(() => {
      if (onMobileLinkClick) {
        onMobileLinkClick();
      }
    });
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col w-full items-center gap-6">
        {filteredNavLinks.map((link) => {
          const isActive =
            link.href === "/projects" ||
            link.href === "/services" ||
            link.href === "/blogs"
              ? pathname === link.href || pathname.startsWith(`${link.href}/`)
              : pathname === link.href;
          const isDetailPage =
            (link.href === "/projects" && pathname.startsWith("/projects/")) ||
            (link.href === "/services" && pathname.startsWith("/services/")) ||
            (link.href === "/blogs" && pathname.startsWith("/blogs/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`text-lg font-medium transition-colors w-full text-center flex items-center justify-center gap-2 ${
                isPending ? "opacity-50 pointer-events-none" : ""
              } ${
                isActive
                  ? "text-black font-bold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <span className="relative inline-block pb-1">
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-black rounded-full transition-all duration-300 ease-in-out ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </span>
              {isDetailPage && (
                <span className="material-symbols-outlined text-lg">
                  keyboard_arrow_down
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-gray-600">
      {filteredNavLinks.map((link) => {
        const isActive =
          link.href === "/projects" ||
          link.href === "/services" ||
          link.href === "/blogs"
            ? pathname === link.href || pathname.startsWith(`${link.href}/`)
            : pathname === link.href;
        const isDetailPage =
          (link.href === "/projects" && pathname.startsWith("/projects/")) ||
          (link.href === "/services" && pathname.startsWith("/services/")) ||
          (link.href === "/blogs" && pathname.startsWith("/blogs/"));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleLinkClick}
            className={`relative pb-1 group transition-all duration-300 ease-in-out flex items-center gap-1.5 ${
              isPending ? "opacity-50 pointer-events-none" : ""
            } ${
              isActive
                ? "text-black font-bold"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <span className="relative z-10">{link.label}</span>
            {isDetailPage && (
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-y-0.5">
                keyboard_arrow_down
              </span>
            )}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black rounded-full transition-all duration-300 ease-in-out ${
                isActive
                  ? "w-full opacity-100"
                  : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
