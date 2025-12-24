import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Starwood Interiors",
  description:
    "We would love to hear from you. Fill out the form below or use our contact details to get in touch. Our team is ready to assist you with any inquiries about our designs and services.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
