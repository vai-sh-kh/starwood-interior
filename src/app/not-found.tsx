import Link from "next/link";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <div className="relative flex w-full flex-col overflow-x-hidden bg-background-light pt-[60px]">
        {/* Hero Section */}
        <div className="relative w-full">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col justify-center items-center text-center">
            {/* 404 Number */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display-serif font-bold text-black leading-none">
                404
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display-serif font-bold text-black mb-3 sm:mb-4 md:mb-6 leading-tight px-4">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl font-light tracking-wide font-body leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4">
              The page you&apos;re looking for seems to have wandered off.
              Let&apos;s get you back on track.
            </p>

          

          </div>
        </div>

        <BottomNav />
      </div>
    </>
  );
}
