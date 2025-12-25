"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { COLLECTIONS } from "@/lib/constants";
import Testimonials from "@/components/Testimonials";
import ProjectsHome from "@/components/ProjectsHome";
import FAQ from "@/components/FAQ";
import { useEffect, useRef, useState } from "react";
import ServiceHome from "@/components/serviceHome";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const modernStyleRef = useRef<HTMLElement>(null);
  const modernImageRef = useRef<HTMLDivElement>(null);
  const modernTextRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  // Intersection Observer for animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const createObserver = <T extends HTMLElement>(
      ref: React.RefObject<T | null>,
      key: string,
      threshold = 0.1
    ) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          });
        },
        {
          threshold,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      observer.observe(ref.current);
      observers.push(observer);
    };

    createObserver(heroRef, "hero", 0.2);
    createObserver(statsRef, "stats", 0.2);
    createObserver(modernStyleRef, "modernStyle", 0.2);
    createObserver(collectionRef, "collection", 0.1);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Parallax effects with Lenis
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;

    const handleScroll = () => {
      // Hero parallax
      if (heroContentRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - elementTop) / (windowHeight + rect.height)
          )
        );
        const translateY = (scrollProgress - 0.5) * 30;
        heroContentRef.current.style.transform = `translateY(${translateY}px)`;
      }

      // Modern Style section parallax
      if (
        modernImageRef.current &&
        modernTextRef.current &&
        modernStyleRef.current
      ) {
        const rect = modernStyleRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - elementTop) / (windowHeight + rect.height)
          )
        );

        const imageTranslateY = (scrollProgress - 0.5) * 40;
        const textTranslateY = (scrollProgress - 0.5) * -20;

        modernImageRef.current.style.transform = `translateY(${imageTranslateY}px)`;
        modernTextRef.current.style.transform = `translateY(${textTranslateY}px)`;
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          ref={heroRef}
          className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[800px] flex items-end p-4 sm:p-6 md:p-8 lg:p-12"
        >
          <Image
            alt="Spacious modern living room with a large grey sofa and expansive windows"
            src="/images/home-banner.png"
            fill
            className="object-cover "
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div
            ref={heroContentRef}
            className={`relative text-white max-w-lg z-10 transition-all duration-1000 ease-out ${
              isVisible.hero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight tracking-tight">
              Contemporary
            </h1>
            <p className="hidden md:block mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-white/90">
              Defining spaces that encompass modern aesthetics with timeless
              elegance, our contemporary interior designs create a harmonious
              blend, satisfying the essence of fine living.
            </p>
            <Link href="/services">
              <Button
                variant="default"
                className="mt-4 sm:mt-6 md:mt-8 bg-black/70 text-white text-sm font-medium min-h-[44px] py-3 px-5 sm:px-6 rounded-lg hover:bg-black touch-target transition-all duration-300"
              >
                View More{" "}
                <span className="material-symbols-outlined text-base ml-2">
                  arrow_forward
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PageContainer>
        <main className="w-full max-w-8xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 py-8 sm:py-12 md:py-16 lg:py-10">
          {/* Stats Section */}
          {/* <section
            ref={statsRef}
            className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
          >
            {STATS.map((stat, index) => (
              <div
                key={index}
                className={`bg-[#33333324] rounded-xl p-4 sm:p-6 transition-all duration-1000 ease-out ${
                  isVisible.stats
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333]">
                  {stat.value}
                  {stat.value === "1st" && (
                    <sup className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                      st
                    </sup>
                  )}
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1 sm:mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </section> */}

          {/* Modern Style Section - Image Left, Text Right */}
          <section
            ref={modernStyleRef}
            className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center"
          >
            <div
              ref={modernImageRef}
              className={`rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-1000 ease-out ${
                isVisible.modernStyle
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <Image
                alt="Elegant modern living room with a cream-colored sofa and large windows"
                src="/images/home-section-1.png"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div
              ref={modernTextRef}
              className={`transition-all duration-1000 ease-out delay-200 ${
                isVisible.modernStyle
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Elegance • Timeless
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#333333] mt-2 sm:mt-4 leading-tight">
                Modern Style
                <br />
                Timeless Charm
              </h3>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Discover Starwood Interiors&apos;s 2024 preview, featuring
                sofas, chairs, and armchairs embodying diverse
                lifestyles-concept, alongside dining tables, coffee tables, and
                sideboards.
              </p>
              <Link href="/about-us">
                <Button
                  variant="default"
                  className="mt-6 sm:mt-8 bg-[#333333] text-white text-sm font-medium min-h-[44px] py-3 px-6 rounded-lg flex items-center gap-2 hover:opacity-80 touch-target transition-all duration-300"
                >
                  About Us{" "}
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </Button>
              </Link>
            </div>
          </section>

          <ServiceHome />

          {/* Collection Section */}
          <section ref={collectionRef} className="w-full max-w-7xl mx-auto">
            <div
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 md:mb-12 lg:mb-16 gap-4 sm:gap-6 transition-all duration-1000 ease-out ${
                isVisible.collection
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#333333] leading-tight">
                  Explore Our Proudly
                  <br />
                  Collection
                </h3>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <Link href="/works">
                  <Button
                    variant="default"
                    className="hidden md:inline-flex bg-[#333333] text-white text-sm font-medium min-h-[44px] py-3 px-5 rounded-lg hover:opacity-80 touch-target transition-all duration-300"
                  >
                    View More{" "}
                    <span className="material-symbols-outlined text-sm align-middle ml-2">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-3 sm:mt-4 max-w-xs sm:max-w-md leading-relaxed">
                  Starwood Interiors will demonstrate its vision of contemporary
                  living at Salone del Mobile.Milano 2024, in its space at
                  Salone de Mobile.Milano 2024.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {COLLECTIONS.map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl sm:rounded-2xl overflow-hidden group aspect-4/5 transition-all duration-1000 ease-out ${
                    isVisible.collection
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <Image
                    alt={`${item.name} modern furniture collection`}
                    src={item.image}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-center text-white z-10">
                    <span className="text-base sm:text-lg md:text-xl font-bold">
                      {item.name}
                    </span>
                    <div className="bg-white/30 backdrop-blur-sm text-white rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center group-hover:scale-110 transition-transform touch-target">
                      <span className="material-symbols-outlined text-lg">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Testimonials />

          <ProjectsHome />

          <FAQ />
        </main>

        <BottomNav />
      </PageContainer>

      <Footer />
    </>
  );
}
