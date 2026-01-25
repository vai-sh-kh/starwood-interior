"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { motion } from "framer-motion";

const testimonials = TESTIMONIALS;

// Google-inspired profile colors
const PROFILE_COLORS = [
    "#EA4335", // Red
    "#4285F4", // Blue
    "#34A853", // Green
    "#FBBC05", // Yellow
    "#FF6D01", // Orange
    "#46BDC6", // Teal
    "#7BAAF7", // Light Blue
    "#F07B72", // Coral
    "#9334E6", // Purple
    "#E37400", // Amber
];

// Get initials from name
function getInitials(name: string): string {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

// Get consistent color based on name
function getProfileColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PROFILE_COLORS[Math.abs(hash) % PROFILE_COLORS.length];
}

// Star rating component
function StarRating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3 h-3 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))}
        </div>
    );
}

export default function TestimonialSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000); // Slide every 4 seconds
        return () => clearInterval(interval);
    }, [isPaused]);

    // Calculate visible cards for infinite loop feel
    // We strictly need 3 cards in a row for Desktop as requested.
    // For seamless looping, we might need a more complex setup, but simplified carousel works well for this request.
    const visibleTestimonials = [
        testimonials[currentIndex % testimonials.length],
        testimonials[(currentIndex + 1) % testimonials.length],
        testimonials[(currentIndex + 2) % testimonials.length],
    ];

    const handleNext = () => {
        setIsPaused(true);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setIsPaused(true);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 md:py-32 bg-[#faf9f6] overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">What Our Clients Say</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-black">Client Curated Stories</h2>
                </motion.div>

                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Desktop/Tablet 3-Row View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {visibleTestimonials.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${currentIndex}-${index}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                                        style={{ backgroundColor: getProfileColor(item.name) }}
                                    >
                                        {getInitials(item.name)}
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-black leading-tight">{item.name}</h4>
                                        <p className="text-xs text-stone-400 uppercase tracking-wider">{item.role}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Quote className="w-8 h-8 text-stone-100 fill-stone-100" />
                                    </div>
                                </div>

                                <div className="mb-6 flex-grow">
                                    <p className="text-stone-600 font-light leading-relaxed italic text-sm md:text-base">
                                        &quot;{item.quote}&quot;
                                    </p>
                                </div>

                                <div className="mt-auto border-t border-stone-100 pt-4 flex justify-between items-center">
                                    <StarRating rating={item.rating} />
                                    <span className="text-xs text-stone-400 font-medium">Verified Client</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Buttons (Absolute) */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 -left-12 xl:-left-16 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg backdrop-blur-sm border border-stone-100 transition-all z-10 hidden md:block"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 -right-12 xl:-right-16 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg backdrop-blur-sm border border-stone-100 transition-all z-10 hidden md:block"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Mobile Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-8 md:hidden">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setIsPaused(true);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-black w-6" : "bg-stone-300"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
