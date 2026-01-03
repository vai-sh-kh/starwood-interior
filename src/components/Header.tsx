import Link from "next/link";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/constants";
import { getBooleanSetting } from "@/lib/settings";
import NavLinks from "./NavLinks";
import NavLinksSkeleton from "./NavLinksSkeleton";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const projectsEnabled = await getBooleanSetting("projects_enabled", true);
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);

  return (
    <nav className="fixed top-0 z-100 w-full bg-background-light/98 backdrop-blur-md transition-colors duration-300 h-[75px] border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-semibold font-display tracking-tight text-black italic">
              Starwood Interiors
            </span>
          </Link>

          {/* Desktop Navigation with Suspense */}
          <Suspense fallback={<NavLinksSkeleton />}>
            <NavLinks projectsEnabled={projectsEnabled} blogsEnabled={blogsEnabled} />
          </Suspense>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a
              href={`tel:${CONTACT_CONTENT.details.phone.replace(/\s/g, "")}`}
              className="bg-black text-white pl-5 pr-1.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              Contact Us
              <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-black" />
              </span>
            </a>
          </div>

          {/* Mobile Menu */}
          <MobileMenu projectsEnabled={projectsEnabled} blogsEnabled={blogsEnabled} />
        </div>
      </div>
    </nav>
  );
}
