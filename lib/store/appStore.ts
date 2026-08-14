"use client";

import { create } from "zustand";
import type {
  Layer,
  LayerId,
  MapState,
  SelectedFeature,
  LiveDataState,
  SearchResult,
} from "@/types";

// ─── Layer Definitions ─────────────────────────────────────────────────────────

const DEFAULT_LAYERS: Layer[] = [
  // Movilidad
  { id: "metro", name: "Metro", category: "mobility", icon: "🚇", color: "#d52b1e", enabled: true },
  { id: "bus", name: "Autobús", category: "mobility", icon: "🚌", color: "#f9a51b", enabled: false },
  { id: "bicing", name: "Bicing", category: "mobility", icon: "🚲", color: "#e91e63", enabled: true },
  { id: "traffic", name: "Tráfico", category: "mobility", icon: "🚗", color: "#ff5722", enabled: false },
  { id: "parking", name: "Aparcamiento", category: "mobility", icon: "🅿", color: "#2196f3", enabled: false },
  // Ciudad
  { id: "places", name: "Lugares", category: "city", icon: "🏛", color: "#9c27b0", enabled: true },
  { id: "events", name: "Eventos", category: "city", icon: "🎭", color: "#673ab7", enabled: false },
  { id: "hospitals", name: "Hospitales", category: "city", icon: "🏥", color: "#f44336", enabled: false },
  { id: "education", name: "Educación", category: "city", icon: "🏫", color: "#3f51b5", enabled: false },
  { id: "parks", name: "Parques", category: "city", icon: "🌳", color: "#4caf50", enabled: false },
  // Entorno
  { id: "temperature", name: "Temperatura", category: "environment", icon: "🌡", color: "#ff9800", enabled: false },
  { id: "rain", name: "Lluvia", category: "environment", icon: "🌧", color: "#03a9f4", enabled: false },
  { id: "wind", name: "Viento", category: "environment", icon: "🌬", color: "#b2ebf2", enabled: false },
  { id: "air_quality", name: "Calidad del Aire", category: "environment", icon: "🌫", color: "#8bc34a", enabled: false },
];

// ─── App Store ────────────────────────────────────────────────────────────────

interface AppStore {
  // Map state
  mapState: MapState;
  setMapState: (state: Partial<MapState>) => void;

  // Layers
  layers: Layer[];
  toggleLayer: (id: LayerId) => void;
  setLayerLoading: (id: LayerId, loading: boolean) => void;
  setLayerError: (id: LayerId, error: string | undefined) => void;
  enabledLayers: () => Layer[];

  // Selected feature
  selectedFeature: SelectedFeature | null;
  setSelectedFeature: (feature: SelectedFeature | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Live data
  liveData: LiveDataState;
  updateLiveData: (data: Partial<LiveDataState>) => void;

  // UI state
  isLayerPanelOpen: boolean;
  setLayerPanelOpen: (open: boolean) => void;
  isInfoPanelOpen: boolean;
  setInfoPanelOpen: (open: boolean) => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  isFullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;

  // Demo mode
  isDemoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

const DEFAULT_LIVE_DATA: LiveDataState = {
  weather: null,
  airQuality: null,
  bicing: null,
  traffic: null,
  metro: null,
  lastUpdated: null,
  isConnected: true,
};

export const useAppStore = create<AppStore>()((set, get) => ({
  // Map state
  mapState: {
    center: { lat: 41.3851, lng: 2.1734 },
    zoom: 13,
    bearing: 0,
    pitch: 30,
    style: "dark",
  },
  setMapState: (state) =>
    set((prev) => ({ mapState: { ...prev.mapState, ...state } })),

  // Layers
  layers: DEFAULT_LAYERS,
  toggleLayer: (id) =>
    set((prev) => ({
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      ),
    })),
  setLayerLoading: (id, loading) =>
    set((prev) => ({
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, loading } : layer
      ),
    })),
  setLayerError: (id, error) =>
    set((prev) => ({
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, error } : layer
      ),
    })),
  enabledLayers: () => get().layers.filter((l) => l.enabled),

  // Selected feature
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature, isInfoPanelOpen: !!feature }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  // Live data
  liveData: DEFAULT_LIVE_DATA,
  updateLiveData: (data) =>
    set((prev) => ({ liveData: { ...prev.liveData, ...data } })),

  // UI state
  isLayerPanelOpen: true,
  setLayerPanelOpen: (open) => set({ isLayerPanelOpen: open }),
  isInfoPanelOpen: false,
  setInfoPanelOpen: (open) => set({ isInfoPanelOpen: open }),
  isMobileDrawerOpen: false,
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  isFullscreen: false,
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),

  // Demo mode
  isDemoMode: false,
  setDemoMode: (demo) => set({ isDemoMode: demo }),
}));
