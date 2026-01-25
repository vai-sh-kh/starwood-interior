"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/lib/constants";
import { IMAGES } from "@/lib/constants";

export default function ProjectsHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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
      on: (event: string, handler: () => void) => void;
      off: (event: string, handler: () => void) => void;
    }

    const lenis = (window as unknown as { lenis?: LenisInstance }).lenis;
    if (!lenis) return;

    const handleScroll = () => {
      if (headerRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;

        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - elementTop) / (windowHeight + rect.height)
          )
        );

        const translateY = (scrollProgress - 0.5) * 20;
        headerRef.current.style.transform = `translateY(${translateY}px)`;
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
      id="projects"
      className="max-w-7xl mx-auto  sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className={`flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-4">
            — Our Works
          </span>
          <h2 className="text-3xl lg:text-[2.5rem] leading-[1.2] font-display font-medium mb-4 text-black">
            Delivering impact through <br /> every structure we create
          </h2>
          <p className="text-gray-600 text-sm lg:text-[15px] font-light max-w-lg mt-4">
            Every project is a reflection of our dedication to quality,
            innovation, and purpose. From urban landmarks to essential community
            spaces — we build with integrity and intention.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
          </button>
          <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity group shadow-lg">
            <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            className={`group relative rounded-2xl overflow-hidden h-[420px] cursor-pointer shadow-md transition-all duration-1000 ease-out bg-stone-100 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Image
              src={IMAGES.projects[project.imageKey]}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>

            {/* New Badge */}
            {project.isNew && (
              <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                New
              </div>
            )}

            {/* Arrow Icon */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/10 rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="material-symbols-outlined text-white text-sm transform -rotate-45">
                arrow_forward
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-white text-xl font-bold mb-2 leading-snug">
                {project.title}
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-5 opacity-80">
                {project.description}
              </p>
              <div className="flex gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 backdrop-blur-md text-white/90 text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
