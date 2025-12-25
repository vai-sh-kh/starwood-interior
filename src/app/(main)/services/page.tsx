import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import Services from "@/components/Services";
import { getBooleanSetting } from "@/lib/settings";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Starwood Interiors",
  description:
    "Crafting spaces that harmonize modern elegance with timeless design, our contemporary services bring creativity, comfort, and refined functionality to the home.",
};

export default async function ServicesPage() {
  const servicesEnabled = await getBooleanSetting("services_enabled", true);

  if (!servicesEnabled) {
    redirect("/");
  }

  return (
    <>
      <PageContainer>
        <main className="py-8 sm:py-12 md:py-16 lg:py-24">
          <Services />
        </main>

        <BottomNav />
      </PageContainer>

      <Footer />
    </>
  );
}
