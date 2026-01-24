import React from 'react';
import { Quote } from 'lucide-react';

interface ServiceDetailQuoteProps {
    quote: string;
}

const ServiceDetailQuote: React.FC<ServiceDetailQuoteProps> = ({ quote }) => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <Quote className="w-12 h-12 text-stone-300 mx-auto mb-8" strokeWidth={1} />
                <blockquote className="text-3xl md:text-5xl font-serif leading-tight text-stone-900">
                    "{quote}"
                </blockquote>
            </div>
        </section>
    );
};

export default ServiceDetailQuote;
