"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getAvatarHexColor } from "@/lib/utils";
import { z } from "zod";

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using Zod
    const validationResult = contactFormSchema.safeParse({
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("leads")
        .insert({
          name: validationResult.data.name,
          email: validationResult.data.email,
          message: validationResult.data.message,
          source: "contact_form",
          status: "new",
          avatar_color: getAvatarHexColor(validationResult.data.name),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success(
        "Thank you for contacting us! We'll get back to you soon.",
        {
          style: {
            backgroundColor: "white",
            color: "#111827",
            border: "1px solid #e5e7eb",
            zIndex: 99999,
          },
          duration: 5000,
        }
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again.";
      toast.error(errorMessage, {
        style: {
          backgroundColor: "white",
          color: "#111827",
          border: "1px solid #e5e7eb",
          zIndex: 99999,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="bg-background-light text-[#1c1917] font-display overflow-x-hidden">
      {/* Header Banner */}
      <header className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/contact-banner.png"
            alt="Starwood Interiors"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white text-6xl md:text-9xl font-serif font-light leading-none tracking-tight mb-8">
              Direct Engagement
            </h2>
            <p className="text-white/90 uppercase tracking-[0.4em] text-sm font-semibold">
              A Minimalist Communications Console
            </p>
          </div>
        </div>
      </header>

      {/* Direct Console Section */}
      <section className="py-32 md:py-48 bg-white" id="direct-console">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40">
            <div className="space-y-24">
              {/* Global Studios */}
              <div>
                <span className="block text-sm uppercase tracking-[0.5em] text-gray-400 mb-12 border-l-2 border-black pl-4">
                  Global Studios
                </span>
                <div className="grid grid-cols-1 gap-16">
                  <div className="group">
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-6 text-black">
                      Manhattan
                    </h4>
                    <p className="text-lg md:text-xl text-stone-600 font-light leading-tight space-y-2">
                      142 Wooster Street
                      <br />
                      Soho, New York 10012
                      <br />
                      <span className="block mt-4 font-normal text-black">
                        +1 212 555 0199
                      </span>
                    </p>
                  </div>
                  <div className="group">
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-6 text-black">
                      London
                    </h4>
                    <p className="text-lg md:text-xl text-stone-600 font-light leading-tight space-y-2">
                      48 Chiltern Street
                      <br />
                      Marylebone, London W1U 7QS
                      <br />
                      <span className="block mt-4 font-normal text-black">
                        +44 20 7946 0012
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Electronic Mail */}
              <div>
                <span className="block text-sm uppercase tracking-[0.5em] text-gray-400 mb-12 border-l-2 border-black pl-4">
                  Electronic Mail
                </span>
                <div className="space-y-12">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-stone-400 mb-3 font-semibold">
                      General Correspondence
                    </p>
                    <a
                      className="text-3xl md:text-5xl font-serif text-black hover:text-stone-400 transition-colors block"
                      href="mailto:hello@starwood.com"
                    >
                      hello@starwood.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-stone-400 mb-3 font-semibold">
                      Press & Media
                    </p>
                    <a
                      className="text-3xl md:text-5xl font-serif text-black hover:text-stone-400 transition-colors block"
                      href="mailto:press@starwood.com"
                    >
                      press@starwood.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Console Form */}
            <div>
              <span className="block text-sm uppercase tracking-[0.5em] text-gray-400 mb-16 border-l-2 border-black pl-4">
                Inquiry Console
              </span>
              <form className="space-y-16" onSubmit={handleSubmit}>
                <div className="group relative">
                  <label
                    className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2 font-bold"
                    htmlFor="name"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-stone-200 py-6 px-0 focus:ring-0 focus:outline-none focus:border-stone-200 transition-colors text-xl md:text-2xl font-light placeholder:text-stone-200"
                    id="name"
                    name="name"
                    placeholder=""
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm mt-2 block">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="group relative">
                  <label
                    className="block text-xs uppercase tracking-[0.3em] text-stone-400  font-bold"
                    htmlFor="email"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-stone-200 py-6 px-0 focus:ring-0 focus:outline-none focus:border-stone-200 transition-colors text-xl md:text-2xl font-light placeholder:text-stone-200"
                    id="email"
                    name="email"
                    placeholder=""
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-2 block">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="group relative">
                  <label
                    className="block text-xs uppercase tracking-[0.3em] text-stone-400 mb-2 font-bold"
                    htmlFor="message"
                  >
                    Your Vision <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full bg-transparent border-0 border-b-2 border-stone-200 py-6 px-0 focus:ring-0 focus:outline-none focus:border-stone-200 transition-colors text-xl md:text-2xl font-light placeholder:text-stone-200 resize-none"
                    id="message"
                    name="message"
                    placeholder="Describe the project..."
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  {errors.message && (
                    <span className="text-red-500 text-sm mt-2 block">
                      {errors.message}
                    </span>
                  )}
                </div>
                <div className="pt-8">
                  <button
                    className="w-full md:w-auto px-16 py-8 bg-black text-white text-sm uppercase tracking-[0.4em] font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Initialize Inquiry"}
                    <span className="material-symbols-outlined text-2xl">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Discovery Section */}
      <section
        className="py-32 md:py-48 bg-stone-50 border-y border-stone-100"
        id="discovery"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-6xl md:text-8xl font-serif text-black leading-[0.9] tracking-tight">
                Studio
                <br />
                Discovery
              </h2>
              <p className="mt-12 text-xl text-stone-500 font-light max-w-sm leading-relaxed">
                Systematic transparency regarding our architectural methodology
                and engagement protocols.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-0">
              <details className="discovery-topic group">
                <summary className="cursor-pointer border-b border-stone-200 py-12 flex items-center justify-between hover:bg-black/5 transition-colors px-4">
                  <span className="text-2xl md:text-3xl font-serif font-light text-black">
                    Methodology
                  </span>
                  <span className="material-symbols-outlined expand-icon text-3xl text-stone-300">
                    add
                  </span>
                </summary>
                <div className="discovery-topic-content px-4">
                  <div className="py-12 text-lg font-light text-stone-600 leading-relaxed max-w-2xl">
                    We approach each project as a unique architectural dialogue.
                    Our method prioritizes the manipulation of natural light and
                    the selection of raw, authentic materials to create spaces
                    that breathe.
                  </div>
                </div>
              </details>

              <details className="discovery-topic group">
                <summary className="cursor-pointer border-b border-stone-200 py-12 flex items-center justify-between hover:bg-black/5 transition-colors px-4">
                  <span className="text-2xl md:text-3xl font-serif font-light text-black">
                    Timeline
                  </span>
                  <span className="material-symbols-outlined expand-icon text-3xl text-stone-300">
                    add
                  </span>
                </summary>
                <div className="discovery-topic-content px-4">
                  <div className="py-12 text-lg font-light text-stone-600 leading-relaxed max-w-2xl">
                    Quality requires precision. A typical interior architecture
                    commission spans from 12 to 18 months, ensuring every custom
                    element is executed to our exacting standards.
                  </div>
                </div>
              </details>

              <details className="discovery-topic group">
                <summary className="cursor-pointer border-b border-stone-200 py-12 flex items-center justify-between hover:bg-black/5 transition-colors px-4">
                  <span className="text-2xl md:text-3xl font-serif font-light text-black">
                    Management
                  </span>
                  <span className="material-symbols-outlined expand-icon text-3xl text-stone-300">
                    add
                  </span>
                </summary>
                <div className="discovery-topic-content px-4">
                  <div className="py-12 text-lg font-light text-stone-600 leading-relaxed max-w-2xl">
                    From conceptual design through to construction oversight and
                    final styling, Starwood offers comprehensive project
                    management for a seamless global experience.
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
