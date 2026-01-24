export default function ProjectsHeader() {
    return (
        <header className="relative w-full h-[75vh] min-h-[600px] flex flex-col justify-end pb-24">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-transform duration-[2000ms] hover:scale-105"
                style={{
                    backgroundImage: `url("/images/project-detail.png")`,
                }}
            ></div>
            {/* Black Overlay - Darker */}
            <div className="absolute inset-0 bg-black/50 z-[5]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
            <div className="relative z-20 max-w-[1600px] w-full mx-auto px-6 md:px-12">
                <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="block text-[10px] uppercase tracking-[0.5em] font-bold text-white/90 mb-6 drop-shadow-sm">
                        Curated Works
                    </span>
                    <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic font-light leading-none tracking-tighter drop-shadow-md">
                        Our Projects
                    </h2>
                    <div className="mt-8 w-24 h-[1px] bg-white/50"></div>
                </div>
            </div>
        </header>
    );
}
