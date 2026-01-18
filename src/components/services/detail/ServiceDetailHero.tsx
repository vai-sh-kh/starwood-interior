import React from 'react';

interface ServiceDetailHeroProps {
    title: string;
    subtitle: string;
    backgroundImage: string;
    experience?: string;
    location?: string;
    status?: string;
}

const ServiceDetailHero: React.FC<ServiceDetailHeroProps> = ({
    title,
    subtitle,
    backgroundImage,
    experience = "10+ Years Experience",
    location = "Kerala-Wide Service",
    status = "Execution-Ready"
}) => {
    return (
        <header className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-center mt-16">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
            ></div>
            <div className="absolute inset-0 bg-white/10 z-10"></div>
            <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 md:px-12">
                <div className="max-w-4xl bg-white/80 backdrop-blur-sm p-12 md:p-16 inline-block border border-white/50">
                    <div className="flex flex-wrap gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-stone-900/30"></span>
                            <span className="text-stone-900 text-[10px] uppercase tracking-[0.2em] font-bold">{experience}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-stone-900/30"></span>
                            <span className="text-stone-900 text-[10px] uppercase tracking-[0.2em] font-bold">{location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-stone-900/30"></span>
                            <span className="text-stone-900 text-[10px] uppercase tracking-[0.2em] font-bold">{status}</span>
                        </div>
                    </div>
                    <h2 className="text-stone-900 text-5xl md:text-7xl font-serif italic leading-[1.1] tracking-tight">
                        {title} <br /> <span className="not-italic">{subtitle}</span>
                    </h2>
                </div>
            </div>
        </header>
    );
};

export default ServiceDetailHero;
