import React from 'react';
import Image from 'next/image';

interface ServiceDetailIntroProps {
    imageSrc: string;
    since?: string;
    title: string;
    description: string[];
}

const ServiceDetailIntro: React.FC<ServiceDetailIntroProps> = ({ imageSrc, since = "Since 2015", title, description }) => {
    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="aspect-[4/5] overflow-hidden relative bg-stone-200">
                        <Image
                            alt="Architectural Planning"
                            className="w-full h-full object-cover"
                            src={imageSrc}
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="space-y-8">
                        <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400">{since}</span>
                        <h3 className="text-4xl font-serif leading-tight text-stone-900">{title}</h3>
                        <div className="space-y-6 text-lg font-light text-stone-600 leading-relaxed">
                            {description.map((para, index) => {
                                if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
                                    return (
                                        <div key={index} className="flex items-start pl-4 -mt-3">
                                            <span className="mr-3 text-stone-900">•</span>
                                            <span>{para.replace(/^[•-]\s*/, '')}</span>
                                        </div>
                                    );
                                }
                                return <p key={index}>{para}</p>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailIntro;
