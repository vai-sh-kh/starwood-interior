"use client";

import { useEffect, useRef, useState } from "react";
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
    const lenis = (window as any).lenis;
    if (!lenis) return;

    const handleScroll = (e: any) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + rect.height))
      );

      // Parallax for left side
      if (leftRef.current) {
        const translateY = (scrollProgress - 0.5) * 30;
        leftRef.current.style.transform = `translateY(${translateY}px)`;
      }

      // Parallax for right side (opposite)
      if (rightRef.current) {
        const translateY = (scrollProgress - 0.5) * -25;
        rightRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll({ scroll: lenis.scroll });

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  const changeTestimonial = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

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

  return (
    <section
      ref={sectionRef}
      className="bg-[#111111] text-white py-4 rounded-[3rem] mb-6 lg:rounded-t-[4rem] relative overflow-hidden mx-2 lg:mx-4 lg:mb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 lg:p-20 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
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
                From start to finish, we focus on quality and making the process
                worry-free.
              </p>
            </div>

            {/* Client Image */}
            <div className="relative w-full max-w-xs h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={IMAGES.testimonials[testimonial.imageKey]}
                alt={testimonial.name}
                className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
                  isTransitioning
                    ? "opacity-0 scale-105 translate-x-4"
                    : "opacity-100 scale-100 translate-x-0"
                }`}
                key={`image-${currentIndex}`}
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
              <span className="material-symbols-outlined text-6xl text-white/30 absolute -top-10 -left-6">
                format_quote
              </span>
              <blockquote
                key={currentIndex}
                className={`text-2xl lg:text-4xl font-display text-white leading-[1.3] relative z-10 font-light transition-all duration-500 ease-in-out ${
                  isTransitioning
                    ? "opacity-0 translate-y-8 scale-95"
                    : "opacity-100 translate-y-0 scale-100"
                }`}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 min-h-[48px]">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-white/5"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </button>
              <div className="h-px bg-white/10 grow ml-8"></div>
              <span className="text-white/40 text-xs font-mono whitespace-nowrap">
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
