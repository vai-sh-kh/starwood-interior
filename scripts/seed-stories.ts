
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Error: Missing env variables.");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
    db: {
        schema: 'public',
    },
});

const relatedStories = [
    {
        title: "The Art of Minimalist Living",
        slug: "art-of-minimalist-living",
        excerpt: "Discover how stripping away the non-essential can reveal the true beauty of your living space.",
        content: "<p>Minimalism is not just about having less; it's about making room for more: more time, more peace, and more creativity. In this post, we explore the philosophy behind minimalist design and how it can transform your daily life.</p><p>By focusing on essential elements—light, form, and material—we create spaces that are not only visually stunning but also deeply restorative.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCinG-OqKAwGh55zkUxoUQt6WffGUV89Eyg-SDFA2jlHysm-i7naBd42c39_Ab3WLULZKsPoLPLKifuqIhyu3QPv3nV-FaoPiTR0i-wZmgP-yZux-vLP51fPlLH-j3xkRdU6aX05QWGfVie6ad30AQ1dZ60Fwpwtks_I_WCTcv50YNc-pNO7GoXDIvSzgBEjyHsY16O4g4yczdbiv71qXMtDYrBWlaTWQQKMZOgjt0Qo77gSXM6f5M6gYpR3d4KYUiTar0mTkElUXqq",
        category_name: "Design",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Minimalism", "Design", "Lifestyle"]
    },
    {
        title: "Sustainable Materials in Modern Architecture",
        slug: "sustainable-materials-modern-architecture",
        excerpt: "Exploring the intersection of luxury and sustainability in contemporary home building.",
        content: "<p>Sustainability is no longer a trend; it is a necessity. Modern architecture is embracing eco-friendly materials that do not compromise on aesthetics or durability.</p><p>From reclaimed wood to energy-efficient glass, we look at how sustainable choices are shaping the future of luxury living.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVOUiDvMeNEZOD68Ox9l7z9Bb6dViHtu6CKJXaJ9mYNoTFf07giYUfDCFc1rX6S4Tw1fEXeweKRRXwcfWv5yo2A1SRHQk9AMtpFuVTgfFDafqPaR977Ko5miN1i-H3abnwpSr-OB8ZIM02KXFLdmsP0NeBw53PieLzEO7IpNEahvId3EZe6OitMv2apIeS4DmilhimYW5i4PyKfU5S4ufnE03aoGfrbVh_mo9W6uTymDKLFLkGtu7puGwE5ex6kjx6geQxk1Qsyf_Y",
        category_name: "Architecture",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Sustainability", "Architecture", "Eco-friendly"]
    },
    {
        title: "Creating Sanctuary at Home",
        slug: "creating-sanctuary-at-home",
        excerpt: "Tips for designing spaces that promote relaxation and well-being.",
        content: "<p>Your home should be your sanctuary—a place where you can escape the stresses of the outside world. In this article, we share practical tips for creating a calming atmosphere in your home.</p><p>Use soft lighting, comfortable textures, and a neutral color palette to design a space that invites relaxation and rejuvenation.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBneXdBr40h9kX9PaOdIoqqNsclodF8P2F5-q7qtOn0MtM5Xz_VPotHE4FfzbuuYFTjxk_ATyvTxjgKTjC4Fa6DMjvHXzde9r-b6OiRrsad7TPLb5XrWjrPprGZ_tZGCeMqlz40wtAhKu0Ydel6Gte3kaNC4MeLwzq4EpCQkb4fsraKsImRtBiKlRUxJ2yBILjJAglHeITxDZbkxH3RGSBZRdLj309W2tRo1a01U8vHosZNc1QMDoSLs-fzQu9e33JfJk0wFCuSWGFv",
        category_name: "Interiors",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Wellness", "Interiors", "Home"]
    },
    {
        title: "The Psychology of Color in Interior Design",
        slug: "psychology-of-color",
        excerpt: "How color choices influence mood and behavior in residential spaces.",
        content: "<p>Color is a powerful communication tool and can be used to signal action, influence mood, and even cause physiological reactions. Certain colors have been associated with increased blood pressure, increased metabolism, and eyestrain.</p><p>We explore how to use color theory to create the desired atmosphere in every room of your house.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCinG-OqKAwGh55zkUxoUQt6WffGUV89Eyg-SDFA2jlHysm-i7naBd42c39_Ab3WLULZKsPoLPLKifuqIhyu3QPv3nV-FaoPiTR0i-wZmgP-yZux-vLP51fPlLH-j3xkRdU6aX05QWGfVie6ad30AQ1dZ60Fwpwtks_I_WCTcv50YNc-pNO7GoXDIvSzgBEjyHsY16O4g4yczdbiv71qXMtDYrBWlaTWQQKMZOgjt0Qo77gSXM6f5M6gYpR3d4KYUiTar0mTkElUXqq",
        category_name: "Design",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Color Theory", "Design", "Psychology"]
    },
    {
        title: "Biophilic Design: Bringing the Outdoors In",
        slug: "biophilic-design-guide",
        excerpt: "Integrating natural elements into your home for a healthier living environment.",
        content: "<p>Biophilic design is an approach to architecture that seeks to connect building occupants more closely to nature. Biophilic designed buildings incorporate things like natural lighting and ventilation, natural landscape features and other elements for creating a more productive and healthy built environment for people.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVOUiDvMeNEZOD68Ox9l7z9Bb6dViHtu6CKJXaJ9mYNoTFf07giYUfDCFc1rX6S4Tw1fEXeweKRRXwcfWv5yo2A1SRHQk9AMtpFuVTgfFDafqPaR977Ko5miN1i-H3abnwpSr-OB8ZIM02KXFLdmsP0NeBw53PieLzEO7IpNEahvId3EZe6OitMv2apIeS4DmilhimYW5i4PyKfU5S4ufnE03aoGfrbVh_mo9W6uTymDKLFLkGtu7puGwE5ex6kjx6geQxk1Qsyf_Y",
        category_name: "Architecture",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Nature", "Architecture", "Wellness"]
    },
    {
        title: "Lighting Design: The Unsung Hero",
        slug: "lighting-design-unsung-hero",
        excerpt: "Why lighting is the most critical element of interior atmosphere.",
        content: "<p>Lighting can make or break a space. It highlights architectural features, sets the mood, and ensures functionality. A good lighting plan combines ambient, task, and accent lighting to create a versatile and welcoming environment.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBneXdBr40h9kX9PaOdIoqqNsclodF8P2F5-q7qtOn0MtM5Xz_VPotHE4FfzbuuYFTjxk_ATyvTxjgKTjC4Fa6DMjvHXzde9r-b6OiRrsad7TPLb5XrWjrPprGZ_tZGCeMqlz40wtAhKu0Ydel6Gte3kaNC4MeLwzq4EpCQkb4fsraKsImRtBiKlRUxJ2yBILjJAglHeITxDZbkxH3RGSBZRdLj309W2tRo1a01U8vHosZNc1QMDoSLs-fzQu9e33JfJk0wFCuSWGFv",
        category_name: "Interiors",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Lighting", "Interiors", "Technical"]
    },
    {
        title: "Minimalism vs. Maximalism",
        slug: "minimalism-vs-maximalism",
        excerpt: "Finding your personal style on the spectrum of design.",
        content: "<p>Whether you prefer clean lines and empty spaces or bold patterns and curated collections, your home should reflect your personality. We discuss the merits of both minimalism and maximalism and how to find a balance that works for you.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCinG-OqKAwGh55zkUxoUQt6WffGUV89Eyg-SDFA2jlHysm-i7naBd42c39_Ab3WLULZKsPoLPLKifuqIhyu3QPv3nV-FaoPiTR0i-wZmgP-yZux-vLP51fPlLH-j3xkRdU6aX05QWGfVie6ad30AQ1dZ60Fwpwtks_I_WCTcv50YNc-pNO7GoXDIvSzgBEjyHsY16O4g4yczdbiv71qXMtDYrBWlaTWQQKMZOgjt0Qo77gSXM6f5M6gYpR3d4KYUiTar0mTkElUXqq",
        category_name: "Design",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Style", "Design", "Trends"]
    },
    {
        title: "The Future of Smart Homes",
        slug: "future-of-smart-homes",
        excerpt: "Integrating technology seamlessly into luxury architecture.",
        content: "<p>Smart home technology is evolving rapidly. The challenge for architects is to integrate these systems without disrupting the aesthetic flow of the home. We look at the latest innovations in hidden tech and automated living.</p>",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVOUiDvMeNEZOD68Ox9l7z9Bb6dViHtu6CKJXaJ9mYNoTFf07giYUfDCFc1rX6S4Tw1fEXeweKRRXwcfWv5yo2A1SRHQk9AMtpFuVTgfFDafqPaR977Ko5miN1i-H3abnwpSr-OB8ZIM02KXFLdmsP0NeBw53PieLzEO7IpNEahvId3EZe6OitMv2apIeS4DmilhimYW5i4PyKfU5S4ufnE03aoGfrbVh_mo9W6uTymDKLFLkGtu7puGwE5ex6kjx6geQxk1Qsyf_Y",
        category_name: "Architecture",
        status: "published",
        author: "Starwood Interiors",
        tags: ["Technology", "Architecture", "Future"]
    }
];

async function seedStories() {
    console.log("\n🌱 Seeding Related Stories...");

    for (const story of relatedStories) {
        // 1. Get or Create Category
        let categoryId;
        const { data: categoryData, error: categoryError } = await supabaseAdmin
            .from('blog_categories')
            .select('id')
            .eq('name', story.category_name)
            .single();

        if (categoryData) {
            categoryId = categoryData.id;
        } else {
            console.log(`   Creating category: ${story.category_name}`);
            const { data: newCategory, error: createError } = await supabaseAdmin
                .from('blog_categories')
                .insert({ name: story.category_name, slug: story.category_name.toLowerCase() })
                .select('id')
                .single();

            if (createError) {
                console.error(`   ❌ Failed to create category ${story.category_name}:`, createError.message);
                continue;
            }
            categoryId = newCategory.id;
        }

        // 2. Insert Blog Post
        const { error: insertError } = await supabaseAdmin
            .from('blogs')
            .upsert({
                title: story.title,
                slug: story.slug,
                excerpt: story.excerpt,
                content: story.content,
                image: story.image,
                category_id: categoryId,
                status: story.status,
                author: story.author,
                tags: story.tags,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'slug' });

        if (insertError) {
            console.error(`   ❌ Failed to seed story "${story.title}":`, insertError.message);
        } else {
            console.log(`   ✅ Seeded story: "${story.title}"`);
        }
    }

    console.log("\n🎉 Seeding completed!\n");
}

seedStories();
