"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store/appStore";
import { useBicingStations } from "@/lib/hooks/useData";
import { getMapStyleUrl } from "@/lib/utils";
import {
  BARCELONA_CENTER,
  BARCELONA_DEFAULT_ZOOM,
  DEMO_METRO_STATIONS,
  DEMO_PLACES,
} from "@/lib/data/demo";
import type { LayerId, Place, MetroStation, BicingStation } from "@/types";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

// Layer paint configs
const LAYER_CONFIGS: Partial<Record<LayerId, { circleColor: string; circleRadius: number }>> = {
  metro: { circleColor: "#ef4444", circleRadius: 8 },
  bicing: { circleColor: "#ec4899", circleRadius: 7 },
  places: { circleColor: "#8b5cf6", circleRadius: 7 },
  bus: { circleColor: "#f59e0b", circleRadius: 6 },
  hospitals: { circleColor: "#f43f5e", circleRadius: 7 },
  education: { circleColor: "#3b82f6", circleRadius: 6 },
  parks: { circleColor: "#22c55e", circleRadius: 7 },
};

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const initRef = useRef(false);

  const { layers, mapState, setMapState, setSelectedFeature } = useAppStore();
  const { data: bicingData } = useBicingStations();

  const enabledLayerIds = layers.filter((l) => l.enabled).map((l) => l.id);

  // ─── Initialize map ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapContainer.current || initRef.current) return;
    initRef.current = true;

    const styleUrl = getMapStyleUrl("dark", MAPTILER_KEY || undefined);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: BARCELONA_CENTER,
      zoom: BARCELONA_DEFAULT_ZOOM,
      pitch: 30,
      bearing: 0,
      antialias: true,
      attributionControl: false,
    });

    // Add attribution in a clean position
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    // Navigation controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), "bottom-right");

    // Geolocation
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    // Scale control
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    // Store map reference
    mapRef.current = map;

    // Update store on map move
    map.on("moveend", () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bearing = map.getBearing();
      const pitch = map.getPitch();
      setMapState({
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bearing,
        pitch,
      });
    });

    map.on("load", () => {
      addDataLayers(map);
    });

    // Click handler for map features
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["places-layer", "metro-layer", "bicing-layer"],
      });

      if (features.length > 0) {
        const feature = features[0];
        const props = feature.properties;

        if (props) {
          const placeData = DEMO_PLACES.find((p) => p.id === props.id);
          const metroData = DEMO_METRO_STATIONS.find((s) => s.id === props.id);

          if (placeData) {
            setSelectedFeature({ type: "place", data: placeData });
          } else if (metroData) {
            setSelectedFeature({ type: "station", data: metroData });
          }
        }
      } else {
        // Close info panel when clicking empty map
        setSelectedFeature(null);
      }
    });

    // Cursor style on hover
    const layerIds = ["places-layer", "metro-layer", "bicing-layer"];
    layerIds.forEach((layerId) => {
      map.on("mouseenter", layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Add Data Layers ──────────────────────────────────────────────────────

  const addDataLayers = useCallback(
    (map: maplibregl.Map) => {
      // Places layer
      if (!map.getSource("places-source")) {
        const placesGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: DEMO_PLACES.map((place) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [place.coordinates.lng, place.coordinates.lat] },
            properties: {
              id: place.id,
              name: place.name,
              category: place.category,
              district: place.district,
              description: place.description,
            },
          })),
        };

        map.addSource("places-source", { type: "geojson", data: placesGeoJSON, cluster: true, clusterMaxZoom: 14, clusterRadius: 50 });

        // Clustered circles
        map.addLayer({
          id: "places-clusters",
          type: "circle",
          source: "places-source",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#8b5cf6", 5, "#7c3aed", 10, "#6d28d9"],
            "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 10, 30],
            "circle-opacity": 0.85,
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(139, 92, 246, 0.4)",
          },
        });

        map.addLayer({
          id: "places-cluster-count",
          type: "symbol",
          source: "places-source",
          filter: ["has", "point_count"],
          layout: { "text-field": "{point_count_abbreviated}", "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"], "text-size": 12 },
          paint: { "text-color": "#ffffff" },
        });

        // Individual points
        map.addLayer({
          id: "places-layer",
          type: "circle",
          source: "places-source",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#8b5cf6",
            "circle-radius": 7,
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(139, 92, 246, 0.5)",
            "circle-stroke-opacity": 0.8,
          },
        });

        // Expand clusters on click
        map.on("click", "places-clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["places-clusters"] });
          if (!features[0]) return;
          const clusterId = features[0].properties?.cluster_id as number;
          const source = map.getSource("places-source") as maplibregl.GeoJSONSource;
          source.getClusterExpansionZoom(clusterId).then((zoom) => {
            const geometry = features[0].geometry as GeoJSON.Point;
            map.easeTo({
              center: geometry.coordinates as [number, number],
              zoom,
              duration: 500,
            });
          });
        });

        map.on("mouseenter", "places-clusters", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "places-clusters", () => { map.getCanvas().style.cursor = ""; });
      }

      // Metro layer
      if (!map.getSource("metro-source")) {
        const metroGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: DEMO_METRO_STATIONS.map((station) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [station.coordinates.lng, station.coordinates.lat] },
            properties: { id: station.id, name: station.name, lines: station.lines.join(", "), district: station.district },
          })),
        };

        map.addSource("metro-source", { type: "geojson", data: metroGeoJSON });
        map.addLayer({
          id: "metro-layer",
          type: "circle",
          source: "metro-source",
          paint: {
            "circle-color": "#ef4444",
            "circle-radius": 8,
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(239, 68, 68, 0.5)",
          },
        });
      }

      // Bicing layer (will be updated with real data)
      if (!map.getSource("bicing-source")) {
        map.addSource("bicing-source", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        map.addLayer({
          id: "bicing-layer",
          type: "circle",
          source: "bicing-source",
          paint: {
            "circle-color": [
              "case",
              ["==", ["get", "availableBikes"], 0], "#6b7280",
              ["<=", ["get", "availableBikes"], 3], "#f59e0b",
              "#ec4899",
            ],
            "circle-radius": 7,
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(236, 72, 153, 0.4)",
          },
        });
      }
    },
    []
  );

  // ─── Update Layer Visibility ──────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const layerMap: Partial<Record<LayerId, string[]>> = {
      places: ["places-layer", "places-clusters", "places-cluster-count"],
      metro: ["metro-layer"],
      bicing: ["bicing-layer"],
    };

    layers.forEach((layer) => {
      const mapLayerIds = layerMap[layer.id];
      if (!mapLayerIds) return;

      mapLayerIds.forEach((mapLayerId) => {
        if (map.getLayer(mapLayerId)) {
          map.setLayoutProperty(
            mapLayerId,
            "visibility",
            layer.enabled ? "visible" : "none"
          );
        }
      });
    });
  }, [layers]);

  // ─── Update Bicing Data ────────────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !bicingData || !map.isStyleLoaded()) return;

    const stations: BicingStation[] = bicingData.stations;
    const source = map.getSource("bicing-source") as maplibregl.GeoJSONSource | undefined;

    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: stations.map((station) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [station.coordinates.lng, station.coordinates.lat] },
          properties: {
            id: station.id,
            name: station.name,
            availableBikes: station.availableBikes + station.availableElectricBikes,
            availableElectric: station.availableElectricBikes,
            availableDocks: station.availableDocks,
          },
        })),
      });
    }
  }, [bicingData]);

  // ─── Fly to when feature selected ─────────────────────────────────────────

  const selectedFeature = useAppStore((s) => s.selectedFeature);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedFeature) return;

    let coords: [number, number] | null = null;

    if ("coordinates" in selectedFeature.data) {
      const c = selectedFeature.data.coordinates;
      coords = [c.lng, c.lat];
    }

    if (coords) {
      map.flyTo({
        center: coords,
        zoom: Math.max(map.getZoom(), 15),
        duration: 1200,
        essential: true,
      });
    }
  }, [selectedFeature]);

  // ─── Expose flyTo for search ───────────────────────────────────────────────

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as Window & { __cityflowMapRef?: maplibregl.Map | null }).__cityflowMapRef = mapRef.current;
    }
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 w-full h-full"
      aria-label="Mapa interactivo de Barcelona"
      role="application"
    />
  );
}
