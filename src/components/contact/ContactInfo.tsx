import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants/company";

export default function ContactInfo() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Section Header */}
                <div className="max-w-3xl mb-20">
                    <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-6">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6 leading-tight">
                        We&apos;d love to hear <span className="italic">from you</span>
                    </h2>
                    <p className="text-stone-500 text-lg font-light leading-relaxed">
                        Whether you&apos;re ready to start your project or just exploring possibilities, 
                        our team is here to guide you through every step of your design journey.
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Email Card */}
                    <a 
                        href={`mailto:${COMPANY_INFO.contact.email}`}
                        className="group p-8 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Mail className="w-6 h-6 text-stone-700" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-3">
                            Email Us
                        </h3>
                        <p className="text-stone-600 font-light text-[15px] leading-relaxed">
                            {COMPANY_INFO.contact.email}
                        </p>
                        <span className="inline-block mt-4 text-xs uppercase tracking-wider text-stone-400 group-hover:text-stone-600 transition-colors">
                            Send a message →
                        </span>
                    </a>

                    {/* Phone Card */}
                    <a 
                        href={`tel:${COMPANY_INFO.contact.phone}`}
                        className="group p-8 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Phone className="w-6 h-6 text-stone-700" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-3">
                            Call Us
                        </h3>
                        <p className="text-stone-600 font-light text-[15px] leading-relaxed">
                            {COMPANY_INFO.contact.phone}
                        </p>
                        <span className="inline-block mt-4 text-xs uppercase tracking-wider text-stone-400 group-hover:text-stone-600 transition-colors">
                            Give us a call →
                        </span>
                    </a>

                    {/* WhatsApp Card */}
                    <a 
                        href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-8 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <MessageSquare className="w-6 h-6 text-stone-700" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-3">
                            WhatsApp
                        </h3>
                        <p className="text-stone-600 font-light text-[15px] leading-relaxed">
                            Quick chat support
                        </p>
                        <span className="inline-block mt-4 text-xs uppercase tracking-wider text-stone-400 group-hover:text-stone-600 transition-colors">
                            Start a chat →
                        </span>
                    </a>

                    {/* Hours Card */}
                    <div className="group p-8 bg-stone-50 rounded-2xl">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Clock className="w-6 h-6 text-stone-700" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-3">
                            Working Hours
                        </h3>
                        <p className="text-stone-600 font-light text-[15px] leading-relaxed">
                            {COMPANY_INFO.hours.weekdays}
                        </p>
                        <p className="text-stone-400 font-light text-sm mt-1">
                            {COMPANY_INFO.hours.weekend}
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}

