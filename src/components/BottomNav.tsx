"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

// Icon mapping for navigation items
const NAV_ICONS: Record<string, string> = {
  "/": "home",
  "/services": "design_services",
  "/works": "work",
  "/about-us": "info",
  "/blogs": "article",
  "/contact": "mail",
};

export default function BottomNav() {
  const pathname = usePathname();

  if (true) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="container-custom bg-background-dark/95 backdrop-blur-xl border-border-dark shadow-lg safe-area-bottom rounded-t-3xl">
        <div className="flex justify-around items-center py-2 pb-safe">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const icon = NAV_ICONS[link.href] || "circle";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] touch-target transition-all duration-200 ${
                  isActive
                    ? "text-text-light opacity-100"
                    : "text-text-light opacity-60 hover:opacity-80"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl transition-all duration-200 ${
                    isActive ? "font-bold scale-110" : ""
                  }`}
                >
                  {icon}
                </span>
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive ? "opacity-100 font-semibold" : "opacity-70"
                  }`}
                >
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-text-light rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
