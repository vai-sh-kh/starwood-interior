import React from 'react';
import { Home, Building2, Briefcase, Store } from 'lucide-react';

const ServiceDetailStats: React.FC = () => {
    return (
        <section className="py-20 bg-stone-900 text-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
                    <div className="flex flex-col items-center text-center gap-4 group cursor-default">
                        <Home className="w-10 h-10 text-stone-400 group-hover:text-white transition-colors" strokeWidth={1} />
                        <span className="text-xs uppercase tracking-[0.3em] font-medium text-white">Residential</span>
                    </div>
                    <div className="h-[1px] w-12 md:w-[1px] md:h-12 bg-stone-800"></div>
                    <div className="flex flex-col items-center text-center gap-4 group cursor-default">
                        <Building2 className="w-10 h-10 text-stone-400 group-hover:text-white transition-colors" strokeWidth={1} />
                        <span className="text-xs uppercase tracking-[0.3em] font-medium text-white">Apartments</span>
                    </div>
                    <div className="h-[1px] w-12 md:w-[1px] md:h-12 bg-stone-800"></div>
                    <div className="flex flex-col items-center text-center gap-4 group cursor-default">
                        <Briefcase className="w-10 h-10 text-stone-400 group-hover:text-white transition-colors" strokeWidth={1} />
                        <span className="text-xs uppercase tracking-[0.3em] font-medium text-white">Offices</span>
                    </div>
                    <div className="h-[1px] w-12 md:w-[1px] md:h-12 bg-stone-800"></div>
                    <div className="flex flex-col items-center text-center gap-4 group cursor-default">
                        <Store className="w-10 h-10 text-stone-400 group-hover:text-white transition-colors" strokeWidth={1} />
                        <span className="text-xs uppercase tracking-[0.3em] font-medium text-white">Retail</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailStats;
