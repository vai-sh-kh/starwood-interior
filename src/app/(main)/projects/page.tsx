import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
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
    <>
      <PageContainer>
        <main className="py-12 md:py-24">
          <Projects />
          <BottomNav />
        </main>
      </PageContainer>
      <Footer />
    </>
  );
}
