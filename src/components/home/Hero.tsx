"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
    '/images/home/home-banner-1.jpeg',
    '/images/home/home-banner-2.webp',
    '/images/home/home-banner-3.jpeg',
    '/images/home/home-banner-4.jpeg'
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        // Set first load to false after initial render
        setIsFirstLoad(false);

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="relative w-full h-[10vh] md:h-screen md:min-h-[700px] flex flex-col justify-end pb-6 md:pb-24 overflow-hidden">
            {/* Background Slider */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: isFirstLoad ? 1 : 0, scale: isFirstLoad ? 1 : 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: isFirstLoad ? 0 : 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full z-0"
                >
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url("${SLIDES[currentSlide]}")`,
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/40 z-[5]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10"></div>

            {/* Content */}
            <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <p className="text-white/90 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 md:mb-6">
                        Starwood Interiors
                    </p>
                    <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif italic font-medium leading-[1.15] md:leading-[1.1] tracking-tight mb-6 md:mb-8 lg:mb-10">
                        Best Interior Design Service in Trivandrum
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                        <p className="text-white/80 text-sm md:text-base font-light max-w-[350px] leading-relaxed">
                            Leading interior design firm in Trivandrum delivering contemporary, functional, and sophisticated solutions for residential and commercial spaces.
                        </p>
                        <span className="w-12 h-[1px] bg-white/50 hidden md:block"></span>
                        <Link href="/contact">
                            <button className="bg-white text-black hover:bg-stone-200 border border-white px-6 py-3.5 md:px-10 md:py-4 text-[11px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 min-h-[44px]">
                                Get Your Free Consultation
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-2 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3 md:gap-4">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 border border-white/50 ${index === currentSlide
                            ? "bg-white scale-110"
                            : "bg-transparent hover:bg-white/30"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </header>
    );
}
