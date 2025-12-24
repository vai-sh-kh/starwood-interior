"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { IMAGES } from "@/lib/constants";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

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

  // Auto-slider effect
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const changeTestimonial = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % TESTIMONIALS.length;
      changeTestimonial(nextIndex);
    }, 5000); // Change every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const lenis = (
      window as {
        lenis?: {
          on: (event: string, handler: () => void) => void;
          off: (event: string, handler: () => void) => void;
          scroll: number;
        };
      }
    ).lenis;
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

      // Parallax for left side (desktop only)
      if (leftRef.current && window.innerWidth >= 768) {
        const translateY = (scrollProgress - 0.5) * 30;
        leftRef.current.style.transform = `translateY(${translateY}px)`;
      }

      // Parallax for right side (opposite) (desktop only)
      if (rightRef.current && window.innerWidth >= 768) {
        const translateY = (scrollProgress - 0.5) * -25;
        rightRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  const goToNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const nextIndex = (currentIndexRef.current + 1) % TESTIMONIALS.length;
    changeTestimonial(nextIndex);
    intervalRef.current = setInterval(() => {
      const autoNextIndex = (currentIndexRef.current + 1) % TESTIMONIALS.length;
      changeTestimonial(autoNextIndex);
    }, 5000);
  };

  const goToPrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const prevIndex =
      (currentIndexRef.current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    changeTestimonial(prevIndex);
    intervalRef.current = setInterval(() => {
      const autoNextIndex = (currentIndexRef.current + 1) % TESTIMONIALS.length;
      changeTestimonial(autoNextIndex);
    }, 5000);
  };

  const testimonial = TESTIMONIALS[currentIndex];
  const progressPercentage = ((currentIndex + 1) / TESTIMONIALS.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="bg-transparent md:bg-[#111111] text-white  md:py-4 rounded-[3rem] lg:rounded-t-[4rem] relative overflow-hidden lg:mx-4"
    >
      {/* Mobile View - Below md */}
      <div className="md:hidden w-full max-w-[360px] mx-auto relative overflow-hidden bg-[#111111] rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-gray-800 py-4">
        <div className="px-5 pt-5 pb-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2 opacity-60">
            <Quote className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase font-display text-white">
              Testimonials
            </span>
          </div>

          <h1 className="text-xl font-display font-medium leading-tight mb-2 text-white">
            Hear from those who&apos;ve{" "}
            <span className="text-gray-400">built with us</span>
          </h1>

          <p className="text-xs text-gray-400 leading-relaxed mb-5">
            Real client stories — sharing their experience with our team. From
            start to finish, we focus on quality and making the process
            worry-free.
          </p>

          {/* Quote */}
          <div className="relative w-full mb-4">
            <div className="mb-4 relative pl-1">
              <span className="absolute -top-2 -left-3 text-4xl text-gray-700 opacity-20 font-serif leading-none">
                &ldquo;
              </span>
              <p className="text-sm font-medium leading-relaxed text-gray-200 relative z-10 pl-2">
                {testimonial.quote}
              </p>
            </div>

            {/* Image */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-lg mb-4 group">
              <Image
                src={IMAGES.testimonials[testimonial.imageKey]}
                alt={`Portrait of ${testimonial.name}`}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2.5 rounded-lg text-left shadow-lg">
                <h3 className="text-white font-semibold text-sm">
                  {testimonial.name}
                </h3>
                <p className="text-gray-300 text-[10px] tracking-wider uppercase mt-0.5">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2 flex-shrink-0">
                <button
                  aria-label="Previous testimonial"
                  onClick={goToPrevious}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  aria-label="Next testimonial"
                  onClick={goToNext}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-white/20"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="flex items-center gap-3 flex-1 justify-end pl-4 min-w-0">
                <div className="h-[2px] bg-gray-800 flex-1 relative rounded-full overflow-hidden min-w-[60px]">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="font-mono text-[10px] text-gray-500 tracking-wider whitespace-nowrap flex-shrink-0">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(TESTIMONIALS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - md and above */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-4 md:p-8 lg:p-20 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
            {/* Left Side */}
            <div
              ref={leftRef}
              className={`relative transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="absolute -top-10 -left-6 text-8xl font-serif text-white/5 font-bold z-0">
                &ldquo;
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 block mb-6">
                  — Testimonials
                </span>
                <h2 className="text-3xl lg:text-[2.5rem] leading-tight font-display text-white mb-8">
                  Hear from those who&apos;ve <br /> built with us
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-md">
                  Real client stories — sharing their experience with our team.
                  From start to finish, we focus on quality and making the
                  process worry-free.
                </p>
              </div>

              {/* Client Image */}
              <div className="relative w-full max-w-full md:max-w-xs h-40 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mt-6">
                <Image
                  src={IMAGES.testimonials[testimonial.imageKey]}
                  alt={testimonial.name}
                  fill
                  className={`object-cover transition-all duration-500 ease-in-out ${
                    isTransitioning
                      ? "opacity-0 scale-105 translate-x-4"
                      : "opacity-100 scale-100 translate-x-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div
                  key={`info-${currentIndex}`}
                  className={`absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 transition-all duration-500 ease-in-out ${
                    isTransitioning
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Quote */}
            <div
              ref={rightRef}
              className={`flex flex-col h-full justify-center pt-8 lg:pt-0 transition-all duration-1000 ease-out delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative mb-12">
                <Quote className="w-16 h-16 text-white/30 absolute -top-10 -left-6" />
                <blockquote
                  key={currentIndex}
                  className={`text-2xl lg:text-4xl font-display text-white leading-[1.3] relative z-10 font-light transition-all duration-500 ease-in-out pl-4 ${
                    isTransitioning
                      ? "opacity-0 translate-y-8 scale-95"
                      : "opacity-100 translate-y-0 scale-100"
                  }`}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 min-h-[48px] w-full">
                <button
                  onClick={goToPrevious}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-white/5 flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="h-px bg-white/10 grow ml-8 min-w-[60px]"></div>
                <span className="text-white/40 text-xs font-mono whitespace-nowrap flex-shrink-0">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(TESTIMONIALS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
