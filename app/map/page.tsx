"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Layers, Menu, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/appStore";
import { LayerPanel } from "@/components/map/LayerPanel";
import { LiveDataBar } from "@/components/map/LiveDataBar";
import { SearchBar } from "@/components/map/SearchBar";
import { InfoPanel } from "@/components/map/InfoPanel";
import { ReactQueryProvider } from "@/lib/store/queryProvider";
import Link from "next/link";
import { Map } from "lucide-react";

// Dynamic import for MapView to avoid SSR issues with MapLibre GL
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Loading map...</p>
      </div>
    </div>
  ),
});

function MapPageInner() {
  const {
    isLayerPanelOpen,
    setLayerPanelOpen,
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    isDemoMode,
  } = useAppStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-neutral-950 overflow-hidden">
      {/* ── Top bar ── */}
      <header className="relative z-30 flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-neutral-950/95 backdrop-blur-xl border-b border-white/8 h-14 flex-shrink-0">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
          aria-label="CityFlow home"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Map className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight hidden sm:block">
            CityFlow
          </span>
        </Link>

        {/* Layer panel toggle (desktop) */}
        <button
          onClick={() => setLayerPanelOpen(!isLayerPanelOpen)}
          className={cn(
            "hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            isLayerPanelOpen
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
          aria-pressed={isLayerPanelOpen}
          aria-label={isLayerPanelOpen ? "Hide layers" : "Show layers"}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar placeholder="Search Barcelona..." />
        </div>

        {/* Demo badge */}
        {isDemoMode && (
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-semibold text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            DEMO
          </span>
        )}

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Map navigation">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/explore", label: "Explore" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile: layer drawer toggle */}
        <button
          onClick={() => setMobileDrawerOpen(!isMobileDrawerOpen)}
          className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
          aria-label="Toggle layers"
        >
          {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Main content area ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Desktop Layer Panel ── */}
        <aside
          className={cn(
            "hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
            isLayerPanelOpen ? "w-56" : "w-0"
          )}
          aria-label="Layer controls"
        >
          {isLayerPanelOpen && (
            <LayerPanel className="h-full w-56" />
          )}
        </aside>

        {/* ── Map container ── */}
        <main className="relative flex-1 overflow-hidden">
          {isMounted && <MapView />}

          {/* Info panel overlays the map on the right */}
          <InfoPanel />

          {/* Layer panel collapse button */}
          <button
            onClick={() => setLayerPanelOpen(!isLayerPanelOpen)}
            className={cn(
              "hidden md:flex absolute top-4 z-10 w-6 h-10 items-center justify-center",
              "bg-neutral-900/90 border border-white/10 rounded-r-lg",
              "hover:bg-white/10 transition-colors text-neutral-500 hover:text-white",
              isLayerPanelOpen ? "left-0" : "left-0"
            )}
            aria-label={isLayerPanelOpen ? "Collapse layer panel" : "Expand layer panel"}
          >
            <ChevronLeft
              className={cn(
                "w-3 h-3 transition-transform duration-300",
                !isLayerPanelOpen && "rotate-180"
              )}
            />
          </button>
        </main>
      </div>

      {/* ── Live data bar ── */}
      <footer className="relative z-30 border-t border-white/8 bg-neutral-950/95 backdrop-blur-xl flex-shrink-0 overflow-x-auto scrollbar-none">
        <LiveDataBar />
      </footer>

      {/* ── Mobile Layer Drawer ── */}
      {isMobileDrawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="md:hidden fixed left-0 top-14 bottom-0 z-50 w-72"
            aria-label="Layer controls"
          >
            <LayerPanel
              className="h-full"
              onClose={() => setMobileDrawerOpen(false)}
            />
          </aside>
        </>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <ReactQueryProvider>
      <MapPageInner />
    </ReactQueryProvider>
  );
}
