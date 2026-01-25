"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SERVICES_LIST } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function ServiceHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    interface LenisInstance {
      scroll: number;
      on: (event: string, callback: (e: { scroll: number }) => void) => void;
      off: (event: string, callback: (e: { scroll: number }) => void) => void;
    }
    const lenis = (window as unknown as { lenis?: LenisInstance }).lenis;
    if (!lenis) return;

    const handleScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + rect.height))
      );

      // Parallax for left image
      if (leftImageRef.current) {
        const translateY = (scrollProgress - 0.5) * 60;
        const translateX = (scrollProgress - 0.5) * -30;
        leftImageRef.current.style.transform = `translateY(${translateY}px) translateX(${translateX}px) rotate(-6deg)`;
      }

      // Parallax for right image (opposite direction)
      if (rightImageRef.current) {
        const translateY = (scrollProgress - 0.5) * -50;
        const translateX = (scrollProgress - 0.5) * 25;
        rightImageRef.current.style.transform = `translateY(${translateY}px) translateX(${translateX}px) rotate(3deg)`;
      }

      // Parallax for services list
      if (servicesRef.current) {
        const translateY = (scrollProgress - 0.5) * 30;
        servicesRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-primary text-white py-12 md:py-24 rounded-4xl lg:rounded-t-[4rem] relative overflow-hidden "
    >
      {/* Background Pattern */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-8 md:mb-16 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
            — How we work —
          </span>
        </div>

        {/* Services List */}
        <div className="relative  flex items-center justify-center py-6 md:py-10">
          <div
            ref={servicesRef}
            className="flex flex-col items-center space-y-4 md:space-y-6 lg:space-y-8 text-center z-20 w-full transition-transform duration-300 ease-out"
          >
            {SERVICES_LIST.map((service, index) => (
              <div
                key={service.title}
                className={`group w-full text-center relative transition-all duration-1000 ease-out px-4 ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3
                  className={`text-2xl md:text-4xl lg:text-[4.5rem] font-display transition-all duration-300 cursor-pointer font-light tracking-tight leading-[1.2] md:leading-[1.3] lg:leading-[1.2] ${service.active
                      ? "text-white relative inline-block"
                      : "text-white/30 group-hover:text-white"
                    }`}
                >
                  {service.title}
                  {service.count && (
                    <span className="absolute -right-8 -top-2 lg:-right-12 lg:top-2 text-xs lg:text-sm text-primary font-sans font-medium tracking-widest">
                      ({service.count})
                    </span>
                  )}
                </h3>
              </div>
            ))}
          </div>

          {/* Left Image */}
          <div
            ref={leftImageRef}
            className="absolute left-4 lg:left-10 top-1/4 w-48 lg:w-64 h-32 lg:h-44 rounded-xl overflow-hidden shadow-2xl transform -rotate-6 opacity-0 lg:opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-500 hidden md:block border-4 border-white/5 bg-stone-800"
          >
            <Image
              src={IMAGES.services.left}
              alt="Construction work"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Image */}
          <div
            ref={rightImageRef}
            className="absolute right-4 lg:right-10 bottom-1/4 w-56 lg:w-72 h-36 lg:h-48 rounded-xl overflow-hidden shadow-2xl transform rotate-3 opacity-0 lg:opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-500 hidden md:block border-4 border-white/5 bg-stone-800"
          >
            <Image
              src={IMAGES.services.right}
              alt="Construction site"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
