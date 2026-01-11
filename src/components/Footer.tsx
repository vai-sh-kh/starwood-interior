import Link from "next/link";
import { Instagram, Facebook, Mail, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-24 border-t border-stone-100" id="contact">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-8 pr-12">
            <Link href="/" className="flex items-center">
              <h4 className="font-serif text-3xl font-bold text-black uppercase tracking-tighter">Starwood</h4>
            </Link>
            <p className="text-base text-gray-500 font-light leading-relaxed">
              Leading interior architecture studio dedicated to crafting contemporary spaces that blend modern aesthetics with timeless elegance. Founded in 2018 by leading designers.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-black hover:border-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-black hover:border-black transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/yournumber" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-black hover:border-black transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="mailto:contact@starwoodinteriors.com" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-black hover:border-black transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-black">Company</h5>
            <div className="flex flex-col gap-4">
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/about-us">About Us</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/services">Services</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/projects">Our Works</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/careers">Careers</Link>
            </div>
          </div>

          {/* Studio */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-black">Studio</h5>
            <div className="flex flex-col gap-4">
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/#philosophy">Our Philosophy</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/process">Design Process</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/sustainability">Sustainability</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/press">Press & Media</Link>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-black">Explore</h5>
            <div className="flex flex-col gap-4">
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/works?category=residential">Residential</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/works?category=commercial">Commercial</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/works?category=hospitality">Hospitality</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/works?category=retail">Retail</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h5 className="font-display text-sm font-semibold uppercase tracking-widest text-black">Contact</h5>
            <div className="flex flex-col gap-4">
              <a className="text-[15px] font-light text-stone-500 hover:text-black transition-colors truncate" href="mailto:contact@starwoodinteriors.com">
                Inquiries
              </a>
              <a className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="tel:+1234567890">
                Support
              </a>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/contact">Location</Link>
              <Link className="text-[15px] font-light text-stone-500 hover:text-black transition-colors" href="/contact">Book Meeting</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-16 border-t border-stone-100">
          <p className="text-sm text-stone-400 font-light tracking-wide">© 2024 Starwood Interiors. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs uppercase tracking-widest text-stone-400 hover:text-black transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
