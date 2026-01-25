import Link from "next/link";
import { Instagram, Facebook, Mail, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants/company";

export default function Footer() {
  return (
    <footer className="bg-black py-24 border-t border-stone-800" id="contact">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:justify-between gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex items-center">
              <h4 className="font-serif text-3xl font-bold text-white uppercase tracking-tighter">{COMPANY_INFO.name}</h4>
            </Link>
            <p className="text-sm text-stone-400 font-light leading-relaxed">
              Professional interior design services in Trivandrum. Custom home interiors, modular kitchens, and 3D design visualization.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href={COMPANY_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${COMPANY_INFO.contact.email}`}
                className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-white transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Company</h5>
            <div className="flex flex-col gap-4">
              <Link className="text-[15px] font-light text-stone-400 hover:text-white transition-colors" href="/about-us">About Us</Link>
              <Link className="text-[15px] font-light text-stone-400 hover:text-white transition-colors" href="/services">Services</Link>
              <Link className="text-[15px] font-light text-stone-400 hover:text-white transition-colors" href="/projects">Our Works</Link>
              <Link className="text-[15px] font-light text-stone-400 hover:text-white transition-colors" href="/careers">Careers</Link>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Our Office</h5>
            <div className="flex flex-col gap-4">
              <p className="text-[15px] font-light text-stone-400 leading-relaxed">
                {COMPANY_INFO.name}<br />
                {COMPANY_INFO.address.street}<br />
                {COMPANY_INFO.address.area}, {COMPANY_INFO.address.city}<br />
                {COMPANY_INFO.address.state} - {COMPANY_INFO.address.pincode}<br />
                {COMPANY_INFO.address.country}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Get In Touch</h5>
            <div className="flex flex-col gap-4">
              <a
                className="text-[15px] font-light text-stone-400 hover:text-white transition-colors"
                href={`tel:${COMPANY_INFO.contact.phone}`}
              >
                {COMPANY_INFO.contact.phone}
              </a>
              <a
                className="text-[15px] font-light text-stone-400 hover:text-white transition-colors"
                href={`mailto:${COMPANY_INFO.contact.email}`}
              >
                {COMPANY_INFO.contact.email}
              </a>
              <p className="text-[15px] font-light text-stone-400 mt-2">
                <span className="font-medium text-white">Hours:</span><br />
                {COMPANY_INFO.hours.weekdays}<br />
                {COMPANY_INFO.hours.weekend}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright - Smaller and cleaner */}
        <div className="pt-8 mt-12 border-t border-stone-800">
          <p className="text-xs text-center text-stone-500 font-light">
            © 2024 {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
