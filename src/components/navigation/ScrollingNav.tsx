"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollingNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white border-b border-stone-100 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className={`material-symbols-outlined text-3xl font-light transition-colors duration-300 ${isScrolled ? "text-black" : "text-white"
                            }`}
                    >
                        pentagon
                    </span>
                    <h1
                        className={`text-2xl font-semibold tracking-tight font-serif transition-colors duration-300 ${isScrolled ? "text-black" : "text-white"
                            }`}
                    >
                        Starwood
                    </h1>
                </div>
                <div className="hidden md:flex items-center gap-12">
                    <Link
                        className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${pathname === "/"
                                ? (isScrolled
                                    ? "text-stone-900 border-b border-stone-900"
                                    : "text-white border-b border-white")
                                : (isScrolled
                                    ? "text-stone-900 hover:text-stone-500"
                                    : "text-white/90 hover:text-white")
                            }`}
                        href="/"
                    >
                        Interiors
                    </Link>
                    <Link
                        className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${pathname === "/services"
                                ? (isScrolled
                                    ? "text-stone-900 border-b border-stone-900"
                                    : "text-white border-b border-white")
                                : (isScrolled
                                    ? "text-stone-900 hover:text-stone-500"
                                    : "text-white/90 hover:text-white")
                            }`}
                        href="/services"
                    >
                        Expertise
                    </Link>
                    <Link
                        className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${pathname === "/about-us"
                                ? (isScrolled
                                    ? "text-stone-900 border-b border-stone-900"
                                    : "text-white border-b border-white")
                                : (isScrolled
                                    ? "text-stone-900 hover:text-stone-500"
                                    : "text-white/90 hover:text-white")
                            }`}
                        href="/about-us"
                    >
                        About
                    </Link>
                    <Link
                        className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${isScrolled
                                ? "text-stone-900 hover:text-stone-500"
                                : "text-white/90 hover:text-white"
                            }`}
                        href="#"
                    >
                        Contact
                    </Link>
                </div>
                <button className="md:hidden p-2">
                    <span
                        className={`material-symbols-outlined transition-colors duration-300 ${isScrolled ? "text-black" : "text-white"
                            }`}
                    >
                        menu
                    </span>
                </button>
            </div>
        </nav>
    );
}
