import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PageContainer from "@/components/PageContainer";
import { ABOUT_US, TEAM_MEMBERS, IMAGES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Poliform",
  description:
    "At Luxuria, we believe that a well-designed space has the power to transform daily life. Our philosophy is rooted in the pursuit of timeless elegance, functional harmony, and unparalleled quality.",
};

export default function AboutUsPage() {
  return (
    <>
    <PageContainer>
      
      <main className="py-8 sm:py-12 md:py-16 lg:py-24">
        {/* Philosophy Section */}
        <section className="text-center mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          <p className="text-xs sm:text-sm text-stone-500 mb-2">
            {ABOUT_US.philosophy.subtitle}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-stone-900 mb-4 sm:mb-6 leading-tight">
            {ABOUT_US.philosophy.title.split(",")[0]},<br />
            {ABOUT_US.philosophy.title.split(",")[1]}
          </h1>
          <p className="max-w-2xl mx-auto text-stone-600 text-sm sm:text-base leading-relaxed px-4">
            {ABOUT_US.philosophy.description}
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          <div className="rounded-lg overflow-hidden aspect-[4/3] relative">
            <Image
              alt="A modern and elegant office interior with minimalist furniture and large windows."
              src={IMAGES.aboutUs.mission}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 mb-3 sm:mb-4 leading-tight">
              {ABOUT_US.mission.title}
            </h2>
            <p className="text-stone-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              {ABOUT_US.mission.description}
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 text-center mt-8">
              {ABOUT_US.mission.stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12 sm:mb-16 md:mb-24 lg:mb-32 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 leading-tight">
                {ABOUT_US.team.title}
              </h2>
              <p className="text-stone-600 mt-2 max-w-lg text-sm sm:text-base leading-relaxed">
                {ABOUT_US.team.subtitle}
              </p>
            </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <div className="rounded-lg overflow-hidden aspect-3/4 relative">
                  <Image
                    alt={member.alt}
                    src={member.image}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base sm:text-lg">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </PageContainer>

      <Footer />
    </>
  );
}
