import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ProjectSpotlight() {
    return (
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgmjybtIbCYHE2jf_FLemsIejhX6RRDYnFL65TGqVkQTbZKmrhORxJ2Y-QmQ3f0KybOOWWkYThG0uQnOevPodYqu0QA-7ge3MC4Z8GYpjlzseRVWPvzCi5j6TreGrautE4AYzqVNJQ1b5VXQxOSLWRaRU1JPGqzd5Wfj4QdB5bKaQDbaPQAF3pN195eV-UQkWvKcY1KFv6gBkqZ6bI3-u5oUxPO7xuekOtSWJH0iaHZcTracryipWpKPY0r4dwoBygfbXQ8EqDUD3u')",
                }}
            ></div>
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
                <div className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                        <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] block mb-2">About Starwood</span>
                        <h2 className="text-4xl md:text-5xl font-serif">Why Choose Starwood Interiors?</h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-light text-stone-300">Since 2015</p>
                        <p className="text-sm font-light text-stone-300">Leading interior design firm</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="relative aspect-video w-full overflow-hidden bg-stone-800">
                            <Image
                                alt="Aspen Residence Living Room"
                                fill
                                className="object-cover"
                                src="/images/why-us-1.webp"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                        </div>
                        {/* <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-64 w-full">
                                <Image
                                    alt="Detail Shot"
                                    fill
                                    className="object-cover"
                                    src="/images/why-us-2.png"
                                    sizes="(max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <div className="bg-stone-800 p-8 flex flex-col justify-center">
                                <p className="font-serif text-2xl italic mb-4">
                                    &quot;A dialogue between the raw mountain landscape and refined interior warmth.&quot;
                                </p>
                            </div>
                        </div> */}
                    </div>
                    <div className="lg:col-span-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-serif mb-6">Trusted Interior Designer in Trivandrum</h3>
                            <p className="text-stone-400 font-light mb-10 leading-relaxed">
                                Starwood Interiors provides professional interior design services in Trivandrum tailored to homes, apartments, and residential spaces. Our expert team delivers innovative design solutions, transparent communication, and excellent craftsmanship. Contact us today to begin your interior transformation.
                            </p>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4 mb-10 pb-10 border-b border-white/10">
                                <div>
                                    <p className="text-2xl font-bold text-white">100+</p>
                                    <p className="text-xs text-stone-400 mt-1">Satisfied clients</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">99%</p>
                                    <p className="text-xs text-stone-400 mt-1">Success rate</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">20+</p>
                                    <p className="text-xs text-stone-400 mt-1">Team members</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">10+</p>
                                    <p className="text-xs text-stone-400 mt-1">Years of experience</p>
                                </div>
                            </div>

                            {/* <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full bg-stone-700 overflow-hidden ring-1 ring-white/20">
                                        <Image
                                            alt="Oak"
                                            fill
                                            className="object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzqwYNpG2QrILLPj1nH6xpYSTubOJ-SVSiP7hJiTj5Obpym6XZWex6vvceOAH0F_nND9IlYcklrHAuzE8GWLnPReFOAVj3nb1_L10nnSYH-mTiJkViHs2NaT_efk8N7VGbL2jTXkZqDcvSeC65ZFKL11aBLXdwJiEsBrvCc5C0jcyH3M0ELrDEUDzZ61wVdT8c5yElfkqK8EhzaRgHD8A6nKroih6FGsZ6nEeynNFiY_xPsuy10C0G4EFO5cj5M2IhAjR-a3iY54o"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">White Oak</p>
                                        <p className="text-xs text-stone-500">Flooring & Cabinetry</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full bg-stone-700 overflow-hidden ring-1 ring-white/20">
                                        <Image
                                            alt="Stone"
                                            fill
                                            className="object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxe5CtCo68geZlqdDDKwRIuRxxWEkd87KrzPcvdyMD5aISqZGcsjxy_h2-uYhauqApp99dslbxLM8Q1lrtlEIK-Ii6z3dm7EdIj7mjyc5-z1WAGBrW4YQC56qgqhxTPCZjt3xSLDQxV1n3geNkdggEzuTmHWwtSdMIFm6xCtB898jLsm5ivPrt0ixyBUvDILhJhX0z2i3DJaYFaL7TEcKzQTW_eJ80oTf_03PYS4dhhsmVGoKwzTCSgQjrXreyZw6WUgdCR6F_ff4C"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Limestone</p>
                                        <p className="text-xs text-stone-500">Fireplace & Feature Walls</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full bg-stone-700 overflow-hidden ring-1 ring-white/20">
                                        <Image
                                            alt="Fabric"
                                            fill
                                            className="object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzEAPjdUyM8mWmsxQVR48eVDX9pWQqdbfd1O7cMpxQ3oJXnWHK8gWvn7i1BtU4ixvr4-sCS6xHUNZZzW8nfe-qrJU8SSgyRQ2-YIXa9rte9Ei8qXFS8o5M_wQIxSD98bEL1uGLaxm0FcNqPiH1fj-EOYe5a8bkiVxnhWqsm1htVfXOapneGgEI7wcxHHptENKBIwlGHyHHPSbKdDh50oUQFmi-fTLkTMgNNCdIJ-JqD8dzXeD1jbGWFs_6nfvssOZAEWIjUuYyJ5o"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Bouclé Wool</p>
                                        <p className="text-xs text-stone-500">Upholstery</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="mt-12 lg:mt-0">
                            <Link
                                className="inline-flex items-center gap-2 border border-white/30 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out group"
                                href="/about-us"
                            >
                                <span className="group-hover:opacity-90 transition-opacity duration-300">About us</span>
                                <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
