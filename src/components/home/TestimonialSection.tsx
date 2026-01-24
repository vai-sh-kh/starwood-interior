"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants/testimonials";

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
                    className={`w-4 h-4 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))}
        </div>
    );
}

export default function TestimonialSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const handlePrevious = () => {
        setIsPaused(true);
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setIsPaused(true);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="py-32 md:py-40 bg-[#faf9f6] overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">What Our Clients Say</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-black">Client Testimonials</h2>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="relative min-h-[350px] md:min-h-[280px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => {
                            const isActive = index === activeIndex;
                            const isPrev = index === (activeIndex - 1 + testimonials.length) % testimonials.length;
                            const isNext = index === (activeIndex + 1) % testimonials.length;
                            const profileColor = getProfileColor(testimonial.author);
                            const initials = getInitials(testimonial.author);

                            return (
                                <div
                                    key={testimonial.id}
                                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out ${isActive
                                        ? "opacity-100 translate-x-0 scale-100 blur-0"
                                        : isPrev
                                            ? "opacity-0 -translate-x-12 scale-95 blur-sm"
                                            : isNext
                                                ? "opacity-0 translate-x-12 scale-95 blur-sm"
                                                : "opacity-0 translate-y-8 scale-90 blur-md"
                                        }`}
                                    style={{
                                        pointerEvents: isActive ? "auto" : "none",
                                        visibility: isActive ? "visible" : "hidden"
                                    }}
                                >
                                    {/* Star Rating */}
                                    <div className={`transition-all duration-700 mb-6 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}>
                                        <StarRating rating={5} />
                                    </div>

                                    {/* Quote */}
                                    <div className={`transition-all duration-700 delay-100 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}>
                                        <h3 className="text-2xl md:text-4xl font-serif italic text-black leading-tight mb-8 max-w-4xl">
                                            &quot;{testimonial.quote}&quot;
                                        </h3>
                                    </div>

                                    {/* Profile Icon and Name */}
                                    <div className={`flex items-center gap-3 transition-all duration-700 delay-200 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}>
                                        {/* Google-style Profile Icon */}
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md"
                                            style={{ backgroundColor: profileColor }}
                                        >
                                            {initials}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-black">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Verified Client
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsPaused(true);
                                    setActiveIndex(index);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-black w-6" : "bg-gray-300"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none">
                    <button
                        onClick={handlePrevious}
                        className="pointer-events-auto p-4 rounded-full border border-stone-200 text-black hover:bg-black hover:text-white hover:border-black transition-all group"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="pointer-events-auto p-4 rounded-full border border-stone-200 text-black hover:bg-black hover:text-white hover:border-black transition-all group"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Mobile Navigation Buttons */}
                <div className="flex md:hidden justify-center gap-4 mt-8">
                    <button
                        onClick={handlePrevious}
                        className="p-3 rounded-full border border-stone-200 text-black"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3 rounded-full border border-stone-200 text-black"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
