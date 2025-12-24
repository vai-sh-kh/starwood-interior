import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Header />
      <div className="mt-[60px]">{children}</div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!z-[99999]",
          style: {
            zIndex: 99999,
          },
        }}
      />
    </SmoothScroll>
  );
}
