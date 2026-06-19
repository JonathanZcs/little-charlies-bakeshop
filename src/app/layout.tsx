import type { Metadata } from "next";
import { Playfair_Display, Lato, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Little Charlie's Bakeshop | Cortland, OH",
  description:
    "Handcrafted baked goods made with love in Cortland, Ohio. Custom cakes, cookies, sourdough, macarons, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${dancing.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream font-sans text-mocha">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
