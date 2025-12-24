"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import { CONTACT_CONTENT, IMAGES, STATS } from "@/lib/constants";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getAvatarColorClass } from "@/lib/utils";
import { z } from "zod";

// Zod validation schema
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: z
    .string()
    .min(1, "Email address is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .min(5, "Email address is too short")
    .max(255, "Email address must be less than 255 characters")
    .refine(
      (email: string) => {
        // Check for consecutive dots
        if (email.includes("..")) return false;

        // Check for dot at start or end of local part
        const [localPart] = email.split("@");
        if (!localPart || localPart.length === 0) return false;
        if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

        // Check for valid domain
        const domain = email.split("@")[1];
        if (!domain || domain.length < 3) return false;
        if (!domain.includes(".")) return false;

        // Check domain doesn't start or end with dot or hyphen
        if (domain.startsWith(".") || domain.endsWith(".")) return false;
        if (domain.startsWith("-") || domain.endsWith("-")) return false;

        // Check for valid TLD (top-level domain should be at least 2 characters)
        const domainParts = domain.split(".");
        const tld = domainParts[domainParts.length - 1];
        if (!tld || tld.length < 2) return false;

        // Check that domain parts don't start or end with hyphen
        for (const part of domainParts) {
          if (part.startsWith("-") || part.endsWith("-")) return false;
        }

        return true;
      },
      {
        message: "Please enter a valid email address",
      }
    ),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      "Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses"
    )
    .min(10, "Phone number must be at least 10 digits")
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      {
        message: "Phone number must contain between 10 and 15 digits",
      }
    ),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
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

      // Show first error in toast
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message, {
        style: {
          backgroundColor: "white",
          color: "#111827",
          border: "1px solid #e5e7eb",
          zIndex: 99999,
        },
      });
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Sending your message...", {
      style: {
        backgroundColor: "white",
        color: "#111827",
        border: "1px solid #e5e7eb",
        zIndex: 99999,
      },
    });

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("leads")
        .insert({
          name: validationResult.data.fullName,
          email: validationResult.data.email,
          phone: validationResult.data.phone,
          message: validationResult.data.message,
          source: "contact_form",
          status: "new",
          avatar_color: getAvatarColorClass(validationResult.data.fullName),
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from insert");
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast with white styling and max z-index
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
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("Error submitting form:", error);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

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

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    // Validate individual field on blur by validating the entire form
    // but only showing error for the blurred field
    const testData = {
      ...formData,
      [fieldName]: value,
    };

    const validationResult = contactFormSchema.safeParse({
      fullName: testData.fullName.trim(),
      email: testData.email.trim(),
      phone: testData.phone.trim(),
      message: testData.message.trim(),
    });

    if (!validationResult.success) {
      // Find error for this specific field
      const fieldError = validationResult.error.issues.find(
        (issue) => issue.path[0] === fieldName
      );
      if (fieldError) {
        setErrors({
          ...errors,
          [fieldName]: fieldError.message,
        });
      }
    } else {
      // Clear error if validation passes for this field
      if (errors[fieldName]) {
        setErrors({
          ...errors,
          [fieldName]: undefined,
        });
      }
    }
  };

  return (
    <>
      <PageContainer>
        <main className="py-6 sm:py-8 md:py-12 lg:py-16">
          {/* Hero Section */}
          <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[65vh] rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 md:mb-16 lg:mb-24">
            <Image
              alt="A luxurious and minimalist living room interior with modern furniture and neutral tones."
              src={IMAGES.contact.hero}
              className="object-cover object-[60%_50%]"
              priority
              sizes="100vw"
              fill
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-16 z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 max-w-3xl leading-tight">
                {CONTACT_CONTENT.title}
              </h1>
              <p className="text-white/90  text-sm  sm:text-base max-w-2xl leading-relaxed">
                {CONTACT_CONTENT.description}
              </p>
            </div>
          </section>

          {/* Form and Contact Details Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-24">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-2 leading-tight">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
              <form
                className="flex flex-col gap-4 sm:gap-6"
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <label className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${
                        errors.fullName
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-200 focus-visible:ring-ring/50"
                      } bg-white px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-[3px] transition-all`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </span>
                    )}
                  </label>
                  <label className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-md border ${
                        errors.email
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-200 focus-visible:ring-ring/50"
                      } bg-white px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-[3px] transition-all`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>
                <div>
                  <label className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${
                        errors.phone
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-200 focus-visible:ring-ring/50"
                      } bg-white px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-[3px] transition-all`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </span>
                    )}
                  </label>
                </div>
                <div>
                  <label className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium mb-2">
                      Message <span className="text-red-500">*</span>
                    </span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full rounded-md border ${
                        errors.message
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-gray-200 focus-visible:ring-ring/50"
                      } bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-[3px] transition-all resize-none`}
                      placeholder="Type your message here..."
                    />
                    {errors.message && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </span>
                    )}
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white text-sm font-medium h-[44px] py-3 px-6 sm:px-8 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 touch-target disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">
                          sync
                        </span>
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <span className="material-symbols-outlined text-base">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4 sm:mb-6 leading-tight">
                  Contact Details
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gray-100 rounded-lg p-2.5 sm:p-3 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-dark text-lg sm:text-xl">
                        mail
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-primary-dark mb-1 text-sm sm:text-base">
                        Email
                      </p>
                      <a
                        className="text-gray-600 hover:text-primary-dark transition-colors text-sm sm:text-base break-all touch-target block py-1"
                        href={`mailto:${CONTACT_CONTENT.details.email}`}
                      >
                        {CONTACT_CONTENT.details.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gray-100 rounded-lg p-2.5 sm:p-3 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-dark text-lg sm:text-xl">
                        call
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-primary-dark mb-1 text-sm sm:text-base">
                        Phone
                      </p>
                      <a
                        className="text-gray-600 hover:text-primary-dark transition-colors text-sm sm:text-base touch-target block py-1"
                        href={`tel:${CONTACT_CONTENT.details.phone.replace(
                          /\s/g,
                          ""
                        )}`}
                      >
                        {CONTACT_CONTENT.details.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gray-100 rounded-lg p-2.5 sm:p-3 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-dark text-lg sm:text-xl">
                        location_on
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-primary-dark mb-1 text-sm sm:text-base">
                        Address
                      </p>
                      <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                        {CONTACT_CONTENT.details.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15778.123456789!2d76.9366!3d8.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbb805bbcd47%3A0x15439fab5c5c81cb!2sThiruvananthapuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Location map - Trivandrum"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Section */}
          <section className="mt-12 sm:mt-16 md:mt-24 lg:mt-32">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#33333324] rounded-xl p-4 sm:p-6"
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
            </div>
          </section>
        </main>

        <BottomNav />
      </PageContainer>

      <Footer />
    </>
  );
}
