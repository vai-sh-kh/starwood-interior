export interface SubService {
    title: string;
    description: string;
    imageSrc: string;
}

export interface ProcessStep {
    title: string;
    description: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface ServiceData {
    slug: string;
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
    };
    quote: string;
    intro: {
        since: string;
        title: string;
        description: string[];
        imageSrc: string;
    };
    subServices: SubService[];
    process: ProcessStep[];
    faqs: FAQItem[];
    // For listing page
    listingImage: string;
    listingTitle: string;
    listingDescription: string;

    // New fields
    whoIsThisFor?: {
        title: string;
        description: string | string[];
    };
    subServicesNote?: string;
    designStyles?: {
        title: string;
        styles: string[];
        description: string;
    };
    processOverview?: string;
}

export const SERVICES_DATA: ServiceData[] = [
    // 1. Residential Interiors
    {
        slug: "residential-interiors",
        hero: {
            title: "Residential Interiors",
            subtitle: "in Trivandrum.",
            backgroundImage: "/images/services/resedential-interior.jpg"
        },
        quote: "Transforming houses into homes through thoughtful design and meticulous craftsmanship.",
        intro: {
            since: "Since 2015",
            title: "We provide comprehensive residential interior design services across major city hotspots in Trivandrum, with a strong focus on long-term value, functionality, and aesthetics.",
            description: [
                "Since 2015, we have helped over 100 homeowners across Kazhakkoottam, Pattom, Kowdiar, and nearby areas transform their houses into functional living spaces tailored to real lifestyles.",
                "If you are searching for the best home, apartment, or villa interior designers near you, or a reliable team offering value for money interiors in Trivandrum, Starwood Interiors delivers the right balance of design creativity, quality execution, and transparent pricing."
            ],
            imageSrc: "/images/services/resedential-interior.jpg"
        },
        subServices: [
            {
                title: "Living Room Interiors",
                description: "Creating welcoming spaces that balance comfort with sophisticated aesthetics.",
                imageSrc: "/images/services/resedential/living-room.jpg"
            },
            {
                title: "Bedroom Interiors",
                description: "Designing restful sanctuaries tailored to your personal style and comfort needs.",
                imageSrc: "/images/services/resedential/bedroom.jpg"
            },
            {
                title: "Modular Kitchen Interiors",
                description: "Functional kitchen layouts optimized for efficiency and modern living.",
                imageSrc: "/images/services/resedential/modular-kitchen-interior.jpg"
            },
            {
                title: "Dining Area Interiors",
                description: "Elegant dining spaces designed for family gatherings and entertaining.",
                imageSrc: "/images/services/resedential/dining-area.jpg"
            },
            {
                title: "Wardrobe & Storage Solutions",
                description: "Smart storage solutions that maximize space without compromising style.",
                imageSrc: "/images/services/resedential/wardrobe-storage.jpg"
            },
            {
                title: "Home Renovation",
                description: "Transforming existing spaces into modern, functional environments.",
                imageSrc: "/images/services/resedential/home-renovation.jpg"
            },
            {
                title: "False Ceiling & Lighting Design",
                description: "Enhancing ambience with creative ceiling designs and strategic lighting.",
                imageSrc: "/images/services/resedential/fale-ceiling.jpg"
            },
            {
                title: "Flooring & Wall Finishes",
                description: "Premium finishes that add character and durability to your interiors.",
                imageSrc: "/images/services/resedential/flooring-wall.jpg"
            }
        ],
        process: [
            { title: "Initial Consultation", description: "Understanding your vision, lifestyle requirements, and budget parameters through detailed discussions." },
            { title: "Space Analysis", description: "Comprehensive site survey and measurement to establish accurate planning foundations." },
            { title: "Concept Development", description: "Creating mood boards, material palettes, and preliminary layouts for your approval." },
            { title: "Detailed Design", description: "Developing construction drawings, 3D visualizations, and specification documents." },
            { title: "Execution & Handover", description: "Supervising implementation and ensuring quality delivery within committed timelines." }
        ],
        faqs: [
            {
                question: "1. Which areas in Trivandrum does Starwood Interiors serve?",
                answer: "Starwood Interiors provides residential interior design services across major areas in Trivandrum including Kowdiar, Vellayambalam, Pattom, Sasthamangalam, Vazhuthacaud, Kesavadasapuram, Ulloor, Palayam, East Fort, Kazhakkoottam, Sreekaryam, Karamana and nearby residential locations."
            },
            {
                question: "2. Does Starwood Interiors handle apartment and villa interior design?",
                answer: "Yes, we specialise in apartment interiors, villa interiors, and independent house interior design, offering customised solutions based on layout, lifestyle needs, and budget."
            },
            {
                question: "3. Are your residential interior services budget-friendly?",
                answer: "We offer both budget-friendly and premium residential interior solutions with transparent pricing, ensuring quality execution without hidden costs."
            },
            {
                question: "4. How long does a residential interior project usually take?",
                answer: "Project timelines depend on the scope and size of the work. After finalising the design and materials, we provide a clear execution timeline and manage the project accordingly."
            },
            {
                question: "5. Do you provide complete interior design and execution?",
                answer: "Yes, Starwood Interiors offers end-to-end residential interior services including design planning, 3D visualisation, material selection, execution, and final handover."
            },
            {
                question: "6. Can I customise the design style for my home?",
                answer: "Absolutely. Whether you prefer contemporary, minimalist, Scandinavian, premium, or traditional interiors, each design is customised to suit your home and personal preferences."
            }
        ],
        listingImage: "/images/services/resedential-interior.jpg",
        listingTitle: "Residential Interior Designs",
        listingDescription: "We provide comprehensive residential interior design services across major city hotspots in Trivandrum, with a strong focus on long-term value, functionality, and aesthetics.",
        whoIsThisFor: {
            title: "Who This Is For",
            description: "Our residential interior design services are ideal for homeowners, apartment owners, and villa residents in Trivandrum seeking functional, well-planned, and long-lasting interiors."
        },
        designStyles: {
            title: "Design Styles We Specialise In",
            styles: [
                "Contemporary",
                "Minimalist",
                "Premium",
                "Scandinavian",
                "Traditional"
            ],
            description: "Each design style is customized to suit your home layout and personal preferences."
        },
        processOverview: "Backed by 10+ years of experience and 100+ completed residential projects across Trivandrum, we follow a structured and transparent process, from requirement discussion to final handover."
    },

    // 2. Commercial Interiors
    {
        slug: "commercial-interiors",
        hero: {
            title: "Commercial Interior Design",
            subtitle: "in Trivandrum.",
            backgroundImage: "/images/services/commercial-interiors.jpg"
        },
        quote: "Designing workspaces that inspire productivity and reflect your brand identity.",
        intro: {
            since: "Since 2015",
            title: "Commercial Interior Design in Trivandrum",
            description: [
                "We offer comprehensive commercial interior design service across major business hubs in Trivandrum. Since 2015, we have partnered with offices, retail spaces, and commercial establishments across Kazhakkoottam, Pattom, Kowdiar, and nearby locations to deliver interiors that support daily operations and long-term business needs.",
                "If you are looking for experienced commercial interior designers in Trivandrum, or a dependable team for commercial interior design or renovations, Starwood Interiors offers a practical balance of design planning, execution quality, and transparent pricing."
            ],
            imageSrc: "/images/services/commercial-interiors.jpg"
        },
        whoIsThisFor: {
            title: "Who This Is For",
            description: "Our commercial interior design services are suited for business owners, startups, corporates, and professionals in Trivandrum who need efficient, well-planned, and durable commercial spaces."
        },
        subServices: [
            {
                title: "Office Interior Design",
                description: "Corporate offices, IT offices, and co-working spaces.",
                imageSrc: "/images/services/commercial/office-interior.jpg"
            },
            {
                title: "Restaurant Interior Design",
                description: "Cafes, fine dining, and casual dining establishments.",
                imageSrc: "/images/services/commercial/resturant-interior.jpg"
            },
            {
                title: "Retail Store Interior Design",
                description: "Apparel, electronics, furniture, and multi-brand stores.",
                imageSrc: "/images/services/commercial/retail-tore.jpg"
            },
            {
                title: "Showroom Interior Design",
                description: "Car showrooms, furniture showrooms, and other display spaces.",
                imageSrc: "/images/services/commercial/showroom-interior.jpg"
            },
            {
                title: "Clinic & Hospital Interior Design",
                description: "Hospitals, clinics, dental offices, and wellness centers.",
                imageSrc: "/images/services/commercial/clinic-interior.jpg"
            },
            {
                title: "Cafe Interior Design",
                description: "Standalone cafes and specialty coffee shops.",
                imageSrc: "/images/services/commercial/cafe-interior.jpg"
            },
            {
                title: "Salon & Wellness Center Interiors",
                description: "Beauty salons, spas, and fitness studios.",
                imageSrc: "/images/services/commercial/saloon-interior.jpg"
            }
        ],
        subServicesNote: "Detailed insights, use cases, and cost considerations for these services are shared through our blog, helping businesses make informed decisions before execution.",
        designStyles: {
            title: "Design Approaches We Work With",
            styles: [
                "Corporate",
                "Contemporary",
                "Minimalist",
                "Premium",
                "Function-led"
            ],
            description: "Each approach is adapted based on your business workflow, operational requirements, and brand identity rather than a fixed design template."
        },
        process: [
            { title: "Requirement Assessment", description: "Understanding operational needs and space usage." },
            { title: "Space Planning", description: "Optimizing layout for efficiency and flow." },
            { title: "Design Finalisation", description: "Locking in aesthetics and functional details." },
            { title: "Execution", description: "Carrying out construction with quality control." },
            { title: "Final Handover", description: "Delivering the finished space ready for operations." }
        ],
        processOverview: "Our process covers requirement assessment, space planning, design finalisation, execution, and final handover. Every phase is carefully coordinated to minimise operational disruption while maintaining quality and timelines.",
        faqs: [
            {
                question: "1. Do you offer office interior design services in Trivandrum?",
                answer: "Yes, we provide complete office interior design services in Trivandrum, including planning, design, and execution for workspaces of all sizes."
            },
            {
                question: "2. Do you handle commercial renovation projects?",
                answer: "Yes, we undertake commercial renovation and remodelling projects to upgrade existing workspaces with minimal disruption."
            },
            {
                question: "3. What types of commercial spaces do you work on?",
                answer: "We work on offices, retail stores, showrooms, reception areas, and other functional commercial spaces."
            },
            {
                question: "4. How do you approach commercial interior design projects?",
                answer: "Each project begins with understanding operational needs and space usage, followed by planning, design, execution, and final handover."
            },
            {
                question: "5. Are your commercial interior services budget-friendly?",
                answer: "We offer flexible commercial interior solutions ranging from cost-effective designs to premium finishes, with transparent pricing."
            },
            {
                question: "6. Which areas in Trivandrum do you serve?",
                answer: "We serve major commercial and business zones including Kazhakkoottam, Pattom, Kowdiar, and all major nearby locations."
            },
            {
                question: "7. Do you provide both design and execution?",
                answer: "Yes, Starwood Interiors handles both design and execution, ensuring accountability and quality control throughout the project."
            }
        ],
        listingImage: "/images/services/commercial-interiors.jpg",
        listingTitle: "Commercial Interior Design",
        listingDescription: "We offer comprehensive commercial interior design service across major business hubs in Trivandrum. Since 2015, we have partnered with offices, retail spaces, and commercial establishments."
    },

    // 3. 3D Rendering
    {
        slug: "3d-rendering",
        hero: {
            title: "3D Rendering Services",
            subtitle: "in Kerala.",
            backgroundImage: "/images/services/3d-interior-design.jpg"
        },
        quote: "Visualize your space before a single nail is driven, with photorealistic 3D renders.",
        intro: {
            since: "Since 2015",
            title: "3D Rendering Services in Kerala",
            description: [
                "Starwood Interiors offers professional 3D rendering services in Kerala to help homeowners, architects, and businesses visualise spaces before execution. Our realistic 3D renders provide accurate previews of interiors, layouts, lighting, and finishes, enabling clients to make confident design decisions.",
                "Since 2015, we have delivered 3D rendering solutions for residential homes, villas, apartments, offices, and commercial spaces across Kerala and the GCC region.",
                "If you are looking for reliable 3D interior visualisation services near you, Starwood Interiors combines design expertise, realistic 3D representation, and transparent timelines to make your vision tangible before the first implementation step."
            ],
            imageSrc: "/images/services/3d-interior-design.jpg"
        },
        whoIsThisFor: {
            title: "Who This Is For",
            description: "Our 3D rendering services are ideal for homeowners, architects, interior designers, and business owners in Kerala who want to visualise interiors before making decisions."
        },
        subServices: [
            {
                title: "Residential Interior 3D Rendering",
                description: "Living rooms, bedrooms, kitchens, and complete home.",
                imageSrc: "/images/services/3d-rendering/resedential-rendering.jpg"
            },
            {
                title: "Commercial Interior 3D Rendering",
                description: "Offices, retail stores, showrooms, and reception areas.",
                imageSrc: "/images/services/3d-rendering/cmmercial-3d-rendering.jpg"
            },
            {
                title: "Virtual Renovation Previews",
                description: "Visualising remodels before starting work.",
                imageSrc: "/images/services/3d-rendering/virtual-renovation.jpg"
            },
            {
                title: "Lighting & Material Simulations",
                description: "Test colors, textures, and lighting effects in realistic views.",
                imageSrc: "/images/services/3d-rendering/lighting.jpg"
            },
            {
                title: "Walkthroughs & Animations",
                description: "Immersive 3D tours for clients to explore spaces.",
                imageSrc: "/images/services/3d-rendering/animation.jpg"
            }
        ],
        subServicesNote: "Each rendering project is customized based on your floor plan & requirements.",
        designStyles: {
            title: "Why Choose 3D Rendering?",
            styles: [
                "Visual Clarity",
                "Design Accuracy",
                "Material & Finish Testing",
                "Faster Decision Making"
            ],
            description: "Our 3D rendering services provide visual clarity, design accuracy, and the ability to test materials and finishes before execution."
        },
        process: [
            { title: "Brief & References", description: "Collecting your design preferences, mood boards, and reference images." },
            { title: "3D Modeling", description: "Creating accurate 3D models based on floor plans and design specifications." },
            { title: "Material & Lighting", description: "Applying realistic textures, materials, and lighting setups." },
            { title: "Draft Review", description: "Presenting initial renders for feedback and refinements." },
            { title: "Final Delivery", description: "Delivering high-resolution renders in multiple formats and angles." }
        ],
        processOverview: "Based on your floor plan, we start by understanding your space, requirements, and design expectations. Our team then creates detailed 3D visualisations and walkthroughs, allowing you to finalise materials, colours, and layouts before the execution phase.",
        faqs: [
            {
                question: "1. What is 3D rendering in interior design?",
                answer: "3D rendering is the process of creating realistic visualisations of interior spaces using computer graphics, allowing clients to see the final design before construction."
            },
            {
                question: "2. Can 3D renders be created for both residential and commercial spaces?",
                answer: "Yes, we provide 3D rendering for homes, apartments, offices, retail stores, showrooms, and other commercial interiors."
            },
            {
                question: "3. How long does it take to get a 3D render?",
                answer: "The timeline depends on project size and complexity. Typically, small residential rooms take 3–5 business days, while larger or commercial spaces may take 1–2 weeks."
            },
            {
                question: "4. Can I modify the design after seeing the 3D render?",
                answer: "Absolutely. Our 3D renders allow you to make adjustments to layouts, colors, finishes, and lighting before final execution."
            },
            {
                question: "5. Do you provide 3D walkthroughs or animations?",
                answer: "Yes, we offer immersive 3D walkthroughs and animated tours to help you experience the space virtually."
            }
        ],
        listingImage: "/images/services/3d-interior-design.jpg",
        listingTitle: "3D Interior Rendering",
        listingDescription: "Starwood Interiors offers professional 3D rendering services in Kerala to help homeowners, architects, and businesses visualise spaces before execution."
    },

    // 4. Joinery Shop Drawings
    {
        slug: "joinery-shop-drawings",
        hero: {
            title: "Joinery Shop Drawings",
            subtitle: "in Kerala.",
            backgroundImage: "/images/services/joinery-shop-drawing.jpg"
        },
        quote: "Precision technical drawings that bridge design intent and workshop reality.",
        intro: {
            since: "Since 2015",
            title: "Joinery Shop Drawings in Kerala",
            description: [
                "Starwood Interiors provides detailed and accurate joinery shop drawing services across Kerala, supporting interior designers, architects, contractors, and homeowners with execution-ready technical drawings.",
                "Our shop drawings are created to eliminate site-level confusion, reduce material wastage, and ensure seamless coordination between design intent and on-site fabrication. With over a decade of experience in interior execution, we understand exactly what carpenters and joinery teams need on-site.",
                "Since 2015, we have supported interior projects across Trivandrum, Kochi, Calicut, and nearby locations by delivering precise joinery drawings that speed up fabrication and improve finishing quality.",
                // "If you are looking for reliable joinery shop drawings in Kerala that are practical, clear, and execution-friendly, Starwood Interiors ensures accuracy, clarity, and professional detailing.",
                // "Why Choose Starwood Interiors for Joinery Shop Drawings:",
                "Starwood Interiors combines technical expertise with scalable drawing capacity, making us a reliable long-term partner for joinery and interior execution projects across Kerala.",
                "• Affordable rates with uncompromised drawing accuracy and quality",
                "• Capacity to deliver 500+ joinery shop drawings per month",
                "• Team of 20+ Gulf-experienced joinery and fit-out professionals",
                "• Strong expertise in detailed joinery, furniture, and fit-out shop drawings",
                "This allows us to support both small-scale residential projects and large-volume commercial or builder-led interior works without delays or quality compromise."
            ],
            imageSrc: "/images/services/joinery-shop-drawing.jpg"
        },
        whoIsThisFor: {
            title: "Who This Is For",
            description: [
                "Our joinery shop drawing services are ideal for:",
                "• Interior designers needing execution-ready drawings",
                "• Architects handling residential or commercial interiors",
                "• Joinery workshops and carpentry contractors",
                "• Builders and project managers",
                "• Homeowners executing custom furniture and interiors",
                "If your project requires zero-guesswork fabrication and clean site execution, this service is designed for you."
            ]
        },
        subServices: [
            {
                title: "Modular Kitchen Shop Drawings",
                description: "Detailed fabrication drawings for modular kitchen layouts and cabinets.",
                imageSrc: "/images/services/joinery-shop/modular-kitchen.jpg"
            },
            {
                title: "Wardrobe & Storage Shop Drawings",
                description: "Technical drawings for wardrobes, storage units, and built-ins.",
                imageSrc: "/images/services/joinery-shop/wardrobe.jpg"
            },
            {
                title: "TV Unit & Living Area Joinery Drawings",
                description: "Custom joinery details for TV units and living room furniture.",
                imageSrc: "/images/services/joinery-shop/tv-unit-living-area.jpg"
            },
            {
                title: "Bedroom Furniture Shop Drawings",
                description: "Drawings for beds, side tables, and other bedroom furniture.",
                imageSrc: "/images/services/joinery-shop/bedroom-furniture.jpg"
            },
            {
                title: "Office & Commercial Joinery Drawings",
                description: "Joinery details for office workstations, receptions, and commercial fit-outs.",
                imageSrc: "/images/services/joinery-shop/office-interiors.jpg"
            },
            {
                title: "Custom Furniture & Fixed Joinery Details",
                description: "Bespoke furniture drawings tailored to specific design requirements.",
                imageSrc: "/images/services/joinery-shop/furniture.jpg"
            },
            {
                title: "Material, Section & Elevation Details",
                description: "Comprehensive views showing materials, sections, and elevations.",
                imageSrc: "/images/services/joinery-shop/elevation.jpg"
            },
            {
                title: "Hardware, Finish & Installation Specifications",
                description: "Detailed specs for hardware, finishes, and installation procedures.",
                imageSrc: "/images/services/joinery-shop/hardware-instalation.jpg"
            }
        ],
        subServicesNote: "Each drawing set is prepared with fabrication logic in mind, ensuring smooth coordination between design, workshop production, and site installation.",
        designStyles: {
            title: "Types of Joinery We Handle",
            styles: [
                "Residential interiors",
                "Apartment and villa projects",
                "Commercial and office interiors",
                "Retail showrooms",
                "Hospitality interiors"
            ],
            description: "All drawings are customized based on site dimensions, material selection, and execution requirements."
        },
        process: [
            { title: "Design Understanding", description: "Design understanding and scope finalisation." },
            { title: "Site Integration", description: "Site measurement verification." },
            { title: "Drafting", description: "Detailed shop drawing preparation." },
            { title: "Review", description: "Review and revisions if required." },
            { title: "Final Issue", description: "Final issue for fabrication and execution." }
        ],
        processOverview: "Backed by 10+ years of interior execution experience in Kerala, our joinery shop drawing process follows a structured approach. This process ensures error-free fabrication and faster on-site execution.",
        faqs: [
            { question: "1. What are joinery shop drawings used for?", answer: "Joinery shop drawings are detailed technical drawings used for furniture fabrication and installation. They guide carpenters and workshops with exact dimensions, materials, sections, and fixing details." },
            { question: "2. Do you provide joinery shop drawings only in Kerala?", answer: "While our primary focus is Kerala, we also support projects remotely across India, depending on scope and requirements." },
            { question: "3. Can homeowners request joinery shop drawings?", answer: "Yes. Homeowners executing interiors independently can use our joinery drawings to avoid errors and ensure quality fabrication." },
            { question: "4. Do you include material and hardware details in the drawings?", answer: "Yes. Our drawings include material specifications, thickness, finishes, and hardware placement required for fabrication." },
            { question: "5. Can you coordinate with interior designers or contractors?", answer: "Absolutely. We regularly work alongside designers, architects, and contractors to ensure smooth execution." },
            { question: "6. Do you provide revisions if required?", answer: "Yes. Revisions are provided based on agreed scope to ensure drawings align perfectly with site conditions and client requirements." }
        ],
        listingImage: "/images/services/joinery-shop-drawing.jpg",
        listingTitle: "Joinery Shop Drawings",
        listingDescription: "Starwood Interiors provides detailed and accurate joinery shop drawing services across Kerala, supporting interior designers, architects, contractors, and homeowners."
    },

    // 5. Fit-Out Shop Drawings
    {
        slug: "fit-out-shop-drawings",
        hero: {
            title: "Fit-Out Shop Drawings",
            subtitle: "in Kerala.",
            backgroundImage: "/images/services/fit-out-shop-drawing.jpg"
        },
        quote: "Complete technical documentation for seamless interior fit-out execution.",
        intro: {
            since: "Since 2015",
            title: "Fit-Out Shop Drawings in Kerala",
            description: [
                "Starwood Interiors provides detailed fit-out shop drawing solutions across Kerala, helping interior projects move from concept to execution with complete technical clarity.",
                "Fit-out shop drawings act as the coordination backbone of interior execution. They translate approved designs into build-ready documentation covering layouts, sections, elevations, service integration, and installation references. Our drawings are prepared with on-site practicality in mind, ensuring smooth execution and reduced site errors.",
                "Since 2015, we have supported residential and commercial interior projects across Trivandrum, Kochi, Calicut, and other Kerala locations by delivering technically accurate fit-out drawings aligned with real execution workflows.",
                "If you need reliable fit-out shop drawings in Kerala that support faster execution, trade coordination, and quality finishes, Starwood Interiors delivers consistent and dependable results."
            ],
            imageSrc: "/images/services/fit-out-shop-drawing.jpg"
        },
        whoIsThisFor: {
            title: "Who This Is For",
            description: "Our fit-out shop drawing services are suitable for interior design firms, architects, fit-out contractors, builders, developers, and commercial project managers. This service is ideal for projects where coordination accuracy is critical to timelines and quality."
        },
        subServices: [
            {
                title: "Space Planning & Layouts",
                description: "Optimized layouts for efficient space usage and execution planning.",
                imageSrc: "/images/services/fit-out-shop/space-planing.webp"
            },
            {
                title: "Ceiling, Partition & Wall Detailing",
                description: "Comprehensive technical details for false ceilings, partitions, and wall treatments.",
                imageSrc: "/images/services/fit-out-shop/ceiling-partition.jpg"
            },
            {
                title: "Electrical, Lighting & Services Coordination Drawings",
                description: "Electrical, lighting, and service coordination to minimise site conflicts.",
                imageSrc: "/images/services/fit-out-shop/electrical-lighting.jpg"
            },
            {
                title: "Flooring, Skirting & Finish Layouts",
                description: "Exact layout patterns, skirting details, and flooring finish specifications.",
                imageSrc: "/images/services/fit-out-shop/flooring-finih-layout.jpg"
            },
            {
                title: "Furniture Placement & Integration",
                description: "Precise placement and integration details for fixed and loose furniture.",
                imageSrc: "/images/services/fit-out-shop/furniture-placment.jpg"
            },
            {
                title: "Elevation, Section & Detail Drawings",
                description: "Vertical views and intricate construction details for accurate fabrication.",
                imageSrc: "/images/services/fit-out-shop/elevation.jpg"
            },
            {
                title: "Material & Installation Specs",
                description: "Detailed material, finish, and installation specifications for all trades.",
                imageSrc: "/images/services/fit-out-shop/material-intalation.jpg"
            },
            {
                title: "Site Coordination Drawings",
                description: "Execution reference drawings to assist on-site teams and supervisors.",
                imageSrc: "/images/services/fit-out-shop/ite-coordination-drawing.jpg"
            }
        ],
        subServicesNote: "Each drawing set is developed to ensure seamless alignment between design intent, site conditions, and execution methodology.",
        designStyles: {
            title: "Types of Projects We Support",
            styles: [
                "Residential interiors",
                "Apartment and villa fit-outs",
                "Office and corporate interiors",
                "Retail and commercial spaces",
                "Hospitality and institutional projects"
            ],
            description: "All drawings are tailored to project scope, site conditions, and execution requirements."
        },
        process: [
            { title: "Scope Understanding", description: "Understanding design intent and execution scope." },
            { title: "Site Coordination", description: "Site dimension review and coordination inputs." },
            { title: "Drawing Preparation", description: "Preparation of detailed fit-out shop drawings." },
            { title: "Review & Adjust", description: "Review cycles and technical clarifications." },
            { title: "Final Issue", description: "Final drawing issue for site execution." }
        ],
        processOverview: "With 10+ years of interior execution experience in Kerala, our fit-out shop drawing workflow follows a disciplined process. This structured approach helps avoid rework and ensures predictable execution outcomes.",
        faqs: [
            { question: "1. What is the difference between fit-out shop drawings and design drawings?", answer: "Fit-out shop drawings convert approved designs into execution-ready technical documents that guide site installation and trade coordination." },
            { question: "2. Do you handle both residential and commercial fit-out drawings?", answer: "Yes. We support residential, commercial, office, retail, and hospitality fit-out projects." },
            { question: "3. Can you coordinate drawings with MEP and other services?", answer: "Yes. Our fit-out drawings consider electrical, lighting, and service coordination to minimise site conflicts." },
            { question: "4. Are revisions included in the fit-out drawing service?", answer: "Revisions are provided based on the agreed scope and coordination requirements." },
            { question: "5. Do you provide drawings for turnkey interior contractors?", answer: "Yes. We regularly work with turnkey and fit-out contractors across Kerala." },
            { question: "6. Can you support fast-track fit-out projects?", answer: "Yes. Based on project scale and scope, we can support accelerated drawing timelines." }
        ],
        listingImage: "/images/services/fit-out-shop-drawing.jpg",
        listingTitle: "Fit-Out Shop Drawings",
        listingDescription: "Starwood Interiors provides detailed fit-out shop drawing solutions across Kerala, helping interior projects move from concept to execution with complete technical clarity."
    },

    // 6.Interior Floor Plans
    {
        slug: "interior-floor-plans",
        hero: {
            title: "Interior Floor Plans",
            subtitle: "in Kerala.",
            backgroundImage: "/images/services/interior-floor-plan.webp"
        },
        quote: "Defining the foundation of functional living through precise spatial zoning and movement flow.",
        intro: {
            since: "Since 2015",
            title: "Mastering Space and Form Across Kerala",
            description: [
                "Starwood Interiors provides accurate and well-planned interior floor plan services across Kerala, helping interior projects achieve better space utilisation, functional flow, and execution clarity.",
                "Interior floor plans form the foundation of every successful interior project. They define furniture placement, circulation paths, spatial zoning, and service planning before execution begins. Our floor plans are developed with real-life usage, site conditions, and build feasibility in mind.",
                "Since 2015, we have prepared interior floor plans for residential and commercial projects across Trivandrum, Kochi, Calicut, and other parts of Kerala, supporting smooth design approval and error-free execution.",
                "If you are looking for professional interior floor plans in Kerala that balance aesthetics, practicality, and technical accuracy, Starwood Interiors delivers dependable planning solutions."
            ],
            imageSrc: "/images/services/interior-floor-plan.webp"
        },
        whoIsThisFor: {
            title: "Who This Is For",
            description: [
                "Our interior floor planning services are suitable for:",
                "• Homeowners planning new interiors or renovations",
                "• Interior designers needing clear space planning support",
                "• Architects finalising interior layouts",
                "• Builders and developers planning residential units",
                "• Commercial project teams and consultants",
            ]
        },
        subServices: [
            {
                title: "Furniture Layout & Space Planning",
                description: "Optimizing ergonomics and circulation for harmonious environments.",
                imageSrc: "/images/services/floor-plans/furniture-layout.png"
            },
            {
                title: "Residential Interior Floor Plans",
                description: "Comprehensive spatial zoning for homes, apartments, and villas.",
                imageSrc: "/images/services/floor-plans/resedential-interior.jpg"
            },
            {
                title: "Apartment & Villa Floor Planning",
                description: "Tailored layouts for multi-level villas and modern apartments.",
                imageSrc: "/images/services/floor-plans/appartment-villa.jpg"
            },
            {
                title: "Office & Commercial Space Layouts",
                description: "Efficiency-driven layouts for corporate offices and retail spaces.",
                imageSrc: "/images/services/floor-plans/office-interiors.jpg"
            },
            {
                title: "Kitchen, Bedroom & Living Area Planning",
                description: "Detailed planning for key functional areas of the home.",
                imageSrc: "/images/services/floor-plans/kitchen-bedroom.jpg"
            },
            {
                title: "Circulation, Zoning & Clearance Planning",
                description: "Ensuring smooth movement flow and appropriate functional zones.",
                imageSrc: "/images/services/floor-plans/circulation-zoning.jpg"
            },
            {
                title: "Electrical & Service Reference Layouts",
                description: "Layouts integrating electrical and service points with interior design.",
                imageSrc: "/images/services/floor-plans/electrical.jpg"
            },
            {
                title: "Execution-Ready Floor Plan Documentation",
                description: "Detailed plans ready for contractor execution and site work.",
                imageSrc: "/images/services/floor-plans/execution-redy-floor.webp"
            }
        ],
        subServicesNote: "Each plan is prepared with attention to movement flow, usability, and execution practicality.",
        designStyles: {
            title: "Types of Projects We Support",
            styles: [
                "Residential interiors",
                "Apartments and villas",
                "Office and corporate spaces",
                "Retail and commercial interiors",
                "Renovation and retrofit projects"
            ],
            description: "All floor plans are customised based on site dimensions, lifestyle needs, and project objectives."
        },
        process: [
            { title: "Requirement Analysis", description: "Understanding client requirements and lifestyle needs." },
            { title: "Site Assessment", description: "Reviewing site drawings and measurements." },
            { title: "Plan Development", description: "Preparing detailed interior floor plans." },
            { title: "Refinement", description: "Plan review and refinement." },
            { title: "Final Delivery", description: "Final plan issue for design and execution use." }
        ],
        processOverview: "With 10+ years of interior planning and execution experience in Kerala, our interior floor plan process includes understanding client requirements, reviewing site drawings, preparing detailed plans, refinement, and final delivery. This approach ensures functional layouts that translate smoothly into on-site execution.",
        faqs: [
            { question: "1. What is an interior floor plan used for?", answer: "Interior floor plans define furniture placement, movement flow, and space zoning, helping guide interior design and execution decisions." },
            { question: "2. Do you provide floor plans for residential projects only?", answer: "No. We prepare interior floor plans for residential, commercial, office, and retail projects." },
            { question: "3. Can homeowners request only floor planning services?", answer: "Yes. Homeowners can request standalone interior floor planning without full execution services." },
            { question: "4. Do your floor plans consider electrical and service requirements?", answer: "Yes. We provide reference layouts that help align electrical and service planning with interior layouts." },
            { question: "5. Are revisions included in the floor planning service?", answer: "Revisions are provided based on the agreed scope and planning stage." },
            { question: "6. Can these floor plans be used for execution and shop drawings?", answer: "Yes. Our interior floor plans are prepared to support further detailing and execution documentation." }
        ],
        listingImage: "/images/services/interior-floor-plan.webp",
        listingTitle: "Interior Floor Plans",
        listingDescription: "Starwood Interiors provides accurate and well-planned interior floor plan services across Kerala, helping interior projects achieve better space utilisation and execution clarity."
    }
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
    return SERVICES_DATA.find(service => service.slug === slug);
}

export const HOME_SERVICES_LIST = SERVICES_DATA.slice(0, 6).map((service, index) => ({
    title: service.listingTitle, // Use full listingTitle instead of truncated hero title
    // Actually, looking at the design in ServiceHome, titles are short: "Design Concept", "Execution".
    // Wait, the current ServiceHome has "Process" steps, not "Services".
    // The user said: "update the home page service section with the data from service page data".
    // Does he mean the PROCESS steps? Or the actual SERVICES?
    // "create another array of data and use that for selected service section in home page"
    // The current ServiceHome has "How we work" -> "Requirement Discussion", "Design Concept".
    // If I replace that with "Residential", "Commercial", it changes the section from "Process" to "Services".
    // "update the home page service section... with the data from service page data"
    // I will assume he wants to list the SERVICES (Residential, Commercial, etc.) there.
    // So I will map SERVICES_DATA.
    fullTitle: service.hero.title,
    // title: service.listingTitle.split(" ")[0] + " " + (service.listingTitle.split(" ")[1] || ""), // Shorten for display? Or use full?
    // Let's use `hero.title` but maybe simplified.
    // Actually, let's just use the `title` from `hero`.
    description: service.listingDescription, // Or maybe short description?
    active: index === 1, // Make 2nd item active like before? Or 0? Let's make index 1 active (Commercial) or just keep logic.
    count: `0${index + 1}`,
    image: service.listingImage,
    slug: service.slug
}));
