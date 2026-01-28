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

const ServiceDetailProcess: React.FC<ServiceDetailProcessProps> = ({ steps, title = "How We Work (Brief Overview)", overview }) => {
    return (
        <section className="py-24 md:py-32 bg-stone-50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                        The Methodology
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 leading-tight">
                        {title}
                    </h2>
                    {overview && (
                        <p className="text-stone-600 font-light text-lg leading-relaxed">
                            {overview}
                        </p>
                    )}
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="group relative">
                            {/* Connecting Line (for large screens) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-[2rem] right-0 w-full h-[1px] bg-stone-200 z-0 translate-x-[50%]"></div>
                            )}

                            <div className="relative z-10 bg-white p-8 h-full border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-900 text-white text-2xl font-serif">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-serif text-stone-900 mb-4 group-hover:text-stone-600 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-stone-600 font-light leading-relaxed text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailProcess;
