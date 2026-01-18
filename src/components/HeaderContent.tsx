"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/constants";
import NavLinks from "./NavLinks";
import NavLinksSkeleton from "./NavLinksSkeleton";
import MobileMenu from "./MobileMenu";

interface HeaderContentProps {
    projectsEnabled: boolean;
    blogsEnabled: boolean;
}

export default function HeaderContent({
    projectsEnabled,
    blogsEnabled,
}: HeaderContentProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isTransparentPage = pathname === "/" || pathname === "/contact" || pathname === "/about-us" || pathname === "/services";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const headerBgClass = isTransparentPage
        ? isScrolled
            ? "bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-transparent border-transparent"
        : "bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm";


    const logoColorClass = isTransparentPage && !isScrolled ? "text-white" : "text-black";

    return (
        <nav
            className={`fixed top-0 z-[100] w-full transition-all duration-500 h-[75px] flex items-center ${headerBgClass}`}
        >
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 w-full">
                <div className="flex justify-between items-center h-full relative">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <span className={`text-3xl font-semibold font-serif tracking-wide italic transition-colors duration-500 ${logoColorClass}`}>
                            Starwood
                        </span>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block transition-colors duration-500 ${isTransparentPage && !isScrolled ? "[&_a]:text-white/80 [&_a:hover]:text-white [&_span.bg-black]:bg-white" : ""}`}>
                        <Suspense fallback={<NavLinksSkeleton />}>
                            <NavLinks
                                projectsEnabled={projectsEnabled}
                                blogsEnabled={blogsEnabled}
                            />
                        </Suspense>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        {/* Contact Button */}
                        <div className="hidden md:flex items-center">
                            <a
                                href={`tel:${CONTACT_CONTENT.details.phone.replace(/\s/g, "")}`}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${isTransparentPage && !isScrolled
                                    ? "bg-white text-black hover:bg-stone-200"
                                    : "bg-black text-white hover:opacity-90 shadow-lg shadow-black/5"
                                    }`}
                            >
                                Start Project
                                <Phone className={`w-3.5 h-3.5 ${isTransparentPage && !isScrolled ? "text-black" : "text-white"}`} />
                            </a>
                        </div>

                        {/* Mobile Menu */}
                        <div className={isTransparentPage && !isScrolled ? "[&_button]:text-white" : ""}>
                            <MobileMenu
                                projectsEnabled={projectsEnabled}
                                blogsEnabled={blogsEnabled}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
