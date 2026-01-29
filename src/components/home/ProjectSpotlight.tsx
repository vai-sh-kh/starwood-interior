"use client";

import Link from "next/link";
import Image from "@/components/ui/SkeletonImage";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <p ref={ref} className="text-2xl font-bold text-white">0{suffix}</p>;
}

export default function ProjectSpotlight() {
    return (
        <section className="py-16 md:py-24 bg-stone-900 text-white relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgmjybtIbCYHE2jf_FLemsIejhX6RRDYnFL65TGqVkQTbZKmrhORxJ2Y-QmQ3f0KybOOWWkYThG0uQnOevPodYqu0QA-7ge3MC4Z8GYpjlzseRVWPvzCi5j6TreGrautE4AYzqVNJQ1b5VXQxOSLWRaRU1JPGqzd5Wfj4QdB5bKaQDbaPQAF3pN195eV-UQkWvKcY1KFv6gBkqZ6bI3-u5oUxPO7xuekOtSWJH0iaHZcTracryipWpKPY0r4dwoBygfbXQ8EqDUD3u')",
                }}
            ></div>
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
                <div className="mb-8 md:mb-12 border-b border-white/10 pb-4 md:pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] block mb-2">About Starwood</span>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif">Why Choose Starwood Interiors?</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:block text-right"
                    >
                        <p className="text-sm font-light text-stone-300">Since 2015</p>
                        <p className="text-sm font-light text-stone-300">Leading interior design firm</p>
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <motion.div
                        className="lg:col-span-8 space-y-4 lg:max-w-[calc(100%-60px)]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-stone-800">
                            <Image
                                alt="Aspen Residence Living Room"
                                fill
                                className="object-cover"
                                src="/images/home/home-why-choose-section.webp"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                        </div>
                    </motion.div>
                    <div className="lg:col-span-4 flex flex-col justify-between">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h3 className="text-lg md:text-xl font-serif mb-4 md:mb-6">Trusted Interior Designer in Trivandrum</h3>
                                <p className="text-stone-400 text-sm md:text-base font-light mb-8 md:mb-10 leading-relaxed">
                                    Starwood Interiors provides professional interior design services in Trivandrum tailored to homes, apartments, and residential spaces. Our expert team delivers innovative design solutions, transparent communication, and excellent craftsmanship. Contact us today to begin your interior transformation.
                                </p>
                            </motion.div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-white/10">
                                <div>
                                    <Counter value={100} suffix="+" />
                                    <p className="text-[10px] md:text-xs text-stone-400 mt-1">Satisfied clients</p>
                                </div>
                                <div>
                                    <Counter value={99} suffix="%" />
                                    <p className="text-[10px] md:text-xs text-stone-400 mt-1">Success rate</p>
                                </div>
                                <div>
                                    <Counter value={20} suffix="+" />
                                    <p className="text-[10px] md:text-xs text-stone-400 mt-1">Team members</p>
                                </div>
                                <div>
                                    <Counter value={10} suffix="+" />
                                    <p className="text-[10px] md:text-xs text-stone-400 mt-1">Years of experience</p>
                                </div>
                            </div>
                        </div>
                        <motion.div
                            className="mt-8 lg:mt-0"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Link
                                className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 md:px-8 md:py-3 text-[11px] md:text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out group min-h-[44px]"
                                href="/about-us"
                            >
                                <span className="group-hover:opacity-90 transition-opacity duration-300">About us</span>
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
