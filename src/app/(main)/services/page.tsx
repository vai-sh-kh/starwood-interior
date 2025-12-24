import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import { SERVICES, SERVICES_CONTENT, IMAGES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Starwood Interiors",
  description:
    "Crafting spaces that harmonize modern elegance with timeless design, our contemporary services bring creativity, comfort, and refined functionality to the home.",
};

export default function ServicesPage() {
  return (
    <>
      <PageContainer>
        <main className="py-8 sm:py-12 md:py-16 lg:py-24">
          {/* Services Grid Section */}
          <section className="mb-12 sm:mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10 md:mb-12 gap-6 sm:gap-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-md leading-tight">
                {SERVICES_CONTENT.section.title}
              </h3>
              <div className="flex flex-col items-start md:items-end gap-4">
                <p className="text-xs sm:text-sm max-w-xs text-text-light/70 text-left md:text-right leading-relaxed">
                  {SERVICES_CONTENT.section.description}
                </p>
                <Link
                  href="/contact"
                  className="bg-primary text-white text-xs sm:text-sm font-medium min-h-[44px] py-2.5 sm:py-3 px-4 sm:px-5 rounded-md flex items-center gap-1.5 hover:opacity-90 transition-opacity touch-target"
                >
                  View More
                  <span className="material-symbols-outlined text-sm sm:text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {SERVICES.map((service, index) => (
                <Link
                  key={index}
                  href={`/services/${service.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/5] block"
                >
                  <Image
                    alt={service.alt}
                    src={service.image}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-end">
                    <h4 className="text-white text-lg sm:text-xl font-semibold">
                      {service.name}
                    </h4>
                    <div className="bg-white/90 backdrop-blur-sm text-black rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center group-hover:scale-110 transition-transform touch-target">
                      <span className="material-symbols-outlined text-xl">
                        arrow_outward
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <BottomNav />
      </PageContainer>

      <Footer />
    </>
  );
}
