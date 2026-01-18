'use client';
import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface ServiceDetailFAQProps {
    faqs: FAQItem[];
}

const ServiceDetailFAQ: React.FC<ServiceDetailFAQProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-stone-100">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">Guidance</span>
                    <h3 className="text-4xl font-serif text-stone-900">Planning Insights</h3>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item border-b border-stone-200 pb-6">
                            <div
                                className="flex justify-between items-center cursor-pointer group py-2"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h4 className="text-lg font-serif text-stone-900">{faq.question}</h4>
                                <span className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>add</span>
                            </div>
                            <div className={`mt-4 text-sm text-stone-500 font-light leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailFAQ;
