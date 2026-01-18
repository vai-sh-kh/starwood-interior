export default function AboutMission() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-white border-y border-stone-100">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="flex flex-col gap-24 lg:gap-32">
                    {/* Mission */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-16">
                        <div className="lg:col-span-2">
                            <span className="text-6xl sm:text-7xl md:text-8xl font-serif italic text-stone-200 leading-none">
                                01
                            </span>
                        </div>
                        <div className="lg:col-span-4">
                            <h3 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-4">
                                Mission
                            </h3>
                        </div>
                        <div className="lg:col-span-6">
                            <p className="text-lg sm:text-xl md:text-2xl text-stone-500 font-light leading-relaxed max-w-2xl">
                                To create functional, elegant, and personalized spaces that reflect our clients’ lifestyle and
                                aspirations.
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-16">
                        <div className="lg:col-span-2">
                            <span className="text-6xl sm:text-7xl md:text-8xl font-serif italic text-stone-200 leading-none">
                                02
                            </span>
                        </div>
                        <div className="lg:col-span-4">
                            <h3 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-4">
                                Vision
                            </h3>
                        </div>
                        <div className="lg:col-span-6">
                            <p className="text-lg sm:text-xl md:text-2xl text-stone-500 font-light leading-relaxed max-w-2xl">
                                To be the leading interior design brand in Kerala, delivering innovative, sustainable, and
                                timeless designs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
