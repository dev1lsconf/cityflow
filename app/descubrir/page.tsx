"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_PLACES } from "@/lib/data/demo";
import { Navbar } from "@/components/layout/Navbar";
import type { Place } from "@/types";

const CATEGORIAS = [
  { id: "food", name: "Gastronomía", icon: "🍽" },
  { id: "culture", name: "Cultura", icon: "🎭" },
  { id: "nature", name: "Naturaleza", icon: "🌿" },
  { id: "architecture", name: "Arquitectura", icon: "🏛" },
  { id: "nightlife", name: "Ocio", icon: "🌙" },
  { id: "shopping", name: "Compras", icon: "🛍" },
  { id: "sports", name: "Deportes", icon: "⚽" },
];

const CATEGORY_ES: Record<string, string> = {
  landmark: "Monumento", museum: "Museo", park: "Parque", restaurant: "Restaurante",
  shopping: "Compras", hospital: "Hospital", school: "Educación", hotel: "Hotel",
  beach: "Playa", sports: "Deportes", nightlife: "Ocio", culture: "Cultura",
  food: "Gastronomía", nature: "Naturaleza", architecture: "Arquitectura",
};

function getCategoryGradient(category: string): string {
  const g: Record<string, string> = {
    landmark: "#f59e0b, #d97706", museum: "#8b5cf6, #6d28d9", park: "#22c55e, #16a34a",
    food: "#f97316, #ea580c", beach: "#3b82f6, #1d4ed8", sports: "#10b981, #059669",
    culture: "#ec4899, #be185d", hospital: "#f43f5e, #be123c", architecture: "#06b6d4, #0891b2",
    nightlife: "#a855f7, #7c3aed",
  };
  return g[category] ?? "#6b7280, #4b5563";
}

function PlaceCard({ place }: { place: Place }) {
  const colorClass: Record<string, string> = {
    landmark: "text-amber-400 bg-amber-400/10", museum: "text-purple-400 bg-purple-400/10",
    park: "text-emerald-400 bg-emerald-400/10", food: "text-orange-400 bg-orange-400/10",
    beach: "text-blue-400 bg-blue-400/10", sports: "text-green-400 bg-green-400/10",
    culture: "text-pink-400 bg-pink-400/10", hospital: "text-red-400 bg-red-400/10",
    architecture: "text-cyan-400 bg-cyan-400/10", nightlife: "text-violet-400 bg-violet-400/10",
  };

  return (
    <Link
      href={`/mapa?lugar=${place.id}`}
      className="group flex flex-col bg-neutral-900/60 border border-white/8 rounded-2xl overflow-hidden hover:border-white/18 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${getCategoryGradient(place.category)})` }} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize", colorClass[place.category] ?? "text-neutral-400 bg-white/5")}>
            {CATEGORY_ES[place.category] ?? place.category}
          </span>
          {place.district && (
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              <MapPin className="w-3 h-3" />{place.district}
            </div>
          )}
        </div>
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors leading-tight">{place.name}</h3>
        {place.description && (
          <p className="text-xs text-neutral-500 leading-relaxed flex-1 line-clamp-2 mb-3">{place.description}</p>
        )}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-neutral-600 bg-white/4 border border-white/8 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          {place.openingHours
            ? <span className="text-xs text-neutral-500">🕐 {place.openingHours}</span>
            : <span className="text-xs text-neutral-700">Espacio abierto</span>
          }
          <span className="flex items-center gap-1 text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Ver en mapa <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function matchesCategory(place: Place, catId: string): boolean {
  const map: Record<string, string[]> = {
    food: ["food", "restaurant"], culture: ["museum", "culture"], nature: ["park", "beach"],
    architecture: ["landmark", "architecture"], nightlife: ["nightlife"], shopping: ["shopping"], sports: ["sports"],
  };
  return map[catId]?.includes(place.category) ?? false;
}

export default function DescubrirPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaces = DEMO_PLACES.filter((place) => {
    const matchesCat = !activeCategory || matchesCategory(place, activeCategory);
    const matchesSearch = !searchQuery ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (place.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Descubrir Barcelona</h1>
          <p className="text-sm text-neutral-500">Explora los lugares más icónicos, espacios culturales y rincones únicos de la ciudad.</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-shrink-0 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Filtrar lugares..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-900/60 border border-white/8 rounded-full text-sm text-white placeholder-neutral-500 outline-none focus:border-white/20 transition-colors"
              aria-label="Filtrar lugares"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                activeCategory === null ? "bg-white/10 border-white/20 text-white" : "bg-neutral-900/60 border-white/8 text-neutral-400 hover:text-white hover:border-white/15"
              )}
              aria-pressed={activeCategory === null}
            >
              Todos
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  activeCategory === cat.id ? "bg-white/10 border-white/20 text-white" : "bg-neutral-900/60 border-white/8 text-neutral-400 hover:text-white hover:border-white/15"
                )}
                aria-pressed={activeCategory === cat.id}
              >
                <span aria-hidden>{cat.icon}</span>{cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-500 font-medium">{filteredPlaces.length} lugar{filteredPlaces.length !== 1 ? "es" : ""} encontrado{filteredPlaces.length !== 1 ? "s" : ""}</p>
          <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium">DATOS DEMO</span>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlaces.map((place) => <PlaceCard key={place.id} place={place} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">🗺</span>
            <h3 className="text-base font-semibold text-white mb-2">No se encontraron lugares</h3>
            <p className="text-sm text-neutral-500">Prueba con otra categoría o término de búsqueda.</p>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-base font-bold text-white mb-1">Explorar en el mapa</h2>
            <p className="text-sm text-neutral-400">Visualiza todos los lugares en el mapa interactivo con capas de datos en tiempo real.</p>
          </div>
          <Link href="/mapa" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors flex-shrink-0">
            Abrir Mapa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
