import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="relative bg-stone-900 rounded-[2.5rem] p-8 md:p-14 md:px-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Background Decorative Lines */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <path
                                d="M0,200 Q250,100 500,200 T1000,200"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                            <path
                                d="M0,220 Q250,120 500,220 T1000,220"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                            <path
                                d="M0,180 Q250,80 500,180 T1000,180"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 flex-1">
                        {/* Icon */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-800 rounded-full flex items-center justify-center shrink-0">
                            <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left max-w-2xl">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 tracking-tight">
                                Schedule a free interior design consultation
                            </h2>
                            <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
                                Discuss your vision with our expert designers. Get professional guidance on your space and style—no hidden fees, no obligation.
                            </p>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="relative z-10 shrink-0">
                        <Link href="/contact">
                            <button className="bg-white text-black hover:bg-stone-200 px-10 py-5 rounded-full text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-xl shadow-white/5">
                                Schedule Now
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
