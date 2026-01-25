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
        <section className="relative w-full bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            <div className="relative w-full px-6 md:px-12 lg:px-20 py-20 md:py-28 lg:py-32">
                {/* Header Section */}
                <div className="max-w-[1400px] mx-auto mb-16 md:mb-20">
                    <div className="space-y-4">
                        <span className="block text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-stone-400">
                            The Methodology
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
                            {title}
                        </h2>
                        {overview && (
                            <p className="text-stone-600 font-light max-w-4xl leading-relaxed text-base md:text-lg pt-4">
                                {overview}
                            </p>
                        )}
                    </div>
                </div>

                {/* Process Steps Grid */}
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`
                                    group relative bg-white/60 backdrop-blur-sm
                                    border border-stone-200/50
                                    hover:bg-white hover:shadow-xl hover:z-10
                                    transition-all duration-500
                                    ${index % 3 !== 2 ? 'lg:border-r-0' : ''}
                                    ${index < steps.length - 3 ? 'lg:border-b-0' : ''}
                                    ${index % 2 !== 1 ? 'md:border-r-0 lg:border-r' : 'lg:border-r-0'}
                                    ${index < steps.length - 2 ? 'md:border-b-0' : 'md:border-b lg:border-b-0'}
                                    ${index < steps.length - 1 ? 'border-b-0 md:border-b lg:border-b' : ''}
                                    ${index === steps.length - 3 ? 'lg:border-b-0' : ''}
                                `}
                            >
                                {/* Content */}
                                <div className="p-8 md:p-10 lg:p-12 min-h-[280px] md:min-h-[300px] flex flex-col">
                                    {/* Number */}
                                    <div className="mb-6">
                                        <span className="text-6xl md:text-7xl font-serif italic text-stone-200 group-hover:text-stone-300 transition-colors duration-300 leading-none">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl md:text-2xl font-serif text-stone-900 mb-4 group-hover:text-stone-800 transition-colors">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base flex-grow">
                                        {step.description}
                                    </p>

                                    {/* Hover Line Accent */}
                                    <div className="mt-6 pt-6 border-t border-stone-200/0 group-hover:border-stone-200 transition-all duration-300">
                                        <div className="w-0 group-hover:w-12 h-0.5 bg-stone-800 transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute top-0 right-0 w-full h-0.5 bg-stone-800"></div>
                                    <div className="absolute top-0 right-0 w-0.5 h-full bg-stone-800"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailProcess;
