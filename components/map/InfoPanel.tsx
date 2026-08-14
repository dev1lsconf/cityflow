"use client";

import { useEffect, useRef } from "react";
import {
  X,
  MapPin,
  Navigation,
  Bike,
  Train,
  Thermometer,
  Globe,
  Clock,
} from "lucide-react";
import { cn, formatDistance, haversineDistance } from "@/lib/utils";
import { useAppStore } from "@/lib/store/appStore";
import { useBicingStations, useWeather } from "@/lib/hooks/useData";
import type { Place, MetroStation } from "@/types";
import { DEMO_METRO_STATIONS } from "@/lib/data/demo";

function FeatureTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/8 text-neutral-300 border border-white/10">
      {label}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-neutral-500 mb-0.5">{label}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}

const CATEGORY_ES: Record<string, string> = {
  landmark: "Monumento",
  museum: "Museo",
  park: "Parque",
  restaurant: "Restaurante",
  shopping: "Compras",
  hospital: "Hospital",
  school: "Educación",
  hotel: "Hotel",
  beach: "Playa",
  sports: "Deportes",
  nightlife: "Ocio nocturno",
  culture: "Cultura",
  food: "Gastronomía",
  nature: "Naturaleza",
  architecture: "Arquitectura",
};

function PlacePanel({ place }: { place: Place }) {
  const { data: bicingData } = useBicingStations();
  const { data: weatherData } = useWeather();

  const nearbyBicing = bicingData?.stations
    ?.map((station) => ({
      ...station,
      distance: haversineDistance(
        place.coordinates.lat,
        place.coordinates.lng,
        station.coordinates.lat,
        station.coordinates.lng
      ),
    }))
    .filter((s) => s.distance < 600)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3) ?? [];

  const nearbyMetro = DEMO_METRO_STATIONS
    .map((station) => ({
      ...station,
      distance: haversineDistance(
        place.coordinates.lat,
        place.coordinates.lng,
        station.coordinates.lat,
        station.coordinates.lng
      ),
    }))
    .filter((s) => s.distance < 800)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);

  const categoryLabel = CATEGORY_ES[place.category] ?? place.category;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {categoryLabel}
          </span>
          {place.district && (
            <>
              <span className="text-neutral-700">·</span>
              <span className="text-xs text-neutral-500">{place.district}</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-white leading-tight">{place.name}</h2>
        {place.description && (
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{place.description}</p>
        )}
      </div>

      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {place.tags.map((tag) => (
            <FeatureTag key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {place.address && (
          <InfoRow
            icon={<MapPin className="w-3.5 h-3.5 text-neutral-400" />}
            label="Dirección"
            value={place.address}
          />
        )}
        {place.openingHours && (
          <InfoRow
            icon={<Clock className="w-3.5 h-3.5 text-neutral-400" />}
            label="Horario"
            value={place.openingHours}
          />
        )}
        {weatherData && (
          <InfoRow
            icon={<Thermometer className="w-3.5 h-3.5 text-orange-400" />}
            label="Temperatura"
            value={`${weatherData.temperature}°C — ${weatherData.description}`}
          />
        )}
      </div>

      <div className="border-t border-white/8" />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Transporte cercano</h3>
        <div className="space-y-2">
          {nearbyMetro.length > 0 && nearbyMetro.map((station) => (
            <div
              key={station.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/4 hover:bg-white/7 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Train className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{station.name}</div>
                  <div className="text-xs text-neutral-500">Metro {station.lines.join(", ")}</div>
                </div>
              </div>
              <span className="text-xs text-neutral-500 font-medium">{formatDistance(station.distance)}</span>
            </div>
          ))}

          {nearbyBicing.length > 0 && nearbyBicing.map((station) => (
            <div
              key={station.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/4 hover:bg-white/7 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Bike className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <div className="text-sm text-white font-medium">
                    {station.availableBikes + station.availableElectricBikes} bicis disponibles
                  </div>
                  <div className="text-xs text-neutral-500">{station.name}</div>
                </div>
              </div>
              <span className="text-xs text-neutral-500 font-medium">{formatDistance(station.distance)}</span>
            </div>
          ))}

          {nearbyMetro.length === 0 && nearbyBicing.length === 0 && (
            <p className="text-sm text-neutral-600 text-center py-2">Sin datos de transporte cercano</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-sm text-white font-medium transition-colors"
          aria-label={`Cómo llegar a ${place.name}`}
        >
          <Navigation className="w-4 h-4" />
          Cómo llegar
        </a>
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-sm text-white font-medium transition-colors"
            aria-label={`Web oficial de ${place.name}`}
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function MetroStationPanel({ station }: { station: MetroStation }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Estación de Metro</span>
          {station.district && (
            <>
              <span className="text-neutral-700">·</span>
              <span className="text-xs text-neutral-500">{station.district}</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{station.name}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {station.lines.map((line) => (
          <span
            key={line}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-red-500/20 text-red-300 border border-red-500/30"
          >
            🚇 {line}
          </span>
        ))}
      </div>

      <InfoRow
        icon={<MapPin className="w-3.5 h-3.5 text-neutral-400" />}
        label="Distrito"
        value={station.district}
      />

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-sm text-white font-medium transition-colors"
      >
        <Navigation className="w-4 h-4" />
        Cómo llegar
      </a>
    </div>
  );
}

export function InfoPanel() {
  const { selectedFeature, isInfoPanelOpen, setInfoPanelOpen, setSelectedFeature } = useAppStore();

  const handleClose = () => {
    setInfoPanelOpen(false);
    setTimeout(() => setSelectedFeature(null), 300);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isInfoPanelOpen) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfoPanelOpen]);

  if (!selectedFeature) return null;

  return (
    <>
      {/* Panel lateral desktop */}
      <div
        className={cn(
          "hidden md:flex flex-col absolute right-0 top-0 bottom-0 w-80 lg:w-96",
          "bg-neutral-950/95 backdrop-blur-xl border-l border-white/8",
          "transition-transform duration-300 ease-out z-20 overflow-hidden",
          isInfoPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="complementary"
        aria-label="Detalles del lugar"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {selectedFeature.type === "station" ? "Estación" : "Ubicación"}
          </span>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-500 hover:text-white"
            aria-label="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {selectedFeature.type === "place" && (
            <PlacePanel place={selectedFeature.data as Place} />
          )}
          {selectedFeature.type === "station" && (
            <MetroStationPanel station={selectedFeature.data as MetroStation} />
          )}
        </div>
      </div>

      {/* Bottom sheet móvil */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 bottom-0 z-50",
          "bg-neutral-950/98 backdrop-blur-xl border-t border-white/10",
          "rounded-t-2xl transition-transform duration-300 ease-out",
          "max-h-[70vh] flex flex-col",
          isInfoPanelOpen ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Detalles del lugar"
      >
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-white/8 flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {selectedFeature.type === "station" ? "Estación" : "Ubicación"}
          </span>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-500 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {selectedFeature.type === "place" && (
            <PlacePanel place={selectedFeature.data as Place} />
          )}
          {selectedFeature.type === "station" && (
            <MetroStationPanel station={selectedFeature.data as MetroStation} />
          )}
        </div>
      </div>

      {isInfoPanelOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
