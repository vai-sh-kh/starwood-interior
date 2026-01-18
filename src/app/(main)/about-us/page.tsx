import AboutHeader from "@/components/about/AboutHeader";
import AboutQuote from "@/components/about/AboutQuote";
import AboutMission from "@/components/about/AboutMission";
import AboutEvolution from "@/components/about/AboutEvolution";
import AboutValues from "@/components/about/AboutValues";
import AboutCompetencies from "@/components/about/AboutCompetencies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Starwood Interiors",
  description:
    "Since our inception in 2015, we have been dedicated to the pursuit of spatial excellence, blending artisanal craftsmanship with a global design language.",
};

export default function AboutUsPage() {
  return (
    <div className="">
      <AboutHeader />

      <AboutQuote />
      <AboutMission />
      <AboutEvolution />
      <AboutValues />
      <AboutCompetencies />
    </div>
  );
}
