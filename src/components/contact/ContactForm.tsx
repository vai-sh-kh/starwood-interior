"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getAvatarHexColor } from "@/lib/utils";
import { z } from "zod";
import { Send, ArrowRight } from "lucide-react";
import { SERVICES_DATA } from "@/lib/services-data";

import { MultiSelect } from "@/components/ui/multi-select";

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
    phone: z
        .string()
        .min(1, "Phone number is required")
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9+\s()-]+$/, "Invalid phone number format"),
    message: z
        .string()
        .min(1, "Message is required")
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be less than 2000 characters"),
    serviceInterest: z.array(z.string()).optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        serviceInterest: [] as string[],
    });
    // List of services from constant
    const services = SERVICES_DATA.map(service => ({
        id: service.listingTitle, // Use title as ID since we want to store titles
        title: service.listingTitle
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form using Zod
        const validationResult = contactFormSchema.safeParse({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim(),
            serviceInterest: formData.serviceInterest,
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

            const { error } = await supabase
                .from("leads")
                .insert({
                    name: validationResult.data.name,
                    email: validationResult.data.email,
                    phone: validationResult.data.phone,
                    message: validationResult.data.message,
                    service_interest: validationResult.data.serviceInterest?.length ? validationResult.data.serviceInterest : null,
                    source: "contact_form",
                    status: "new",
                    avatar_color: getAvatarHexColor(validationResult.data.name),
                });

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
                phone: "",
                message: "",
                serviceInterest: [],
            });
        } catch (err: any) {
            console.error("Error submitting form:", err);
            const errorMessage = err?.message || "Failed to submit form. Please try again.";
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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

    const handleServiceChange = (selected: string[]) => {
        setFormData({
            ...formData,
            serviceInterest: selected
        });
    };


    return (
        <section className="py-24 bg-stone-50" id="contact-form">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left Column - Info */}
                    <div className="flex flex-col justify-center">
                        <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-6">
                            Send Us a Message
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-8 leading-tight">
                            Let&apos;s discuss your <span className="italic">project</span>
                        </h2>
                        <p className="text-stone-500 text-lg font-light leading-relaxed mb-10 max-w-lg">
                            Share your vision with us. Whether it&apos;s a complete home transformation
                            or a single room refresh, we&apos;re here to bring your ideas to life.
                        </p>

                        {/* Process Steps */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-sm font-semibold text-stone-700 shrink-0">
                                    01
                                </div>
                                <div>
                                    <h4 className="font-semibold text-stone-900 mb-1">Submit Your Inquiry</h4>
                                    <p className="text-stone-500 text-sm font-light">Fill out the form with your project details</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-sm font-semibold text-stone-700 shrink-0">
                                    02
                                </div>
                                <div>
                                    <h4 className="font-semibold text-stone-900 mb-1">We&apos;ll Reach Out</h4>
                                    <p className="text-stone-500 text-sm font-light">Our team will contact you within 24 hours</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-sm font-semibold text-stone-700 shrink-0">
                                    03
                                </div>
                                <div>
                                    <h4 className="font-semibold text-stone-900 mb-1">Free Consultation</h4>
                                    <p className="text-stone-500 text-sm font-light">Schedule a meeting to discuss your vision</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div>
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm"
                        >
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                                        Full Name *
                                    </label>
                                    <input
                                        name="name"
                                        placeholder="Enter your full name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border-0 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-900 transition-all text-[15px]"
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-2 block">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                                        Email Address *
                                    </label>
                                    <input
                                        name="email"
                                        placeholder="your@email.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border-0 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-900 transition-all text-[15px]"
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-xs mt-2 block">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                                        Phone Number *
                                    </label>
                                    <input
                                        name="phone"
                                        placeholder="+91 0000 000 000"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border-0 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-900 transition-all text-[15px]"
                                    />
                                    {errors.phone && (
                                        <span className="text-red-500 text-xs mt-2 block">
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>

                                {/* Service Interest Field */}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                                        Services of Interest (Optional)
                                    </label>
                                    <MultiSelect
                                        options={services}
                                        selected={formData.serviceInterest}
                                        onChange={handleServiceChange}
                                        placeholder="Select services..."
                                    />
                                </div>


                                {/* Message Field */}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-3 font-medium">
                                        Your Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        placeholder="Tell us about your project, requirements, and timeline..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-stone-50 border-0 rounded-xl px-5 py-4 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-900 transition-all text-[15px] resize-none"
                                    ></textarea>
                                    {errors.message && (
                                        <span className="text-red-500 text-xs mt-2 block">
                                            {errors.message}
                                        </span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-stone-900 text-white py-5 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

