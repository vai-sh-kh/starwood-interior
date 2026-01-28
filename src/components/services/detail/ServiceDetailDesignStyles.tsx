import React from 'react';

interface ServiceDetailDesignStylesProps {
    title: string;
    description: string;
    styles: string[];
}

const ServiceDetailDesignStyles: React.FC<ServiceDetailDesignStylesProps> = ({ title, description, styles }) => {
    return (
        <section className="py-24 bg-stone-900">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                        Aesthetics
                    </span>
                    <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        {title}
                    </h3>
                    <p className="text-stone-400 font-light text-lg leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {styles.map((style, index) => (
                        <div
                            key={index}
                            className="bg-stone-800/50 backdrop-blur-sm border border-stone-800 hover:border-stone-600 px-10 py-6 min-w-[200px] text-center transition-all duration-300 hover:bg-stone-800 hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="text-lg font-light text-stone-200">{style}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailDesignStyles;
