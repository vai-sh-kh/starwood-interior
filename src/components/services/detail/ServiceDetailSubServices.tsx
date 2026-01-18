import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SubService {
    title: string;
    description: string;
    imageSrc: string;
}

interface ServiceDetailSubServicesProps {
    services: SubService[];
}

const ServiceDetailSubServices: React.FC<ServiceDetailSubServicesProps> = ({ services }) => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="mb-20">
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">Core Competencies</span>
                    <h3 className="text-4xl font-serif text-stone-900">Our Planning Services</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <div key={index} className="group service-card">
                            <div className="aspect-square bg-stone-100 mb-6 overflow-hidden relative">
                                <Image
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    src={service.imageSrc}
                                    fill
                                    unoptimized
                                />
                            </div>
                            <h4 className="text-xl font-serif mb-3 text-stone-900">{service.title}</h4>
                            <p className="text-sm text-stone-500 font-light leading-relaxed mb-6">{service.description}</p>
                            <Link className="text-[10px] uppercase tracking-widest font-bold border-b border-stone-900/20 pb-1 hover:border-stone-900 transition-colors text-stone-900" href="#">Know more</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailSubServices;
