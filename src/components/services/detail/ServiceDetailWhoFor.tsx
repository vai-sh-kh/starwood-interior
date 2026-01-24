import React from 'react';

interface ServiceDetailWhoForProps {
    title: string;
    description: string | string[];
}

const ServiceDetailWhoFor: React.FC<ServiceDetailWhoForProps> = ({ title, description }) => {
    return (
        <section className="py-20 bg-stone-900 text-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">Target Audience</span>
                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">{title}</h3>
                    </div>
                    <div>
                        <div className="text-stone-300 font-light text-lg leading-relaxed border-l border-stone-700 pl-8 space-y-4">
                            {Array.isArray(description) ? (
                                description.map((item, index) => {
                                    if (item.trim().startsWith('•') || item.trim().startsWith('-')) {
                                        return (
                                            <div key={index} className="flex items-start pl-2">
                                                <span className="mr-3 text-stone-500">•</span>
                                                <span>{item.replace(/^[•-]\s*/, '')}</span>
                                            </div>
                                        );
                                    }
                                    return <p key={index}>{item}</p>;
                                })
                            ) : (
                                <p>{description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailWhoFor;
