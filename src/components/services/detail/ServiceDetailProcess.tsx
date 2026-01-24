import React from 'react';

interface ProcessStep {
    title: string;
    description: string;
}

interface ServiceDetailProcessProps {
    steps: ProcessStep[];
    title?: string;
    overview?: string;
}

const ServiceDetailProcess: React.FC<ServiceDetailProcessProps> = ({ steps, title = "A Five-Step Planning Process", overview }) => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="mb-20">
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">The Methodology</span>
                    <h3 className="text-4xl font-serif text-stone-900 mb-6">{title}</h3>
                    {overview && (
                        <p className="text-stone-500 font-light max-w-3xl leading-relaxed text-lg">{overview}</p>
                    )}
                </div>
                <div className="space-y-16">
                    {steps.map((step, index) => (
                        <div key={index} className={`grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-start ${index !== steps.length - 1 ? 'border-b border-stone-100 pb-12' : ''}`}>
                            <span className="text-5xl font-serif italic text-stone-200 leading-none">{String(index + 1).padStart(2, '0')}</span>
                            <div>
                                <h4 className="text-xl font-serif mb-4 text-stone-900">{step.title}</h4>
                                <p className="text-stone-500 font-light max-w-2xl leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailProcess;
