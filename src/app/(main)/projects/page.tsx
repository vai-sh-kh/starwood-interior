import Projects from "@/components/Projects";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import CTASection from "@/components/home/CTASection";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Projects | Spaces We’ve Transformed | Starwood Interiors",
  description:
    "Discover our portfolio of interior solutions designed with clarity & craftsmanship. Explore our exceptional design and construction projects.",
};

export default function ProjectsPage() {

  return (
    <div className="bg-white text-stone-900 font-display overflow-x-hidden selection:bg-stone-900 selection:text-white">
      <ProjectsHeader />
      <main className="relative z-10">
        <Projects />
        <CTASection />
      </main>
    </div>
  );
}
