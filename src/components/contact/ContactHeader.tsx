"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactHeader() {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <header className="relative w-full h-[80vh] min-h-[600px] flex flex-col justify-end pb-24 overflow-hidden">
            {/* Loading skeleton */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'} z-0`}>
                <div className="w-full h-full bg-gray-300 animate-pulse" />
            </div>
            <Image
                src="/images/home/contact-banner.jpeg"
                alt="Contact Us"
                fill
                priority
                className={`object-cover object-center z-0 transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} hover:scale-105`}
                style={{ transitionDuration: imageLoaded ? '2000ms' : '700ms' }}
                onLoad={() => setImageLoaded(true)}
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
            {/* Content */}
            <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <p className="text-white/90 uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-xs font-bold mb-4 md:mb-6">
                        Starwood Interiors
                    </p>
                    <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic font-medium leading-[1.15] md:leading-[1.1] tracking-tight mb-6 md:mb-8 lg:mb-10">
                        Contact
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                        <p className="text-white/80 text-base md:text-lg font-light max-w-[400px] leading-relaxed">
                            Let's bring your vision to life. Get in touch with our team for consultations and project inquiries.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
