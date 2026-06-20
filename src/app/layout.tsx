import type { Metadata } from "next";
import { Playfair_Display, Lato, Dancing_Script } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { Analytics } from "@vercel/analytics/next";

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
  title: {
    default: "Little Charlie's Bakeshop | Cortland, OH",
    template: "%s | Little Charlie's Bakeshop",
  },
  description:
    "Handcrafted baked goods made with love in Cortland, Ohio. Custom cakes, decorated cookies, sourdough bread, macarons, and more. Custom orders welcome.",
  keywords: [
    "bakery Cortland Ohio",
    "custom cakes Ohio",
    "decorated cookies",
    "sourdough bread",
    "macarons",
    "custom orders bakery",
    "little charlies bakeshop",
  ],
  openGraph: {
    title: "Little Charlie's Bakeshop",
    description: "Handcrafted baked goods made with love in Cortland, Ohio.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlecharliesbakeshop.com",
    siteName: "Little Charlie's Bakeshop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Charlie's Bakeshop",
    description: "Handcrafted baked goods made with love in Cortland, Ohio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${dancing.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream font-sans text-mocha">
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
