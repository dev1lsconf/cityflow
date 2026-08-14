/**
 * Geocoding API using Nominatim (OpenStreetMap) - free, no API key required
 * With debounce and caching support
 */

import type { SearchResult } from "@/types";

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  address?: {
    city?: string;
    suburb?: string;
    quarter?: string;
    neighbourhood?: string;
    road?: string;
    amenity?: string;
    tourism?: string;
    leisure?: string;
  };
}

function categorizeResult(result: NominatimResult): SearchResult["type"] {
  if (result.class === "highway") return "address";
  if (result.class === "boundary" || result.class === "place") return "district";
  if (["amenity", "tourism", "leisure", "shop", "sport"].includes(result.class)) return "poi";
  return "place";
}

function getResultIcon(result: NominatimResult): string {
  const type = result.type;
  const cls = result.class;

  if (cls === "railway" || type === "subway_station") return "🚇";
  if (type === "bus_stop") return "🚌";
  if (type === "hospital") return "🏥";
  if (type === "school" || type === "university") return "🏫";
  if (type === "park" || type === "garden") return "🌿";
  if (type === "beach") return "🏖";
  if (type === "restaurant" || type === "cafe" || type === "bar") return "🍽";
  if (type === "museum" || type === "theatre" || type === "cinema") return "🎭";
  if (type === "hotel") return "🏨";
  if (type === "stadium" || type === "sports_centre") return "⚽";
  if (type === "place_of_worship") return "⛪";
  if (type === "marketplace") return "🛍";
  if (cls === "highway") return "📍";
  if (cls === "boundary" || cls === "place") return "🏙";
  return "📌";
}

// Simple in-memory cache
const geocodeCache = new Map<string, SearchResult[]>();

export async function geocodeSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim() || query.length < 2) return [];

  const cacheKey = query.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const params = new URLSearchParams({
      q: `${query}, Barcelona, Spain`,
      format: "json",
      addressdetails: "1",
      limit: "6",
      countrycodes: "es",
      viewbox: "1.9,41.25,2.35,41.55",
      bounded: "1",
      "accept-language": "en,ca,es",
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "CityFlow Barcelona Platform (cityflow.app)",
          "Accept-Language": "en",
        },
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

    const data: NominatimResult[] = await response.json();

    const results: SearchResult[] = data.map((item) => ({
      id: `nominatim-${item.place_id}`,
      name: item.name || item.display_name.split(",")[0],
      type: categorizeResult(item),
      coordinates: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
      description: item.address?.suburb
        ? `${item.address.suburb}, Barcelona`
        : item.address?.quarter
          ? `${item.address.quarter}, Barcelona`
          : "Barcelona",
      category: item.type,
      icon: getResultIcon(item),
    }));

    // Cache for 10 minutes
    geocodeCache.set(cacheKey, results);
    setTimeout(() => geocodeCache.delete(cacheKey), 10 * 60 * 1000);

    return results;
  } catch {
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      "accept-language": "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          "User-Agent": "CityFlow Barcelona Platform (cityflow.app)",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const address = data.address;

    if (address.road && address.house_number) {
      return `${address.road}, ${address.house_number}, Barcelona`;
    }
    if (address.road) {
      return `${address.road}, Barcelona`;
    }
    if (address.suburb) {
      return `${address.suburb}, Barcelona`;
    }

    return data.display_name?.split(",").slice(0, 2).join(",") ?? null;
  } catch {
    return null;
  }
}
