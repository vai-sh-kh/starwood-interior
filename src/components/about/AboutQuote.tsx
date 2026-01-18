import Image from "next/image";

export default function AboutQuote() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image on Left */}
                    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-stone-100">
                        <Image
                            alt="Starwood Interiors - Our Journey"
                            src="/images/abouts-2.png"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Text on Right */}
                    <div className="space-y-6">
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-stone-800 leading-[1.4] italic text-balanced">
                            &quot;Since our inception in 2015, we have been transforming homes and commercial spaces in
                            Kerala with designs that blend functionality, elegance, and personalized style.&quot;
                        </p>
                        <div className="w-12 h-[1px] bg-stone-300"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
