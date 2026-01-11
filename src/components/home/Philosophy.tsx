import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Philosophy() {
    return (
        <section className="py-24 md:py-32 bg-stone-50" id="philosophy">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                            <Image
                                alt="Starwood Design Team"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN7b30ImI73PNDuJy-i2ch2XH23T5CEROd1ajdJY4Y8rLBBNWNPjGCosicdKA0SxMGBMhKDfuY37RZN1yqzxbWsKBmJbNTETdlxc7YuwkH4EVUJUjSX1s05uVUv0L5061bbADdg-SjjuMruEsFCmlhcq-fbEQO_iNTGn_WdGp32mEnBpITTcfagFwBEFKPNwEdYfaLvrF8nEH6tCagUTx9Q8DTekDfx9mMN8-QmZOArajk55xBQdNm1wTPXP1Q5C38PHj7h0-Zj2K9"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2">
                        <span className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6"> Our Philosophy </span>
                        <h3 className="text-4xl md:text-5xl font-serif text-black mb-8 leading-tight">
                            We believe that true luxury lies in the <span className="italic text-gray-500">absence of the unnecessary.</span>
                        </h3>
                        <div className="space-y-6 text-lg font-light text-gray-600 leading-relaxed max-w-xl">
                            <p>
                                At Starwood, our process is rooted in a deep understanding of space and light. We strip away the superfluous to reveal the essential beauty of structure and material.
                            </p>
                            <p>
                                Our team of architects and designers works collaboratively to craft environments that are not just visually stunning, but profoundly resonant. We curate every detail, from the broad strokes of architectural form to the tactile nuance of a fabric swatch.
                            </p>
                        </div>
                        <div className="mt-10">
                            <Link
                                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium border-b border-black pb-1 hover:text-gray-600 transition-colors"
                                href="/about-us"
                            >
                                Meet the Team
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
