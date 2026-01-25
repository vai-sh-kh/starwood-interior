"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { SERVICES_DATA } from "@/lib/services-data";

export default function ServicesShowcase() {
    const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

    // Get first 4 services
    const services = SERVICES_DATA.slice(0, 4);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
                        — Our Services —
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mt-4 mb-6">
                        What We Do
                    </h2>
                    <p className="text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                        From residential to commercial spaces, we deliver comprehensive interior solutions
                        tailored to your vision and requirements.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
                    {services.map((service, index) => (
                        <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="service-card group cursor-pointer block"
                        >
                            <div className="relative aspect-square overflow-hidden mb-6 bg-stone-200">
                                {!imageLoaded[service.slug] && (
                                    <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                                )}
                                <Image
                                    alt={service.listingTitle}
                                    className={`w-full h-full object-cover transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px] ${imageLoaded[service.slug] ? "opacity-100" : "opacity-0"
                                        }`}
                                    src={service.listingImage}
                                    width={800}
                                    height={1000}
                                    unoptimized
                                    onLoad={() =>
                                        setImageLoaded((prev) => ({ ...prev, [service.slug]: true }))
                                    }
                                />
                                <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <div className="">
                                <h3 className="text-xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors">
                                    {service.listingTitle}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Services Button */}
                <div className="text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white text-sm uppercase tracking-[0.2em] font-semibold hover:bg-stone-800 transition-colors"
                    >
                        View All Services
                        <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
