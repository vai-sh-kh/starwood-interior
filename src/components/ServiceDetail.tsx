"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { IMAGES } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Share2, Star } from "lucide-react";
import { createRoot } from "react-dom/client";

interface Service {
  name: string;
  slug: string;
  image: string;
  alt: string;
  description: string;
}

interface ServiceDetailProps {
  service: Service;
}

// Map different side images for each service
const getServiceSideImages = (slug: string) => {
  const imageMap: Record<string, { main: string; grid: string[] }> = {
    "interior-styling": {
      main: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYBGRBeN0S04Y8WuYzNPCSOMwG0tElqyVFCubXuUsk97KrYrDMUarC1ApTMvEUdOGsCYJIQhHkKpeDv2H9Oi3AY8xTAGpLOOYm7Up7pvJWUINwuhbKMSwCrJ3fovphPJQXmmKuUwGu74zmLV1B5wNwBM3TSb_ZFfo5shk3WLrJyMBPMeW5nMDpCR7HCc4JzyDXzyTv_hIEpCUy_ptG42VUdsM9x4h_KukiTvFSdPIUT6-X0qEyssTDdtA1OVQ1zj1ulMnsPxP8GHc",
      grid: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCtJq5DmENOc8igtNDhHw7D-yWtxNshetZImbuEPPXvmZRmYuRgzj7q-t8E0OastiBS4aE0bT0AQjccq3u-Cv57LbbXtBTEjulijehLBs2OBhuCkt5xL7XN3c_BEp6Pmf5XEWnAh8noG57l3j0U7dr25HtDyD45FbV11_1MJnbid3MWrra2JvceNkrv7R8knkO3zo4QKsoHGvGhvn9d6Jz3elV0LylwpQZEjZ02g8wNp2saYqTSsorM-oSqJeBFpUWXIORizzvl4a8",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSMb2CsB4hxrOIXRG7F3T7HRxtwQSjhxx3X5bLRShO5_Zj3I-r268v4KrrE-66S-SBOQvD3USea5QEXLnjOPUAb49zEu0jll-Sq9VCSYuGLzCU6Xm-nLz1j1LiyuQBq790Ljg7XhEUPKjDAVl0nYmsqsqWDRjGF02h6L9smeP5xmUDPKEBF_xjhUpTrVrkT1BxWBN9uQbE-Fl1OPgCaxzIF1v4mDtKMsEnEbcMRtJZgHxhq_LTpCOwrRwGQrDIWKlC3CZP9nGzF5E",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4epu_zlx6sOfOd19SFEcThg-ZSkak42MynEURL0B37LxeuQowmK96CbQe9vn_1W-Rkl2Kqh5bg1dz0elmycSSs1BXbxyT9DUgJ3HkIoi8rVa6WeSwlN73B0VGjxr8D668yTxgR1ys3gZVRSfGmR4-n5VURWaMF8r2GOScye9oodjoRklgOYe5NcPC1rI7l6QZtvVTALLDZh3gsdavUA7C04ncnQDdL9-ZWDTYd-aLB3doq1L1tLsGRZaBJ5oV_biFNJ5HvO-9ls",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAwO5RmnnuJvyNRI1ucDfUFORb7Aw8MoS8XTXfZ2RIVp9Uke9pdXeYPSIw6RHhPje7WzrAg5LFW9Jti2ZP1WXMrT0NDLzzaR1M47eOnAXqIGvbUee9XN05kb-MEPhIZ_Q3YygTnojnft0zpJMFEqM5gqVGDMZMOSfoXtLCoiU-YWCxbDlx1EvgwrZNcRwURHhKeDoEC62iwPl7ELEm49rZ_F4T_HjB3qo_obgJaqzwX2detpOf4__mw_HqnQUxIwZPKkv4BK0eJ9pg",
      ],
    },
    "kitchen-systems": {
      main: IMAGES.works.mondrian,
      grid: [
        IMAGES.works.nimia,
        IMAGES.works.artex,
        IMAGES.works.brera,
        IMAGES.works.aleaPro,
      ],
    },
    "custom-wardrobes": {
      main: IMAGES.works.nimia,
      grid: [
        IMAGES.works.mondrian,
        IMAGES.works.artex,
        IMAGES.works.aleaPro,
        IMAGES.works.nimiaII,
      ],
    },
    "furniture-curation": {
      main: IMAGES.works.artex,
      grid: [
        IMAGES.works.brera,
        IMAGES.works.mondrian,
        IMAGES.works.nimia,
        IMAGES.works.aleaPro,
      ],
    },
    "commercial-spaces": {
      main: IMAGES.works.brera,
      grid: [
        IMAGES.works.aleaPro,
        IMAGES.works.nimiaII,
        IMAGES.works.mondrian,
        IMAGES.works.artex,
      ],
    },
    "architectural-design": {
      main: IMAGES.works.aleaPro,
      grid: [
        IMAGES.works.nimiaII,
        IMAGES.works.brera,
        IMAGES.works.mondrian,
        IMAGES.works.nimia,
      ],
    },
  };

  return imageMap[slug] || imageMap["interior-styling"];
};

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const sideImages = getServiceSideImages(service.slug);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Extract first paragraph from description for quote
  const descriptionMatch = service.description.match(/<p>(.*?)<\/p>/);
  const quoteText = descriptionMatch
    ? descriptionMatch[1].replace(/<[^>]*>/g, "")
    : `Transform your living spaces into elegant, personalized sanctuaries with our comprehensive ${service.name.toLowerCase()} services.`;

  // Add image after "What We Offer" heading
  useEffect(() => {
    if (!descriptionRef.current) return;

    const roots: ReturnType<typeof createRoot>[] = [];

    const h2Elements = descriptionRef.current.querySelectorAll("h2");
    h2Elements.forEach((h2) => {
      if (h2.textContent?.trim() === "What We Offer") {
        // Check if image already exists
        if (h2.nextElementSibling?.classList.contains("what-we-offer-image")) {
          return;
        }

        // Create image container
        const imageContainer = document.createElement("div");
        imageContainer.className =
          "what-we-offer-image my-8 relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl";

        // Create inner wrapper for Image component with fill
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "relative w-full h-full";
        imageContainer.appendChild(imageWrapper);

        // Insert after the h2
        h2.parentNode?.insertBefore(imageContainer, h2.nextSibling);

        // Render Next.js Image component into the wrapper
        const root = createRoot(imageWrapper);
        roots.push(root);
        root.render(
          <>
            <Image
              src={sideImages.grid[0] || sideImages.main}
              alt={`${service.name} - What We Offer`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </>
        );
      }
    });

    // Cleanup function
    return () => {
      roots.forEach((root) => {
        root.unmount();
      });
    };
  }, [service.description, sideImages, service.name]);

  return (
    <div className="min-h-screen bg-background-light text-gray-800 font-body antialiased">
      {/* Hero Section */}
      <header className="relative pt-24 min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcENDP2w6i8b0OvG5_ZaeBxeX3eqGGY-P9nvn7qxkUQHlbhNQNfZlntBdw8Vk9k5peYUdgWnTTBoMYbntApUzL6G-QkUfCHsQZ11ZwWwqimPebCMEkBPO48lDlqaHPW3oUwUNFpJ61zXBtvExHAcJ5pABYkPNyb_RoJ_nyR_MrmkaEMIsql5uncB1R2jl6J2NT5BworFrBvc0t4_oaXZKtnbT1dN4e_iKfNf1AL1WU6XyfO6YSVRfmOop-RSK2Qyc29-hTwatb8gM"
            alt={service.alt}
            fill
            className="w-full h-full object-cover object-center scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>

        <div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight tracking-tight">
            {service.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto font-light tracking-wide leading-relaxed opacity-90">
            Premium design solutions tailored to your unique vision, creating
            spaces that breathe life into your home.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 bg-background-light -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-0 md:pb-1">
          {/* Back Button */}
          <div className="mb-12">
            <Link
              href="/services"
              className="inline-flex items-center group text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wide"
            >
              <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back to Services
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-20">
              {/* Quote Section */}
              <div>
                <p className="text-xl md:text-2xl leading-relaxed font-display text-gray-800 italic mb-6">
                  &quot;{quoteText}&quot;
                </p>

                {/* Mobile Image - Above Interior Styling Approach Section */}
                <div className="md:hidden mb-8 relative w-full h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={sideImages.main}
                    alt={service.name}
                    fill
                    className="w-full h-full object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                </div>

                <div
                  ref={descriptionRef}
                  className="service-description text-gray-600 leading-relaxed [&>p]:mb-6 [&>p]:leading-relaxed [&>h2]:text-4xl [&>h2]:font-display [&>h2]:font-medium [&>h2]:text-primary [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:first:mt-6"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>

              {/* Why Choose Section */}
              <section>
                <div className="bg-surface-light p-8 rounded-2xl border border-gray-100">
                  <h3 className="font-display text-2xl font-medium mb-4">
                    Why Choose ConsMart?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <span className="text-black mr-3">✓</span>
                      Award-winning design team with over 15 years of
                      experience.
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-black mr-3">✓</span>
                      Exclusive access to trade-only furniture and decor brands.
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-black mr-3">✓</span>
                      Comprehensive project management from concept to
                      completion.
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-black mr-3">✓</span>
                      Sustainable and eco-friendly design options available.
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Right Column - Images & CTA */}
            <div className="lg:col-span-5 space-y-6 md:space-y-12">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[4/3] group relative">
                <Image
                  src={sideImages.main}
                  alt="Service detail"
                  fill
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-display text-lg">
                    Detailed Texture Analysis
                  </p>
                </div>
              </div>

              {/* Grid Images */}
              <div className="grid grid-cols-2 gap-4">
                {sideImages.grid.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`Service gallery ${index + 1}`}
                      fill
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Card */}
              <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                  <svg
                    className="w-40 h-40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4 text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="font-display text-xl italic mb-6">
                    &quot;ConsMart completely transformed our home. The
                    attention to detail was impeccable, and the team truly
                    understood our style.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9usbNYoVkCUwIK_D5V4ZUjkS38DlNrwithfqWlpy4KNJeYb2l-J6EWozjHDk3bPC2tvc0eo7hlS-TRFvjSFix3cQuTEtVRcQi9eZYaX4CBYGEs8NVACic-xyw4wHz2o0z-uMNk7blizXlc8ODN7eiboQ9Bwd-yV31YRlO1KDC5NmaEsOUR4tR27KaW1wno_FTdwCv4jrtWoL-hWcMpBIJ3_21wW50k-lg4jBDb6tt0mH0ZrPaFfeylmgVhNSP0ZrFSoZQOFT96Zg"
                        alt="Client portrait"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sarah Jenkins</p>
                      <p className="text-xs text-gray-400">
                        Residential Client
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="sticky top-28 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <h3 className="text-2xl font-display font-bold text-primary mb-3">
                  Ready to transform your space?
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Let&apos;s discuss how we can bring your vision to life. Book
                  a free consultation today.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-4 px-6 bg-primary text-white rounded-xl hover:bg-black transition mb-4 group"
                >
                  <span className="font-medium">Contact Us</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
                    <Share2 className="mr-2 w-4 h-4" />
                    Share
                  </button>
                  <Link
                    href="/services"
                    className="text-sm font-medium text-gray-500 hover:text-primary transition"
                  >
                    View All Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
