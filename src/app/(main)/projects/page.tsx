import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - ConsMart",
  description:
    "Explore our portfolio of exceptional design and construction projects. Premium design solutions tailored to your unique vision.",
};

export default function ProjectsPage() {
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
