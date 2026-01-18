import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";

export default function AboutUsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScroll>
            {/* No Header here - about-us page has its own ScrollingNav */}
            <div>{children}</div>
        </SmoothScroll>
    );
}
