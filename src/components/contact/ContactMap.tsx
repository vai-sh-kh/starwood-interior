import { COMPANY_INFO } from "@/lib/constants/company";
import Image from "next/image";

export default function ContactMap() {
    return (
        <section className="py-24 bg-stone-100">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-6">
                        Our Location
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
                        Visit Our <span className="italic">Studio</span>
                    </h2>
                    <p className="text-stone-500 font-light max-w-xl mx-auto">
                        Experience our design philosophy firsthand. Schedule a visit to explore
                        our showroom and discuss your project in person.
                    </p>
                </div>

                {/* Map and Studio Images Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map - Takes 2 columns */}
                    <div className="lg:col-span-2 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.726880293448!2d76.9537233758872!3d8.525872991516548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbb805bbcd47%3A0x154561147a02070!2sThampanoor%2C%20Thiruvananthapuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1709664531234!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    {/* Studio Info Card */}
                    <div className="bg-stone-900 rounded-3xl p-8 lg:p-10 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-serif mb-6">
                                {COMPANY_INFO.name}
                            </h3>
                            <div className="space-y-4 text-white/80 font-light">
                                <p className="leading-relaxed">
                                    {COMPANY_INFO.address.street}<br />
                                    {COMPANY_INFO.address.area}<br />
                                    {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state}<br />
                                    {COMPANY_INFO.address.pincode}
                                </p>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Hours</p>
                                    <p>{COMPANY_INFO.hours.weekdays}</p>
                                    <p className="text-white/50">{COMPANY_INFO.hours.weekend}</p>
                                </div>
                            </div>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${COMPANY_INFO.address.street}, ${COMPANY_INFO.address.area}, ${COMPANY_INFO.address.city}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-stone-900 px-6 py-4 rounded-full text-sm font-semibold hover:bg-stone-100 transition-colors w-full"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}

