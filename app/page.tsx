import Link from "next/link";
import { Map, BarChart2, Lightbulb, Layers, ArrowRight, Zap, Globe, Activity } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: Map,
    title: "Interactive Map",
    description: "Explore Barcelona through a live interactive map with multiple data layers — metro, bikes, traffic, weather and more.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "Live Mobility",
    description: "Real-time data on Bicing availability, bus routes, metro status and traffic conditions across the city.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Activity,
    title: "Urban Data",
    description: "Temperature, air quality, precipitation and wind data from open meteorological sources. Always up to date.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Automatically generated conclusions from available data. Understand patterns, anomalies and city rhythms at a glance.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

const STATS = [
  { value: "10+", label: "Data layers" },
  { value: "50+", label: "Bicing stations" },
  { value: "9", label: "Metro lines" },
  { value: "24/7", label: "Live updates" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-32 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/4 blur-3xl" />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-8 relative">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden />
          Barcelona Urban Intelligence Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6 relative">
          See Barcelona
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            differently.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed mb-10 relative">
          Explore the city through live data, mobility, weather and urban intelligence.
          CityFlow transforms public data into a real-time window into Barcelona.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative">
          <Link
            href="/map"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Map className="w-4 h-4" />
            Explore Barcelona
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all duration-200"
          >
            <BarChart2 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-16 pt-8 border-t border-white/8 w-full max-w-xl relative">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-neutral-500 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Everything you need to understand the city
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            Built on open data sources. No login required. Always free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="flex flex-col p-5 rounded-2xl bg-neutral-900/60 border border-white/8 hover:border-white/15 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed flex-1">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map preview CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 max-w-6xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950/80 to-neutral-900/80 border border-blue-500/15 p-8 sm:p-12">
          {/* Decorative grid */}
          <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden>
            <div className="w-full h-full"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Interactive Map</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Barcelona in real time.
              </h2>
              <p className="text-sm text-neutral-400 max-w-md">
                Toggle data layers, explore landmarks, check live transit and discover the city from a new perspective.
              </p>
            </div>
            <Link
              href="/map"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex-shrink-0"
            >
              Open Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Map className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-white">CityFlow</span>
            <span className="text-xs text-neutral-600">Barcelona Urban Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <Link href="/about" className="hover:text-neutral-400 transition-colors">About</Link>
            <Link href="/map" className="hover:text-neutral-400 transition-colors">Map</Link>
            <Link href="/dashboard" className="hover:text-neutral-400 transition-colors">Dashboard</Link>
            <span>Built with open data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
