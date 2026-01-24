import React from 'react';

interface ServiceDetailDesignStylesProps {
    title: string;
    description: string;
    styles: string[];
}

const ServiceDetailDesignStyles: React.FC<ServiceDetailDesignStylesProps> = ({ title, description, styles }) => {
    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">Aesthetics</span>
                    <h3 className="text-4xl font-serif text-stone-900 mb-6">{title}</h3>
                    <p className="text-stone-500 font-light text-lg leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {styles.map((style, index) => (
                        <div key={index} className="bg-white p-8 text-center border border-stone-100 hover:border-stone-200 transition-colors min-w-[200px]">
                            <span className="block text-xl font-serif text-stone-900">{style}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailDesignStyles;
