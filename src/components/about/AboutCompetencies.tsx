import Image from "next/image";
import { SERVICES_DATA } from "@/lib/services-data";

const slugs = [
    "residential-interiors",
    "commercial-interiors",
    "3d-rendering",
    "joinery-shop-drawings",
];

const services = slugs.map((slug, index) => {
    const service = SERVICES_DATA.find((s) => s.slug === slug);
    return {
        number: `0${index + 1}`,
        title: service?.listingTitle,
        image: service?.listingImage || "",
        alt: service?.listingTitle || "",
        offset: index % 2 !== 0 ? "md:mt-12 lg:mt-24" : "",
    };
});

export default function AboutCompetencies() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-stone-50">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="mb-20 text-center md:text-left">
                    <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-4">
                        Competencies
                    </span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif">What We Do</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <div key={index} className={`group cursor-pointer ${service.offset}`}>
                            <div className="aspect-[3/4] overflow-hidden mb-6 bg-stone-200">
                                <Image
                                    alt={service.alt}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                    src={service.image}
                                    width={400}
                                    height={533}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                                        Service {service.number}
                                    </p>
                                    <h4 className="text-xl font-serif">{service.title}</h4>
                                </div>
                                <span className="material-symbols-outlined text-stone-300 group-hover:text-stone-900 transition-colors">
                                    arrow_right_alt
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
