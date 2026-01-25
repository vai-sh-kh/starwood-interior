import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Philosophy() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-stone-50" id="philosophy">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                            <Image
                                alt="Starwood Design Team"
                                fill
                                className="object-cover transition-all duration-700 ease-out"
                                src="/images/phylosophy-1.png"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2">
                        <span className="block text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.2em] uppercase text-gray-400 mb-3 md:mb-6">Our Philosophy</span>
                        <h3 className="text-[26px] leading-[1.25] sm:text-3xl md:text-4xl lg:text-5xl font-serif text-black mb-5 md:mb-8 md:leading-tight">
                            Creating Premium,<br className="hidden md:block" /> Budget-Friendly{" "}
                            <span className="block md:inline italic text-gray-500 mt-1 md:mt-0">Interiors Since 2015.</span>
                        </h3>
                        <div className="w-full space-y-5 md:space-y-6 text-[15px] leading-[1.7] md:text-base lg:text-lg font-light text-gray-600 md:leading-relaxed">
                            <p className="text-gray-700">
                                Starwood Interiors is a leading interior design firm based in Trivandrum, Kerala, with a strong legacy of creating stylish, functional, and beautifully coordinated value-for-money interiors since 2015. Our creative team of interior designers brings global design influences and local insights to every project, delivering spaces that align with your personality, lifestyle, and needs.
                            </p>

                            <div className="pt-2 md:pt-0">
                                <h4 className="text-[17px] md:text-lg lg:text-xl font-semibold text-black mb-4 md:mb-5">How we work</h4>
                                <ul className="space-y-3.5 md:space-y-3 text-[14px] md:text-base">
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">Requirement Discussion</strong> – Understanding your requirements to create custom interior concepts.</span>
                                    </li>
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">Design Concept</strong> – Development of initial concept design & layouts aligned to your aesthetic goals.</span>
                                    </li>
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">3D Visualisation</strong> – Creation of detailed 3D views to give complete clarity before execution.</span>
                                    </li>
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">Design Finalisation</strong> – Finalisation of materials, finishes, and design details with client approval.</span>
                                    </li>
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">Execution Management</strong> – Executing the project with quality control, timeline management, and site supervision.</span>
                                    </li>
                                    <li className="flex gap-2.5 md:gap-3">
                                        <span className="text-black font-medium mt-0.5">•</span>
                                        <span className="leading-[1.6]"><strong className="text-black font-semibold">Project Handover</strong> – Completing final inspections and project handover with post-completion support.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-10 w-fit">
                            <Link
                                className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-medium border-b border-black pb-1 hover:text-gray-600 transition-colors"
                                href="/about-us"
                            >
                                About us
                                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
