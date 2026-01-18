import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScroll>
            <div>{children}</div>
        </SmoothScroll>
    );
}
