import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

// Add styles for service content
const serviceContentStyles = `
  .service-content {
    font-size: 1.125rem;
    line-height: 1.75;
  }
  .service-content p {
    margin-bottom: 1.5rem;
    color: #4b5563;
  }
  .service-content h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    line-height: 1.3;
    font-family: var(--font-display-serif), serif;
  }
  .service-content h2:first-of-type {
    margin-top: 0;
  }
  .service-content p:last-child {
    margin-bottom: 0;
  }
`;

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

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: serviceContentStyles }} />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        {/* Hero Section */}
        <div className="relative pt-20">
          <div className="absolute inset-0 z-0 h-[500px] w-full">
            <Image
              src={
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAcENDP2w6i8b0OvG5_ZaeBxeX3eqGGY-P9nvn7qxkUQHlbhNQNfZlntBdw8Vk9k5peYUdgWnTTBoMYbntApUzL6G-QkUfCHsQZ11ZwWwqimPebCMEkBPO48lDlqaHPW3oUwUNFpJ61zXBtvExHAcJ5pABYkPNyb_RoJ_nyR_MrmkaEMIsql5uncB1R2jl6J2NT5BworFrBvc0t4_oaXZKtnbT1dN4e_iKfNf1AL1WU6XyfO6YSVRfmOop-RSK2Qyc29-hTwatb8gM"
              }
              alt={service.alt}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[500px] flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-display-serif font-bold text-white mb-4 leading-tight">
              {service.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl font-light tracking-wide font-body">
              Premium design solutions tailored to your unique vision
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 md:pt-12 relative z-20 bg-background-light -mt-16 rounded-t-3xl md:mt-0 md:bg-transparent md:rounded-none">
          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm h-[400px] relative">
            <Image
              src={service.image}
              alt={service.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-600">
            <div
              className="service-content leading-relaxed mb-12 text-lg"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </div>
        </main>

        <BottomNav />
        <Footer />
      </div>
    </>
  );
}
