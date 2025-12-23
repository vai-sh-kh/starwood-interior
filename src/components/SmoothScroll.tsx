"use client";

import { useEffect } from "react";

interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
}

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

interface LenisConstructor {
  new (options?: LenisOptions): LenisInstance;
}

interface WindowWithLenis extends Window {
  lenis?: LenisInstance;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dynamically import Lenis
    import("lenis").then((LenisModule) => {
      const Lenis = (LenisModule.default ||
        LenisModule) as unknown as LenisConstructor;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Make lenis available globally for parallax effects
      (window as WindowWithLenis).lenis = lenis;

      return () => {
        lenis.destroy();
        delete (window as WindowWithLenis).lenis;
      };
    });
  }, []);

  return <>{children}</>;
}
