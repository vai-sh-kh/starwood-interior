import Projects from "@/components/Projects";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import CTASection from "@/components/home/CTASection";
import type { Metadata } from "next";
import { getBooleanSetting } from "@/lib/settings";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Projects - Starwood Interiors",
  description:
    "Explore our portfolio of exceptional design and construction projects. Premium design solutions tailored to your unique vision.",
};

export default async function ProjectsPage() {
  const projectsEnabled = await getBooleanSetting("projects_enabled", true);

  if (!projectsEnabled) {
    redirect("/");
  }

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
