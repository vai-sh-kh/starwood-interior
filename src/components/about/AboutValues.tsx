import Image from "next/image";

const values = [
    {
        title: "Craftsmanship",
        description:
            "Honoring traditional techniques while embracing modern precision in every joint and finish.",
        image: "/images/about-value-1.webp",
        alt: "Fine wood grain texture",
    },
    {
        title: "Integrity",
        description:
            "A solid foundation of transparency and honesty in every project milestone we achieve.",
        image: "/images/about-value-2.webp",
        alt: "Calacatta marble texture",
    },
    {
        title: "Client Centricity",
        description:
            "Tailoring every weave and thread of our design to your personal narrative and lifestyle.",
        image: "/images/about-value-3.webp",
        alt: "Soft linen fabric texture",
    },
    {
        title: "Innovation",
        description:
            "Pushing boundaries with avant-garde materials and sustainable design solutions for the future.",
        image: "/images/services/commercial/resturant-interior.jpg",
        alt: "Modern architectural innovation detail with sustainable materials and LED lighting",
    },
];

export default function AboutValues() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="text-center mb-24">
                    <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-4">
                        The Pillars of Starwood
                    </span>
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-serif italic">
                        Our Core Values
                    </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="relative aspect-square overflow-hidden group bg-stone-100"
                        >
                            <Image
                                alt={value.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src={value.image}
                                width={400}
                                height={400}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(28,25,23,0.7)] flex flex-col justify-end p-8 text-white">
                                <h5 className="text-2xl font-bold letter-spacing-[2px] font-serif mb-2">{value.title}</h5>
                                <p className="text-[16px] font-light tracking-wide leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
