"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10 rounded-t-[3rem] mt-8 relative overflow-hidden w-full">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-12">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <span className="text-2xl font-bold font-display tracking-tight">
                Starwood Interiors
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-medium leading-[1.1] mb-8 text-white">
              Building better cities, <br /> one project at a time.
            </h2>
          </div>

          {/* Text Section */}
          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto max-w-md">
            <p className="text-sm text-gray-400 leading-relaxed lg:text-right">
              We are committed to creating exceptional spaces that blend
              functionality with aesthetic excellence. Our team brings years of
              expertise in design, construction, and project management to
              deliver results that exceed expectations.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-t border-gray-800 pt-16">
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800/50">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
            © 2023 Starwood Interiors — All rights reserved.
          </div>
          <div className="flex gap-4">
            {(
              FOOTER_LINKS.socialMedia as unknown as Array<{
                label: string;
                href: string;
                icon: string;
              }>
            ).map((social) => {
              const IconComponent =
                social.icon === "instagram"
                  ? Instagram
                  : social.icon === "facebook"
                  ? Facebook
                  : social.icon === "twitter"
                  ? Twitter
                  : social.icon === "linkedin"
                  ? Linkedin
                  : null;

              if (!IconComponent) return null;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
