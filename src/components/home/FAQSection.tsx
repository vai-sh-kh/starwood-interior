"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "Our Design Methodology",
        answer: "We approach each project as a unique architectural dialogue. Our method prioritizes the manipulation of natural light and the selection of raw, authentic materials to create spaces that breathe and evolve with their inhabitants."
    },
    {
        question: "Project Timelines",
        answer: "Quality requires patience. A typical comprehensive interior architecture project spans from 12 to 18 months, ensuring every custom detail is executed to our exacting standards of craftsmanship."
    },
    {
        question: "Global Commissions",
        answer: "While headquartered in New York, we accept select commissions globally. Our network of artisans and contractors allows us to maintain the integrity of our minimalist vision across various geographical contexts."
    },
    {
        question: "Bespoke Furnishing",
        answer: "We believe that a space is only complete when its furniture is in harmony with the architecture. We often design custom pieces specifically for our projects to ensure a seamless aesthetic unity."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-4">
                        <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-4">Inquiries</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight">
                            Curated <br /> Inquiries
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="divide-y divide-stone-200">
                            {faqs.map((faq, index) => (
                                <div key={index} className="py-8">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="flex items-center justify-between w-full text-left group"
                                    >
                                        <h4 className="text-base md:text-lg font-display uppercase tracking-widest text-black transition-colors group-hover:text-stone-500">
                                            {faq.question}
                                        </h4>
                                        <div className="shrink-0 ml-4">
                                            {openIndex === index ? (
                                                <Minus className="w-5 h-5 text-black" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-stone-400 group-hover:text-black transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${openIndex === index
                                            ? "grid-rows-[1fr] opacity-100 mt-6"
                                            : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="font-serif text-lg md:text-xl text-stone-600 leading-relaxed italic pr-12">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
