import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/Marketing";
import { Providers } from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RetailBeastFX - Hunt Liquidity with Mechanical Precision | ICT/SMC Indicator",
  description: "The 2025-proof elite ICT/SMC trading indicator + journal ecosystem. Fresh Order Blocks, Killzones, Quantum Lock, and a mechanical trading journal to track your edge.",
  keywords: [
    "ICT trading indicator",
    "SMC indicator",
    "order blocks",
    "fair value gaps",
    "trading journal",
    "forex indicator",
    "crypto indicator",
    "TradingView indicator",
    "liquidity trading",
    "retail beast",
  ],
  authors: [{ name: "RetailBeastFX" }],
  openGraph: {
    title: "RetailBeastFX - Hunt Liquidity with Mechanical Precision",
    description: "Indicator + Journal = Unbeatable Edge. The 2025-proof elite ICT/SMC trading ecosystem.",
    type: "website",
    siteName: "RetailBeastFX",
    images: ["/mascot/banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RetailBeastFX - Hunt Liquidity with Mechanical Precision",
    description: "Indicator + Journal = Unbeatable Edge. The 2025-proof elite ICT/SMC trading ecosystem.",
    images: ["/mascot/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00E676" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        <Providers>
          <Header />
          <main className="pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

