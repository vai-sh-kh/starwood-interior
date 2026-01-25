"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HOME_SERVICES_LIST } from "@/lib/services-data";

export default function SelectedWorks() {
    return (
        <section className="py-16 md:py-24 bg-white" id="services">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="mb-10 md:mb-12">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 md:mb-2 gap-2">
                        <span className="block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Our Expertise</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif text-black">Selected Services</h3>
                        <Link href="/services" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors underline-offset-4 hover:underline w-fit">
                            All Services
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                    </div>
                </div>

                {/* Grid Layout for Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {HOME_SERVICES_LIST.map((service, index) => {
                        return (
                            <motion.div
                                key={service.title} // slug might be missing in simplified type or same
                                className="relative group overflow-hidden cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/services/${service.slug}`}>
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <h4 className="heading-3 mb-2">{service.title}</h4>
                                            <div className="w-12 h-[1px] bg-white/50 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                                            <p className="text-sm font-light text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
