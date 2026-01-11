import Link from "next/link";

const projects = [
    {
        title: "The Loft",
        location: "New York",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUMRS-4oXXvhFSXzo1Wf2BsCBQ9Yfkq9YvBDTJTr7sZaz-KYbJuJsDArhrJwIJRz4_g1C8MDr3hJAIBFx2tKxZDaFpgQgj3bmMFgKY8SjPWoP-U3GkwR_w6uIz-9XthU4Hr-i-nKS5OBstFHudloE3TvWsLAuVaqodtpN5IvMHS2lqBq758ShzUjhP5p5B80xYrrv4OWkti5voOhriWImsxvD6hlYeKL8chYYGyAW7iLIQAnij71OWeKK7C-3YC3pO0-6H60B98Ceo",
        aspect: "aspect-[3/4]",
    },
    {
        title: "Coastal Retreat",
        location: "Malibu",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQoYPhwy1TTLoP3Lu4wZUMtOBKx33poW03OwcMRQTNQ0Ls2cqcz57CdpUMdnuQmRcnv1g-CdODcK6n-G68eAUnFRmum8sWqfkbC2P3b3vAz4JLy9sQwc5VdZfUiVd_ygudYUiG944Iy5qnLmcTYYGwIDY7mH7njjAQd1XF2OmvOcWVoDYJ1JYMTERzLHaKM492IFGtw2ingXMdhcImmn0JFTrrNcLKauQUNLnQMSgKRX6tNGYzflt87PEAtuirb_zYrnlcTwdnD41",
        aspect: "aspect-[4/3]",
    },
    {
        title: "Urban Sanctuary",
        location: "Tokyo",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7PuoGGBanbjSoL9ZgF0Ti2f5N0Irozf_-41MJQbrny630zS65QQ50xN7q_EdK6R3kU766KFNUBH2J-7pZylQdr8fLXkjgnCiG41A-dm25htZ4zqx0N3JPHQvxbdlp82IdqL3gCSzyt_Yqrcg-PjB4Kqgg1Av-K7mD3YvCbqMz2UTl-UDJZf78Q6OD33P8Iz-UmH4a6MGTCKlbEJRV97Wp_HfWk38GbfRHLrO1dugIdq6d8jt3KygM9OVOFcsGy5lc37UwWVGig7Re",
        aspect: "aspect-[3/4]",
    },
    {
        title: "Nordic Light",
        location: "Stockholm",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAC1XpVbQROpafFZQbWdWo84urD1YLvXUJAaHg7_7028wWSu4V5sph6wFeeNj6AjrcgS0ue2N-GFmTrPeX9G12CUsVRgdmoTgF-cZVsLguioRul25j3pAhGg7u9tJVH_PEXijP9-F1eCyqyNIUaU8yvO-AFnOPpwzpNme4LcAxp6Akue1MvOFeDdtJbmVWJCBR9XiZr_TMUzOHVbeJWOaWWIlpum8hf3yv66pCCXuHJPILfPfJGXHifB7RtNEaPG5fdNCINmRwASL1",
        aspect: "aspect-[4/5]",
    },
];

export default function SelectedWorks() {
    return (
        <section className="py-24 md:py-32 bg-white" id="projects">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
                    <div>
                        <span className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">Portfolio</span>
                        <h3 className="text-4xl font-serif text-black">Selected Works</h3>
                    </div>
                    <Link
                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
                        href="/works"
                    >
                        All Projects
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="flex flex-col gap-12">
                        {[projects[0], projects[2]].map((project, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className={`overflow-hidden w-full ${project.aspect} bg-gray-100`}>
                                    <div
                                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${project.image}")` }}
                                    ></div>
                                </div>
                                <div className="mt-4 flex justify-between items-baseline">
                                    <h4 className="text-xl font-serif group-hover:underline decoration-1 underline-offset-4">{project.title}</h4>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">{project.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-12 md:mt-24">
                        {[projects[1], projects[3]].map((project, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className={`overflow-hidden w-full ${project.aspect} bg-gray-100`}>
                                    <div
                                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${project.image}")` }}
                                    ></div>
                                </div>
                                <div className="mt-4 flex justify-between items-baseline">
                                    <h4 className="text-xl font-serif group-hover:underline decoration-1 underline-offset-4">{project.title}</h4>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">{project.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
