"use client";

import { useState, Suspense } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import NavLinksSkeleton from "./NavLinksSkeleton";

interface MobileMenuProps {
  projectsEnabled: boolean;
  blogsEnabled: boolean;
}

export default function MobileMenu({ projectsEnabled, blogsEnabled }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-full max-w-none">
          <div className="flex flex-col h-full pt-32 px-4">
            <Suspense fallback={<NavLinksSkeleton isMobile={true} />}>
              <NavLinks
                projectsEnabled={projectsEnabled}
                blogsEnabled={blogsEnabled}
                isMobile={true}
                onMobileLinkClick={() => setIsMenuOpen(false)}
              />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
