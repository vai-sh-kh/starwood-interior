"use client";

import { useEffect } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dynamically import Lenis
    import("lenis").then((Lenis) => {
      const lenis = new Lenis.default({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Make lenis available globally for parallax effects
      (window as any).lenis = lenis;

      return () => {
        lenis.destroy();
        delete (window as any).lenis;
      };
    });
  }, []);

  return <>{children}</>;
}
