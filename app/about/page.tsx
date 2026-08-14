import Link from "next/link";
import { Map, Database, Globe, Code2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const TECH_STACK = [
  { name: "Next.js 16", desc: "App Router, React Server Components", category: "Framework" },
  { name: "TypeScript", desc: "Strict type safety throughout", category: "Language" },
  { name: "MapLibre GL JS", desc: "Open-source WebGL map rendering", category: "Maps" },
  { name: "Recharts", desc: "Data visualization and charts", category: "Charts" },
  { name: "Tailwind CSS", desc: "Utility-first styling", category: "Styling" },
  { name: "Zustand", desc: "Lightweight global state", category: "State" },
  { name: "React Query", desc: "Server state management", category: "Data" },
  { name: "Netlify", desc: "Deployment and serverless functions", category: "Hosting" },
];

const DATA_SOURCES = [
  {
    name: "Open-Meteo",
    desc: "Weather and air quality data. Free, no API key required.",
    url: "https://open-meteo.com",
    icon: "🌤",
  },
  {
    name: "Bicing Open Data",
    desc: "Barcelona's bike-sharing station availability via Barcelona Open Data portal.",
    url: "https://opendata-ajuntament.barcelona.cat",
    icon: "🚲",
  },
  {
    name: "Nominatim / OpenStreetMap",
    desc: "Free geocoding and place search. No API key required.",
    url: "https://nominatim.openstreetmap.org",
    icon: "📍",
  },
  {
    name: "OpenFreeMap",
    desc: "Free map tiles based on OpenStreetMap data.",
    url: "https://openfreemap.org",
    icon: "🗺",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-white mb-1">{children}</h2>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CityFlow</h1>
              <p className="text-xs text-neutral-500">Barcelona Urban Intelligence Platform</p>
            </div>
          </div>
          <p className="text-base text-neutral-400 leading-relaxed">
            CityFlow is an experimental urban intelligence platform built to explore how public data
            can transform the way we understand cities. It combines real-time mobility, weather,
            and environmental data into a single interactive experience.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/8">
            <p className="text-sm text-neutral-300 leading-relaxed italic">
              &ldquo;Cities generate enormous amounts of data every day. CityFlow is an attempt to make
              that data accessible, understandable, and beautiful — without requiring specialized tools
              or technical knowledge.&rdquo;
            </p>
          </div>
        </section>

        {/* Data sources */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-blue-400" />
            <SectionTitle>Data Sources</SectionTitle>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            CityFlow is built entirely on open, public data sources. No proprietary APIs or paid services
            are required to run the core experience.
          </p>
          <div className="space-y-3">
            {DATA_SOURCES.map(({ name, desc, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/8 hover:border-white/15 transition-all duration-200 group"
              >
                <span className="text-xl flex-shrink-0" aria-hidden>{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {name}
                    </span>
                    <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-purple-400" />
            <SectionTitle>Technology</SectionTitle>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map(({ name, desc, category }) => (
              <div
                key={name}
                className="p-3 rounded-xl bg-neutral-900/60 border border-white/8 hover:border-white/12 transition-colors"
              >
                <div className="text-xs text-neutral-600 mb-0.5 font-medium uppercase tracking-wider">{category}</div>
                <div className="text-sm font-semibold text-white mb-0.5">{name}</div>
                <div className="text-xs text-neutral-600 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-emerald-400" />
            <SectionTitle>Open & Transparent</SectionTitle>
          </div>
          <div className="space-y-3 text-sm text-neutral-400 leading-relaxed">
            <p>
              CityFlow never presents fabricated data as real. When live data is unavailable,
              data is clearly labelled as <span className="text-sky-400 font-medium">DEMO</span>.
              When data is real and current, it is labelled{" "}
              <span className="text-emerald-400 font-medium">LIVE</span>.
            </p>
            <p>
              All third-party data sources are publicly credited and linked. The platform
              relies exclusively on open datasets with no commercial dependencies.
            </p>
            <p>
              No user tracking, no analytics, no cookies beyond what is technically necessary.
              Privacy by design.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="p-5 rounded-2xl bg-neutral-900/40 border border-white/6 text-xs text-neutral-600 leading-relaxed">
          <strong className="text-neutral-500 block mb-1">Disclaimer</strong>
          CityFlow is an experimental project. It is not affiliated with the Barcelona City Council,
          TMB, Bicing or any official city operator. Data accuracy depends on third-party sources
          and may not always reflect real-time conditions. Do not use this platform for emergency
          services or safety-critical decisions.
        </section>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors"
          >
            <Map className="w-4 h-4" />
            Explore the map
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold text-sm transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
