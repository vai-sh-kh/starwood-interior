import type { Metadata } from "next";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactCTA from "@/components/contact/ContactCTA";

export const metadata: Metadata = {
    title: "Contact Us | Starwood Interiors",
    description:
        "Get in touch with Starwood Interiors. We'd love to hear about your project. Contact us for interior design consultations, quotes, and inquiries.",
};

export default function ContactPage() {
    return (
        <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
            <ContactHeader />
            <ContactForm />
            <ContactInfo />
            <ContactMap />
            <ContactCTA />
        </div>
    );
}
