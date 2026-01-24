import Link from "next/link";

export default function ProjectsCTA() {
    return (
        <section className="py-32 bg-stone-50 border-y border-stone-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
                <h3 className="text-4xl md:text-5xl font-serif italic text-stone-900 leading-tight mb-12">
                    Begin your design journey <br /> with Starwood.
                </h3>
                <Link
                    href="/contact"
                    className="inline-block border border-stone-900 px-16 py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-stone-900 hover:text-white transition-all duration-300"
                >
                    Start Your Project
                </Link>
            </div>
        </section>
    );
}
