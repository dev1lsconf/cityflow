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
    default: "CityFlow — Inteligencia Urbana de Barcelona",
    template: "%s | CityFlow Barcelona",
  },
  description:
    "Explora Barcelona a través de movilidad, meteorología, transporte y datos urbanos en tiempo real. Mapa interactivo con Bicing, Metro, Calidad del Aire e Inteligencia de Ciudad.",
  keywords: [
    "Barcelona",
    "smart city",
    "datos urbanos",
    "mapa en tiempo real",
    "movilidad",
    "bicing",
    "metro",
    "calidad del aire",
    "inteligencia urbana",
  ],
  authors: [{ name: "Eric Batista" }],
  creator: "Eric Batista",
  publisher: "Eric Batista",
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
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://cityflow-barcelona.netlify.app",
    siteName: "CityFlow",
    title: "CityFlow — Inteligencia Urbana de Barcelona",
    description:
      "Explora Barcelona a través de movilidad, meteorología, transporte e inteligencia urbana en tiempo real.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CityFlow — Plataforma de Inteligencia Urbana de Barcelona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CityFlow — Inteligencia Urbana de Barcelona",
    description:
      "Explora Barcelona a través de movilidad, meteorología, transporte e inteligencia urbana en tiempo real.",
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
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
