import Image from "next/image";

export default function AboutEvolution() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-stone-50 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                    <div className="relative">
                        <div className="aspect-[4/5] overflow-hidden bg-stone-200">
                            <Image
                                alt="Our Evolution - Modern Studio"
                                className="w-full h-full object-cover"
                                src="/images/abouts-3.webp"
                                fill
                                priority
                            />
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white p-8 hidden xl:block shadow-sm border border-stone-100">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">
                                The Origin
                            </p>
                            <p className="font-serif text-xl italic leading-tight">
                                Founded in Trivandrum, built on excellence.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
                            Our Evolution
                        </span>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                            From Trivandrum to <br />
                            <span className="italic">Kochi &amp; Mavelikara.</span>
                        </h3>
                        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed sm:leading-loose max-w-xl">
                            <p>
                                What began as a specialized boutique studio in Trivandrum has
                                evolved into a powerhouse of interior luxury. Over the past
                                decade, we have expanded our footprint to Kochi and Mavelikara,
                                bringing our signature minimalist aesthetic to Kerala&apos;s most
                                discerning homeowners.
                            </p>
                            <p>
                                Our affiliation with{" "}
                                <span className="font-medium text-stone-900">
                                    Design Studio LLC, Dubai
                                </span>
                                , allows us to tap into international logistics and global design
                                trends, ensuring our clients receive world-class materials and
                                contemporary methodologies tailored for the local context.
                            </p>
                        </div>
                        <div className="pt-6">
                            <a
                                className="inline-flex items-center gap-4 text-[14px] uppercase tracking-widest font-bold border-b border-stone-900 pb-2 transition-opacity hover:opacity-60"
                                href="/projects"
                            >
                                Explore Our works
                                <span className="material-symbols-outlined text-sm">
                                    north_east
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
