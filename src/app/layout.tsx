import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Assisted Development Comparison: WeatherEats",
  description: "Comparative analysis of four AI development tools building identical Next.js applications from specification to deployment",
  openGraph: {
    title: "AI-Assisted Development Comparison: WeatherEats",
    description: "Comparative analysis of four AI development tools building identical Next.js applications from specification to deployment",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WeatherEats AI Development Comparison Study'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI-Assisted Development Comparison: WeatherEats",
    description: "Comparative analysis of four AI development tools building identical Next.js applications",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
