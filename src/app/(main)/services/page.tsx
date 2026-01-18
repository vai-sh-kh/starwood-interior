import type { Metadata } from "next";
import Image from "next/image";
import ServiceHeader from "@/components/services/ServiceHeader";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Expertise | Starwood Services",
  description:
    "Crafting bespoke private sanctuaries that blend timeless elegance with modern functionality, tailored to the unique narratives of our clients.",
};

export default function ExpertisePage() {
  return (
    <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
      {/* Service Header Banner */}
      <ServiceHeader />

      <main className="relative z-10">

        {/* Services Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-24">

              {/* Service 1 - Residential Interiors */}
              <div className="service-card group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="Residential Interiors"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="/images/service-residential.webp"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">01</span>
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">Residential Interio Designs</h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    We provide comprehensive residential interior design services across major city hotspots in Trivandrum, with a strong focus on long-term value, functionality, and aesthetics.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Service 2 - Commercial & Retail */}
              <div className="service-card group cursor-pointer md:mt-16">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="Commercial & Retail"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="/images/service-commercial.webp"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">02</span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">Commercial Interior Design.</h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    We offer comprehensive commercial interior design service across major business hubs in
                    Trivandrum. Since 2015, we have partnered with offices, retail spaces, and commercial
                    establishments across Kazhakkoottam, Pattom, Kowdiar, and nearby locations to deliver
                    interiors that support daily operations and long-term business needs.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 hover:text-underline inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Service 3 - 3D Visualization */}
              <div className="service-card group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="3D Architectural Visualization"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="/images/about-service-1.webp"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">03</span>
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">3D Interior Rendering</h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Starwood Interiors offers professional 3D rendering services in Kerala to help homeowners,
                    architects, and businesses visualise spaces before execution. Our realistic 3D renders provide
                    accurate previews of interiors, layouts, lighting, and finishes, enabling clients to make confident
                    design decisions.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Service 4 - Furniture Curation */}
              <div className="service-card group cursor-pointer md:mt-16">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="Bespoke Furniture"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAC1XpVbQROpafFZQbWdWo84urD1YLvXUJAaHg7_7028wWSu4V5sph6wFeeNj6AjrcgS0ue2N-GFmTrPeX9G12CUsVRgdmoTgF-cZVsLguioRul25j3pAhGg7u9tJVH_PEXijP9-F1eCyqyNIUaU8yvO-AFnOPpwzpNme4LcAxp6Akue1MvOFeDdtJbmVWJCBR9XiZr_TMUzOHVbeJWOaWWIlpum8hf3yv66pCCXuHJPILfPfJGXHifB7RtNEaPG5fdNCINmRwASL1"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">04</span>
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">Joinery Shop Drawings</h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Starwood Interiors provides detailed and accurate joinery shop drawing services across
                    Kerala, supporting interior designers, architects, contractors, and homeowners with
                    execution-ready technical drawings.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Service 5 - Renovation */}
              <div className="service-card group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="Renovation Services"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="/images/about-service-1.webp"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">05</span>
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">Fit-Out Shop Drawings </h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Starwood Interiors provides detailed fit-out shop drawing solutions across Kerala, helping
                    interior projects move from concept to execution with complete technical clarity.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Service 6 - Landscape */}
              <div className="service-card group cursor-pointer md:mt-16">
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <Image
                    alt="Landscape Design"
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[10px]"
                    src="/images/service-residential.webp"
                    width={800}
                    height={1000}
                    unoptimized
                  />
                  <span className="absolute top-6 left-6 text-sm font-light tracking-widest text-white mix-blend-difference">06</span>
                </div>
                <div className="max-w-md">
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">Interior Floor Plans</h3>
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Starwood Interiors provides accurate and well-planned interior floor plan services across
                    Kerala, helping interior projects achieve better space utilisation, functional flow, and execution
                    clarity.
                  </p>
                  <a className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900 inline-flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                    Explore Service <ArrowRightIcon />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gray-200">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
            <h3 className="text-4xl md:text-5xl font-serif italic text-stone-900 leading-tight mb-12">
              Begin your design journey <br /> with a consultation.
            </h3>
            <a
              className="inline-block border border-stone-900 px-16 py-6 text-sm uppercase tracking-widest font-semibold hover:bg-stone-900 hover:text-white transition-colors duration-300"
              href="/contact"
            >
              Get a free consultation
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
