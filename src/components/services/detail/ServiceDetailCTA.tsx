import React from 'react';

const ServiceDetailCTA: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h3 className="text-5xl md:text-6xl font-serif mb-8 italic text-stone-900">Ready to define your space?</h3>
                        <p className="text-stone-500 font-light text-lg mb-12 leading-relaxed">Begin your project with a comprehensive spatial consultation. Our designers will help you unlock the full potential of your property.</p>
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-[1px] bg-stone-900"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-900">Expert consultation</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 p-8 md:p-12 border border-stone-100">
                        <h4 className="text-xl font-serif mb-8 text-stone-900">Book Your Consultation</h4>
                        <form className="space-y-6">
                            <div>
                                <input className="w-full bg-transparent border-0 border-b border-stone-200 py-3 px-0 focus:ring-0 focus:border-stone-900 placeholder:text-stone-400 text-sm text-stone-900 outline-none" placeholder="Full Name" type="text" />
                            </div>
                            <div>
                                <input className="w-full bg-transparent border-0 border-b border-stone-200 py-3 px-0 focus:ring-0 focus:border-stone-900 placeholder:text-stone-400 text-sm text-stone-900 outline-none" placeholder="Email Address" type="email" />
                            </div>
                            <div>
                                <select className="w-full bg-transparent border-0 border-b border-stone-200 py-3 px-0 focus:ring-0 focus:border-stone-900 text-stone-400 text-sm outline-none">
                                    <option>Project Type</option>
                                    <option>Residential Villa</option>
                                    <option>Apartment</option>
                                    <option>Commercial Space</option>
                                </select>
                            </div>
                            <button className="w-full bg-stone-900 text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-colors mt-4">
                                Start Your Project
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailCTA;
