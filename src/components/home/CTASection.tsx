import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

interface CTASectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function CTASection({
    title = "Schedule a free interior design consultation",
    description = "Discuss your vision with our expert designers. Get professional guidance on your space and style—no hidden fees, no obligation.",
    buttonText = "Enquire Now"
}: CTASectionProps) {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="relative bg-stone-50 rounded-3xl md:rounded-[2.5rem] p-6 md:p-14 lg:px-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
                    {/* Background Decorative Lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <path
                                d="M0,200 Q250,100 500,200 T1000,200"
                                fill="none"
                                stroke="#1A1A1A"
                                strokeWidth="0.5"
                            />
                            <path
                                d="M0,220 Q250,120 500,220 T1000,220"
                                fill="none"
                                stroke="#1A1A1A"
                                strokeWidth="0.5"
                            />
                            <path
                                d="M0,180 Q250,80 500,180 T1000,180"
                                fill="none"
                                stroke="#1A1A1A"
                                strokeWidth="0.5"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 flex-1">
                        {/* Icon */}
                        <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-stone-800" />
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left max-w-2xl">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-black mb-3 md:mb-4 tracking-tight">
                                {title}
                            </h2>
                            <p className="text-stone-600 text-sm md:text-base font-light leading-relaxed max-w-xl">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="relative z-10 shrink-0">
                        <Link href="/contact">
                            <button className="bg-black text-white hover:bg-stone-800 px-8 py-4 md:px-10 md:py-5 rounded-full text-sm md:text-base font-bold flex items-center gap-2 md:gap-3 transition-all duration-300 shadow-xl min-h-[44px]">
                                {buttonText}
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
