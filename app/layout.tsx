import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cityflow.netlify.app"),
  title: {
    default: "CityFlow — Barcelona Urban Intelligence",
    template: "%s | CityFlow Barcelona",
  },
  description:
    "Explore Barcelona through real-time mobility, weather, transport, events and urban data. Live interactive map with Bicing, Metro, Air Quality and City Insights.",
  keywords: [
    "Barcelona",
    "smart city",
    "urban data",
    "real-time map",
    "mobility",
    "bicing",
    "metro",
    "air quality",
    "city intelligence",
  ],
  authors: [{ name: "CityFlow" }],
  creator: "CityFlow",
  publisher: "CityFlow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://cityflow.netlify.app",
    siteName: "CityFlow",
    title: "CityFlow — Barcelona Urban Intelligence",
    description:
      "Explore Barcelona through real-time mobility, weather, transport and urban intelligence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CityFlow — Barcelona Urban Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CityFlow — Barcelona Urban Intelligence",
    description:
      "Explore Barcelona through real-time mobility, weather, transport and urban intelligence.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
