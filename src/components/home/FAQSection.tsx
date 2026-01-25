"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "Do you compromise on quality?",
        answer: "No. We do not compromise on quality in any way. Every project we undertake is executed with the highest standards of craftsmanship and attention to detail."
    },
    {
        question: "Do you take up all projects?",
        answer: "We only commit to projects where we are confident we can give our 100%. This ensures complete focus, timely delivery, and superior results."
    },
    {
        question: "What is your approach to design and product quality?",
        answer: "We place total emphasis on product quality and design integrity. Every design decision is made to balance durability, functionality, and visual appeal."
    },
    {
        question: "Do you consider customer suggestions?",
        answer: "Absolutely. We value our customers' ideas and feedback and give them due consideration throughout the design and execution process."
    },
    {
        question: "Do you offer innovative design solutions?",
        answer: "Yes. We specialize in innovative interior design solutions that maximize the use of space without compromising on aesthetics."
    },
    {
        question: "What values guide your business practices?",
        answer: "We believe in honest and transparent business practices in everything we do, building long-term trust with our clients."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24">
                    <div className="lg:col-span-4">
                        <span className="block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-3 md:mb-4">Inquiries</span>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-black leading-tight">
                            Curated <br /> Inquiries
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="divide-y divide-stone-200">
                            {faqs.map((faq, index) => (
                                <div key={index} className="py-6 md:py-8">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="flex items-center justify-between w-full text-left group min-h-[44px]"
                                    >
                                        <h4 className="text-sm md:text-base lg:text-lg font-display uppercase tracking-widest text-black transition-colors group-hover:text-stone-500 pr-4">
                                            {faq.question}
                                        </h4>
                                        <div className="shrink-0">
                                            {openIndex === index ? (
                                                <Minus className="w-4 h-4 md:w-5 md:h-5 text-black" />
                                            ) : (
                                                <Plus className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-black transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${openIndex === index
                                            ? "grid-rows-[1fr] opacity-100 mt-4 md:mt-6"
                                            : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="font-serif text-base md:text-lg lg:text-xl text-stone-600 leading-relaxed italic pr-0 md:pr-12">
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
