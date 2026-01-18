"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SELECTED_WORKS } from "@/lib/constants/works";

export default function SelectedWorks() {
    return (
        <section className="py-16 lg:py-24 bg-white" id="projects">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <span className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Portfolio</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl md:text-5xl font-serif text-black">Selected Works</h3>
                        <Link href="/works" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors underline-offset-4 hover:underline">
                            All Works
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Masonry Grid - CSS Columns */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
                    {SELECTED_WORKS.map((work) => {
                        return (
                            <motion.div
                                key={work.id}
                                className="relative overflow-hidden cursor-pointer mb-3 break-inside-avoid group bg-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="relative w-full bg-gray-100">
                                    <Image
                                        src={work.image}
                                        alt={work.title || "Interior design work"}
                                        width={600}
                                        height={800}
                                        className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
