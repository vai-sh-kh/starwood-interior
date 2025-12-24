"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { NAV_LINKS, CONTACT_CONTENT } from "@/lib/constants";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-100 w-full bg-background-light/98 backdrop-blur-md transition-colors duration-300 h-[60px] border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-semibold font-display tracking-wide text-black italic">
              Starwood Interiors
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-gray-600">
            {NAV_LINKS.map((link) => {
              // For projects, services, and blogs, check if pathname starts with the href
              const isActive =
                link.href === "/projects" ||
                link.href === "/services" ||
                link.href === "/blogs"
                  ? pathname === link.href ||
                    pathname.startsWith(`${link.href}/`)
                  : pathname === link.href;
              const isDetailPage =
                (link.href === "/projects" && pathname.startsWith("/projects/")) ||
                (link.href === "/services" &&
                  pathname.startsWith("/services/")) ||
                (link.href === "/blogs" && pathname.startsWith("/blogs/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 group transition-all duration-300 ease-in-out flex items-center gap-1.5 ${
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

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a
              href={`tel:${CONTACT_CONTENT.details.phone.replace(/\s/g, "")}`}
              className="bg-black text-white pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              Contact Us
              <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-black" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-full max-w-none">
          <div className="flex flex-col h-full pt-32 px-4">
            {/* Navigation Links */}
            <nav className="flex flex-col w-full items-center gap-6">
              {NAV_LINKS.map((link) => {
                // For projects, services, and blogs, check if pathname starts with the href
                const isActive =
                  link.href === "/projects" ||
                  link.href === "/services" ||
                  link.href === "/blogs"
                    ? pathname === link.href ||
                      pathname.startsWith(`${link.href}/`)
                    : pathname === link.href;
                const isDetailPage =
                  (link.href === "/projects" &&
                    pathname.startsWith("/projects/")) ||
                  (link.href === "/services" &&
                    pathname.startsWith("/services/")) ||
                  (link.href === "/blogs" && pathname.startsWith("/blogs/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg font-medium transition-colors w-full text-center flex items-center justify-center gap-2 ${
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
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
