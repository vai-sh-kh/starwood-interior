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
      <div>{children}</div>
      <Toaster
        position="top-right"
        visibleToasts={5}
        gap={12}
        expand={true}
        toastOptions={{
          className: "!z-[99999]",
          duration: 4000,
          style: {
            zIndex: 99999,
            minWidth: "300px",
            maxWidth: "400px",
            marginBottom: "12px",
          },
        }}
      />
    </SmoothScroll>
  );
}
