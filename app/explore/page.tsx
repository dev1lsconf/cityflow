"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPLORE_CATEGORIES, DEMO_PLACES } from "@/lib/data/demo";
import { Navbar } from "@/components/layout/Navbar";
import type { Place } from "@/types";

// ─── Category pill ────────────────────────────────────────────────────────────

function CategoryPill({
  category,
  isActive,
  onClick,
}: {
  category: typeof EXPLORE_CATEGORIES[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap",
        isActive
          ? "bg-white/10 border-white/20 text-white"
          : "bg-neutral-900/60 border-white/8 text-neutral-400 hover:text-white hover:border-white/15 hover:bg-white/5"
      )}
      aria-pressed={isActive}
    >
      <span aria-hidden>{category.icon}</span>
      {category.name}
    </button>
  );
}

// ─── Place card ───────────────────────────────────────────────────────────────

function PlaceCard({ place }: { place: Place }) {
  const categoryColors: Record<string, string> = {
    landmark: "text-amber-400 bg-amber-400/10",
    museum: "text-purple-400 bg-purple-400/10",
    park: "text-emerald-400 bg-emerald-400/10",
    food: "text-orange-400 bg-orange-400/10",
    beach: "text-blue-400 bg-blue-400/10",
    sports: "text-green-400 bg-green-400/10",
    culture: "text-pink-400 bg-pink-400/10",
    hospital: "text-red-400 bg-red-400/10",
    architecture: "text-cyan-400 bg-cyan-400/10",
    nightlife: "text-violet-400 bg-violet-400/10",
  };

  const colorClass = categoryColors[place.category] ?? "text-neutral-400 bg-white/5";

  return (
    <Link
      href={`/map?place=${place.id}`}
      className="group flex flex-col bg-neutral-900/60 border border-white/8 rounded-2xl overflow-hidden hover:border-white/18 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Color header */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${getCategoryGradient(place.category)})` }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize", colorClass)}>
            {place.category}
          </span>
          {place.district && (
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              <MapPin className="w-3 h-3" />
              {place.district}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors leading-tight">
          {place.name}
        </h3>

        {/* Description */}
        {place.description && (
          <p className="text-xs text-neutral-500 leading-relaxed flex-1 line-clamp-2 mb-3">
            {place.description}
          </p>
        )}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-600 bg-white/4 border border-white/8 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          {place.openingHours ? (
            <span className="text-xs text-neutral-500">🕐 {place.openingHours}</span>
          ) : (
            <span className="text-xs text-neutral-700">Open area</span>
          )}
          <span className="flex items-center gap-1 text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View on map
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    landmark: "#f59e0b, #d97706",
    museum: "#8b5cf6, #6d28d9",
    park: "#22c55e, #16a34a",
    food: "#f97316, #ea580c",
    beach: "#3b82f6, #1d4ed8",
    sports: "#10b981, #059669",
    culture: "#ec4899, #be185d",
    hospital: "#f43f5e, #be123c",
    architecture: "#06b6d4, #0891b2",
    nightlife: "#a855f7, #7c3aed",
  };
  return gradients[category] ?? "#6b7280, #4b5563";
}

// ─── Explore Page ─────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter places based on category and search
  const filteredPlaces = DEMO_PLACES.filter((place) => {
    const matchesCategory = !activeCategory || matchesExploreCategory(place, activeCategory);
    const matchesSearch =
      !searchQuery ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (place.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Discover Barcelona</h1>
          <p className="text-sm text-neutral-500">
            Explore the city&apos;s most iconic places, cultural spots, and hidden gems.
          </p>
        </div>

        {/* Category pills + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-shrink-0 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Filter places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-900/60 border border-white/8 rounded-full text-sm text-white placeholder-neutral-500 outline-none focus:border-white/20 transition-colors"
              aria-label="Filter places"
            />
          </div>

          {/* Horizontal scroll category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                activeCategory === null
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-neutral-900/60 border-white/8 text-neutral-400 hover:text-white hover:border-white/15"
              )}
              aria-pressed={activeCategory === null}
            >
              All places
            </button>
            {EXPLORE_CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-500 font-medium">
            {filteredPlaces.length} place{filteredPlaces.length !== 1 ? "s" : ""} found
          </p>
          <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium">
            DEMO DATA
          </span>
        </div>

        {/* Places grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">🗺</span>
            <h3 className="text-base font-semibold text-white mb-2">No places found</h3>
            <p className="text-sm text-neutral-500">
              Try a different category or search term.
            </p>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA to map */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-base font-bold text-white mb-1">Explore on the map</h2>
            <p className="text-sm text-neutral-400">
              See all locations on the interactive map with real-time data layers.
            </p>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors flex-shrink-0"
          >
            Open Map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function matchesExploreCategory(place: Place, categoryId: string): boolean {
  const map: Record<string, string[]> = {
    food: ["food", "restaurant"],
    culture: ["museum", "culture"],
    nature: ["park", "beach"],
    architecture: ["landmark", "architecture"],
    nightlife: ["nightlife"],
    shopping: ["shopping"],
    sports: ["sports"],
  };
  return map[categoryId]?.includes(place.category) ?? false;
}
