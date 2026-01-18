import React from 'react';

interface ServiceDetailQuoteProps {
    quote: string;
}

const ServiceDetailQuote: React.FC<ServiceDetailQuoteProps> = ({ quote }) => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <span className="material-symbols-outlined text-stone-300 text-5xl mb-8 font-light">format_quote</span>
                <blockquote className="text-3xl md:text-5xl font-serif leading-tight text-stone-900">
                    "{quote}"
                </blockquote>
            </div>
        </section>
    );
};

export default ServiceDetailQuote;
