"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <header className="relative w-full h-screen min-h-[700px] flex flex-col justify-end pb-24">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-transform duration-[2000ms] hover:scale-105"
                style={{
                    backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzJgPfW8CjRobjkxcBnTDrwSh1a6v2I2HqyoDZeAEDuIsBIPJbEE96G-ewY8VOttdN2qsEy5ECvvHjUxQji6kxE7W1XAG9m9G3x7mLbxZeDw37OKqOXpLyiyjYktiz8AZrBzhp6Dsl6nMiMFN5Yv9VVZnzYXmP7McciYClPhK2WMINqkXotaqixGTe-VDkDRBzGd5IbbnoAB3Z3ya603_nrpaxTKHQF6jpAeHPh8oXCGqaG_SvulR2Wn6kCIaMKZtIxzZ_b6mZ3Y6G")',
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
            <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <p className="text-white/90 uppercase tracking-[0.2em] text-xs font-medium mb-6">
                        Interior Architecture & Design
                    </p>
                    <h2 className="text-white text-6xl md:text-8xl font-serif italic font-medium leading-[1.1] tracking-tight mb-10">
                        Elevating the <br /> <span className="not-italic">Art of Living.</span>
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Link href="/projects">
                            <button className="bg-white text-black hover:bg-stone-200 border border-white px-10 py-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300">
                                View Portfolio
                            </button>
                        </Link>
                        <span className="w-12 h-[1px] bg-white/50 hidden md:block"></span>
                        <p className="text-white/80 text-sm font-light max-w-xs leading-relaxed">
                            Creating bespoke environments that harmonize luxury with minimalist principles.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
