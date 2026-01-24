import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, SERVICES_DATA } from "@/lib/services-data";
import ServiceDetailHero from "@/components/services/detail/ServiceDetailHero";
import ServiceDetailQuote from "@/components/services/detail/ServiceDetailQuote";
import ServiceDetailIntro from "@/components/services/detail/ServiceDetailIntro";
import ServiceDetailSubServices from "@/components/services/detail/ServiceDetailSubServices";
import ServiceDetailWhoFor from "@/components/services/detail/ServiceDetailWhoFor";
import ServiceDetailDesignStyles from "@/components/services/detail/ServiceDetailDesignStyles";
import ServiceDetailProcess from "@/components/services/detail/ServiceDetailProcess";
import ServiceDetailFAQ from "@/components/services/detail/ServiceDetailFAQ";
import ServiceDetailCTA from "@/components/services/detail/ServiceDetailCTA";

interface ServiceDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return SERVICES_DATA.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata(props: ServiceDetailPageProps): Promise<Metadata> {
    const params = await props.params;
    const service = getServiceBySlug(params.slug);

    if (!service) {
        return {
            title: "Service Not Found | Starwood",
        };
    }

    return {
        title: `${service.hero.title} ${service.hero.subtitle} | Starwood`,
        description: service.quote,
    };
}

export default async function ServiceDetailPage(props: ServiceDetailPageProps) {
    const params = await props.params;
    const service = getServiceBySlug(params.slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
            <ServiceDetailHero
                title={service.hero.title}
                subtitle={service.hero.subtitle}
                backgroundImage={service.hero.backgroundImage}
            />

            <ServiceDetailQuote quote={service.quote} />

            <ServiceDetailIntro
                title={service.intro.title}
                since={service.intro.since}
                description={service.intro.description}
                imageSrc={service.intro.imageSrc}
            />

            {service.whoIsThisFor && (
                <ServiceDetailWhoFor
                    title={service.whoIsThisFor.title}
                    description={service.whoIsThisFor.description}
                />
            )}

            <ServiceDetailSubServices
                services={service.subServices}
                title={
                    service.slug === 'residential-interiors' ? "Our Range of Residential Interior Design Services" :
                        service.slug === 'commercial-interiors' ? "Our Commercial Interior Design Services" :
                            service.slug === '3d-rendering' ? "Our 3D Rendering Services Include" :
                                service.slug === 'fit-out-shop-drawings' ? "Our Fit-Out Shop Drawing Services" :
                                    service.slug === 'joinery-shop-drawings' ? "Our Joinery Shop Drawing Services" :
                                        service.slug === 'interior-floor-plans' ? "Our Interior Floor Plan Services" :
                                            undefined
                }
                note={service.subServicesNote}
            />

            {service.designStyles && (
                <ServiceDetailDesignStyles
                    title={service.designStyles.title}
                    description={service.designStyles.description}
                    styles={service.designStyles.styles}
                />
            )}

            <ServiceDetailProcess
                steps={service.process}
                title={(service.slug === 'residential-interiors' || service.slug === 'joinery-shop-drawings' || service.slug === 'interior-floor-plans') ? "How We Work (Brief Overview)" : undefined}
                overview={service.processOverview}
            />

            <ServiceDetailFAQ faqs={service.faqs} />

            <ServiceDetailCTA
                title={
                    service.slug === 'residential-interiors' ? "Book Your Free Residential Interior Design Consultation in Trivandrum" :
                        service.slug === 'commercial-interiors' ? "Book Your Free Commercial Interior Design Consultation in Trivandrum" :
                            service.slug === '3d-rendering' ? "Book Your Free 3D Rendering Consultation in Kerala" :
                                service.slug === 'fit-out-shop-drawings' ? "Book Your Fit-Out Shop Drawing Consultation in Kerala" :
                                    service.slug === 'joinery-shop-drawings' ? "Book Your Joinery Shop Drawing Consultation in Kerala" :
                                        service.slug === 'interior-floor-plans' ? "Book Your Interior Floor Planning Consultation in Kerala" :
                                            undefined
                }
            />
        </div>
    );
}
