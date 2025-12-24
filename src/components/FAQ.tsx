"use client";

import { useEffect, useRef, useState } from "react";
import { FAQS } from "@/lib/constants";

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);
  const sectionRef = useRef<HTMLElement>(null);
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

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side */}
        <div
          className={`lg:col-span-4 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-4">
            — Q & A
          </span>
          <h2 className="text-3xl lg:text-[2.5rem] leading-tight font-display font-medium mb-6 text-black">
            Got Questions? <br /> We&apos;ve Got You Covered.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
            Find quick answers to some of the most common inquiries about our
            services, process, and what it&apos;s like to build with us.
          </p>
          <a
            href="#"
            className="text-black font-bold text-sm underline decoration-2 underline-offset-4 hover:text-primary transition-colors"
          >
            View all FAQs
          </a>
        </div>

        {/* Right Side - Accordion */}
        <div
          className={`lg:col-span-8 lg:pl-10 transition-all duration-1000 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            {FAQS.map((faq, index) => (
              <div
                key={faq.id}
                className={`border-b border-gray-200 pb-6 transition-all duration-1000 ease-out ${
                  index > 0 ? "pt-2" : ""
                } group cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xl font-medium transition-colors ${
                      openId === faq.id
                        ? "text-black"
                        : "text-gray-900 group-hover:text-primary"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                    <span
                      className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                        openId === faq.id
                          ? "rotate-45"
                          : "group-hover:rotate-45"
                      }`}
                    >
                      add
                    </span>
                  </span>
                </div>
                {openId === faq.id && faq.answer && (
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed max-w-2xl animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
