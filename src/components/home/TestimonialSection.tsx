"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    {
        quote: "Starwood didn't just design our home; they curated an experience of stillness and light.",
        author: "The Henderson Family"
    },
    {
        quote: "The attention to detail in every corner of our new kitchen is simply remarkable.",
        author: "Sarah & James Miller"
    },
    {
        quote: "They transformed our workspace into an environment that truly inspires productivity.",
        author: "Creative Collective Studio"
    },
    {
        quote: "A perfect blend of modern sophistication and warm, inviting textures.",
        author: "Elena Rostova"
    },
    {
        quote: "The process was seamless, and the final result exceeded our wildest expectations.",
        author: "The Thompson Estate"
    },
    {
        quote: "Their vision for light and space completely changed how we live in our home.",
        author: "Marcus Thorne"
    }
];

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
                <div className="max-w-5xl mx-auto text-center">
                    <div className="relative min-h-[300px] md:min-h-[200px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${index === activeIndex
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                                    }`}
                                style={{
                                    pointerEvents: index === activeIndex ? "auto" : "none",
                                    visibility: index === activeIndex ? "visible" : "hidden"
                                }}
                            >
                                <h3 className="text-3xl md:text-5xl font-serif italic text-black leading-tight mb-8">
                                    &quot;{testimonial.quote}&quot;
                                </h3>
                                <p className="text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
                                    {testimonial.author}
                                </p>
                            </div>
                        ))}
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
