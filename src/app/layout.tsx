/* eslint-disable @next/next/google-font-display */
/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Playfair_Display, Cormorant_Garamond, Inter, Caudex } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";
import SmoothScroll from "@/components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const caudex = Caudex({
  variable: "--font-roxborough", // Using this var name to map to the requested "Look"
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Starwood Interiors - Contemporary Interior Design",
  description:
    "Starwood Interiors specialises in premium interior design services in Trivandrum, Kerala. From custom home interiors to modular kitchens and 3D design visualisation, we deliver exceptional space solutions.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${dmSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${inter.variable} ${caudex.variable} antialiased font-display bg-background-light text-text-light`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ChatBot />
      </body>
    </html>
  );
}
