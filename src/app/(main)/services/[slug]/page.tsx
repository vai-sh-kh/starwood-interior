import type { Metadata } from "next";
import ServiceDetailHero from "@/components/services/detail/ServiceDetailHero";
import ServiceDetailQuote from "@/components/services/detail/ServiceDetailQuote";
import ServiceDetailIntro from "@/components/services/detail/ServiceDetailIntro";
import ServiceDetailSubServices from "@/components/services/detail/ServiceDetailSubServices";
import ServiceDetailStats from "@/components/services/detail/ServiceDetailStats";
import ServiceDetailProcess from "@/components/services/detail/ServiceDetailProcess";
import ServiceDetailFAQ from "@/components/services/detail/ServiceDetailFAQ";
import ServiceDetailCTA from "@/components/services/detail/ServiceDetailCTA";

// This is sample data matching the HTML content provided by the user.
// In a real application, this would likely come from a CMS or database based on the slug.
const SERVICE_DATA = {
    hero: {
        title: "Interior Floor Plans",
        subtitle: "in Kerala.",
        backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzJgPfW8CjRobjkxcBnTDrwSh1a6v2I2HqyoDZeAEDuIsBIPJbEE96G-ewY8VOttdN2qsEy5ECvvHjUxQji6kxE7W1XAG9m9G3x7mLbxZeDw37OKqOXpLyiyjYktiz8AZrBzhp6Dsl6nMiMFN5Yv9VVZnzYXmP7McciYClPhK2WMINqkXotaqixGTe-VDkDRBzGd5IbbnoAB3Z3ya603_nrpaxTKHQF6jpAeHPh8oXCGqaG_SvulR2Wn6kCIaMKZtIxzZ_b6mZ3Y6G"
    },
    quote: "Defining the foundation of functional living through precise spatial zoning and movement flow.",
    intro: {
        since: "Since 2015",
        title: "Mastering Space and Form Across Kerala",
        description: [
            "Our journey began with a singular focus: to bring world-class spatial precision to Kerala's evolving residential and commercial landscapes. Based in Trivandrum, Kochi, and Calicut, Starwood has spent over a decade perfecting the art of the floor plan.",
            "We believe a plan is more than lines on paper; it is the blueprint for how life unfolds. Our documentation is tailored for seamless execution, bridging the gap between design vision and site reality."
        ],
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN9Stgco1wxjMHmfToouhb47tc8wbwBkQiWelbYRn22u6TuBDVJvSIgv-OsjL33plapzQkjGmhXGwzbuHsT1HIyuqreBspvhoKZFxfN1EnqPS2-7Jw01F1dbaA_mJABpBzXiRTQHUDvFfBJREGyW3uTEXxh2zGTy8UFI9KHHv2VU5F9UCRJl1ljd2OZbAHZCPsojxVYcyB2g0_Q0j7dOLnwyLeMKpbWO5aGyyvAqtNHYhJ-hQ4PNIfNZz9RyVuXJy3T-i-4wLhLnwR"
    },
    subServices: [
        {
            title: "Furniture Layout",
            description: "Optimizing ergonomics and circulation for harmonious living environments.",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUMRS-4oXXvhFSXzo1Wf2BsCBQ9Yfkq9YvBDTJTr7sZaz-KYbJuJsDArhrJwIJRz4_g1C8MDr3hJAIBFx2tKxZDaFpgQgj3bmMFgKY8SjPWoP-U3GkwR_w6uIz-9XthU4Hr-i-nKS5OBstFHudloE3TvWsLAuVaqodtpN5IvMHS2lqBq758ShzUjhP5p5B80xYrrv4OWkti5voOhriWImsxvD6hlYeKL8chYYGyAW7iLIQAnij71OWeKK7C-3YC3pO0-6H60B98Ceo"
        },
        {
            title: "Residential Plans",
            description: "Comprehensive spatial zoning for luxury villas and private residences.",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQoYPhwy1TTLoP3Lu4wZUMtOBKx33poW03OwcMRQTNQ0Ls2cqcz57CdpUMdnuQmRcnv1g-CdODcK6n-G68eAUnFRmum8sWqfkbC2P3b3vAz4JLy9sQwc5VdZfUiVd_ygudYUiG944Iy5qnLmcTYYGwIDY7mH7njjAQd1XF2OmvOcWVoDYJ1JYMTERzLHaKM492IFGtw2ingXMdhcImmn0JFTrrNcLKauQUNLnQMSgKRX6tNGYzflt87PEAtuirb_zYrnlcTwdnD41"
        },
        {
            title: "Commercial Layouts",
            description: "Efficiency-driven layouts for retail spaces and modern corporate offices.",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXipJh_DzRL5YXeYucTmUzHDqv3v7hSJHO1M86SsHcObi46onQKCGKB5U70a84EiNlPrUEsoLIR1_rVA4g2jS6vnJ6oh0XQ1_uOnPjdiNfrT1anZAKZ3akZ6P0rafW771pinUoPj6dzrt5tKl86Zb8Q4E3kNK-mQ6dz0a5FDowCfX9XoyoPpyzVxFQEZAQHVeOB9S06hrchuRw5cZ_-VNeEg2NNsUWM93ns7Shz5mstm3-bkzjLJTMicIbC1jBYfyaUhbdZWVcoGZi"
        }
    ],
    process: [
        {
            title: "Site Review & Analysis",
            description: "On-site technical survey and verification of existing conditions to establish an accurate base for planning."
        },
        {
            title: "Conceptual Zoning",
            description: "Developing the core spatial strategy, defining public versus private zones and the primary movement axes."
        },
        {
            title: "Furniture & Layout Draft",
            description: "Iterative drafting of furniture placements to ensure ergonomic comfort and optimal use of natural light."
        },
        {
            title: "Technical Refinement",
            description: "Integration of essential services including electrical points, plumbing nodes, and HVAC paths into the master plan."
        },
        {
            title: "Final Plan Issue",
            description: "Delivery of construction-ready documentation and execution guidelines for contractors and site engineers."
        }
    ],
    faqs: [
        {
            question: "What documents are included in a standard planning set?",
            answer: "A complete set includes the Furniture Layout, Flooring Plan, Electrical & Plumbing Layouts, and detailed Ceiling/Lighting Plans."
        },
        {
            question: "Can you work with existing architectural drawings?",
            answer: "Yes, we can optimize and detail architectural plans provided by your architect to ensure they are interior-ready."
        },
        {
            question: "Do you handle site measurements personally?",
            answer: "Absolutely. Accurate as-built measurements are critical. Our team visits sites across Kerala for digital measurement."
        },
        {
            question: "Is 3D visualization included in the planning phase?",
            answer: "While planning focuses on 2D layouts, we offer 3D visualization as a secondary phase to help you realize the volume of the space."
        },
        {
            question: "How long does the planning phase typically take?",
            answer: "Depending on the project scale, a detailed floor plan set typically takes 10 to 21 working days for completion."
        },
        {
            question: "Do your plans comply with local building regulations?",
            answer: "Yes, our designs respect regional Kerala building rules and traditional Vaastu principles if requested by the client."
        }
    ]
};

export const metadata: Metadata = {
    title: "Interior Floor Plans in Kerala | Starwood",
    description: "Defining the foundation of functional living through precise spatial zoning and movement flow.",
};

interface ServiceDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ServiceDetailPage(props: ServiceDetailPageProps) {
    const params = await props.params;

    // In the future, use params.slug to fetch specific data.
    // For now, we use the static SERVICE_DATA as a template.
    const { slug } = params;

    return (
        <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
            <ServiceDetailHero
                title={SERVICE_DATA.hero.title}
                subtitle={SERVICE_DATA.hero.subtitle}
                backgroundImage={SERVICE_DATA.hero.backgroundImage}
            />

            <ServiceDetailQuote quote={SERVICE_DATA.quote} />

            <ServiceDetailIntro
                title={SERVICE_DATA.intro.title}
                since={SERVICE_DATA.intro.since}
                description={SERVICE_DATA.intro.description}
                imageSrc={SERVICE_DATA.intro.imageSrc}
            />

            <ServiceDetailSubServices services={SERVICE_DATA.subServices} />

            <ServiceDetailStats />

            <ServiceDetailProcess steps={SERVICE_DATA.process} />

            <ServiceDetailFAQ faqs={SERVICE_DATA.faqs} />

            <ServiceDetailCTA />
        </div>
    );
}
