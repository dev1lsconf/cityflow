import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cityflow-barcelona.netlify.app";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/mapa`, lastModified: new Date(), changeFrequency: "always", priority: 0.9 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: "always", priority: 0.8 },
    { url: `${baseUrl}/descubrir`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: "always", priority: 0.6 },
    { url: `${baseUrl}/sobre-nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
}
