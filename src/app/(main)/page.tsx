import Hero from "@/components/home/Hero";
import Philosophy from "@/components/home/Philosophy";
import SelectedWorks from "@/components/home/SelectedWorks";
import ProjectSpotlight from "@/components/home/ProjectSpotlight";
import TestimonialSection from "@/components/home/TestimonialSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import RecentBlogs from "@/components/home/RecentBlogs";
import { getBooleanSetting } from "@/lib/settings";

export default async function HomePage() {
  const blogsEnabled = await getBooleanSetting("blogs_enabled", true);

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Philosophy />
      <SelectedWorks />
      <ProjectSpotlight />
      <FAQSection />
      <RecentBlogs blogsEnabled={blogsEnabled} />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}
