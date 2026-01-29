import type { Metadata } from "next";
import Image from "@/components/ui/SkeletonImage";
import Link from "next/link";
import ServiceHeader from "@/components/services/ServiceHeader";
import { ArrowRightIcon } from "lucide-react";
import { SERVICES_DATA } from "@/lib/services-data";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Our Expertise | Services - Starwood Interiors",
  description: "Explore our comprehensive interior design services including residential, commercial, 3D rendering, and joinery solutions.",
};

export default function ExpertisePage() {


  return (
    <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
      {/* Service Header Banner */}
      <ServiceHeader />

      <main className="relative z-10">

        {/* Services Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-24">

              {SERVICES_DATA.map((service, index) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`service-card group cursor-pointer block ${index % 2 === 1 ? 'md:mt-16' : ''}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-8">
                    <Image
                      alt={service.listingTitle}
                      className="w-full h-full object-cover transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                      src={service.listingImage}
                      width={800}
                      height={1000}
                      unoptimized
                    />
                    <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-3xl font-serif text-stone-900 mb-4">{service.listingTitle}</h3>
                    <p className="text-stone-500 font-light leading-relaxed mb-6">
                      {service.listingDescription}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                      Explore Service <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </div>
  );
}
