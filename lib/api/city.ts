/**
 * API abstraction layer for CityFlow
 * All API calls go through these functions which handle:
 * - Real API calls when available
 * - Graceful fallback to demo data
 * - Proper error handling
 * - Status tracking
 */

import type { WeatherData, AirQualityData, BicingStation, TrafficData, DataStatus } from "@/types";
import { DEMO_WEATHER, DEMO_AIR_QUALITY, DEMO_BICING_STATIONS, DEMO_TRAFFIC } from "@/lib/data/demo";

// ─── Weather API (Open-Meteo - free, no key required) ─────────────────────────

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    weather_code: number;
  };
}

const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Foggy", icon: "🌫" },
  48: { description: "Icy fog", icon: "🌫" },
  51: { description: "Light drizzle", icon: "🌦" },
  53: { description: "Drizzle", icon: "🌦" },
  55: { description: "Heavy drizzle", icon: "🌧" },
  61: { description: "Slight rain", icon: "🌧" },
  63: { description: "Rain", icon: "🌧" },
  65: { description: "Heavy rain", icon: "🌧" },
  71: { description: "Slight snowfall", icon: "🌨" },
  73: { description: "Snowfall", icon: "❄️" },
  75: { description: "Heavy snowfall", icon: "❄️" },
  80: { description: "Slight showers", icon: "🌦" },
  81: { description: "Showers", icon: "🌧" },
  82: { description: "Violent showers", icon: "⛈" },
  95: { description: "Thunderstorm", icon: "⛈" },
  96: { description: "Thunderstorm with hail", icon: "⛈" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈" },
};

export async function fetchWeather(): Promise<WeatherData> {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=41.3851&longitude=2.1734" +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code" +
      "&timezone=Europe%2FMadrid";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal, next: { revalidate: 900 } });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: OpenMeteoResponse = await response.json();
    const c = data.current;
    const wmo = WMO_CODES[c.weather_code] ?? { description: "Unknown", icon: "🌡" };

    return {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      windSpeed: Math.round(c.wind_speed_10m),
      windDirection: c.wind_direction_10m,
      precipitation: c.precipitation,
      weatherCode: c.weather_code,
      description: wmo.description,
      icon: wmo.icon,
      status: "live" as DataStatus,
      lastUpdated: new Date(),
    };
  } catch {
    return { ...DEMO_WEATHER, status: "demo" };
  }
}

// ─── Air Quality API (Open-Meteo - free) ──────────────────────────────────────

interface AirQualityResponse {
  current: {
    european_aqi: number;
    pm10: number;
    pm2_5: number;
    nitrogen_dioxide: number;
    ozone: number;
  };
}

function getAQILevel(aqi: number): { level: AirQualityData["level"]; description: string } {
  if (aqi <= 20) return { level: "good", description: "Air quality is excellent. Perfect for outdoor activities." };
  if (aqi <= 40) return { level: "good", description: "Air quality is satisfactory. Outdoor activities are safe." };
  if (aqi <= 60) return { level: "fair", description: "Air quality is acceptable. Sensitive groups should reduce prolonged outdoor exertion." };
  if (aqi <= 80) return { level: "moderate", description: "Moderate air quality. Consider reducing extended outdoor activities." };
  if (aqi <= 100) return { level: "poor", description: "Poor air quality. Sensitive groups should avoid outdoor exertion." };
  return { level: "very_poor", description: "Very poor air quality. Avoid outdoor activities." };
}

export async function fetchAirQuality(): Promise<AirQualityData> {
  try {
    const url =
      "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=41.3851&longitude=2.1734" +
      "&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone" +
      "&timezone=Europe%2FMadrid";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal, next: { revalidate: 1800 } });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: AirQualityResponse = await response.json();
    const c = data.current;
    const { level, description } = getAQILevel(c.european_aqi);

    return {
      aqi: c.european_aqi,
      level,
      description,
      pm10: Math.round(c.pm10),
      pm25: Math.round(c.pm2_5),
      no2: Math.round(c.nitrogen_dioxide),
      o3: Math.round(c.ozone),
      status: "live" as DataStatus,
      lastUpdated: new Date(),
    };
  } catch {
    return { ...DEMO_AIR_QUALITY, status: "demo" };
  }
}

// ─── Bicing API (Barcelona Open Data) ─────────────────────────────────────────

interface BicingAPIResponse {
  data: {
    stations: Array<{
      station_id: string;
      name: string;
      lat: number;
      lon: number;
      capacity: number;
    }>;
  };
}

interface BicingStatusResponse {
  data: {
    stations: Array<{
      station_id: string;
      num_bikes_available: number;
      num_bikes_available_types: {
        mechanical: number;
        ebike: number;
      };
      num_docks_available: number;
      status: string;
    }>;
  };
}

export async function fetchBicingStations(): Promise<{ stations: BicingStation[]; status: DataStatus }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const [infoRes, statusRes] = await Promise.all([
      fetch("https://opendata-ajuntament.barcelona.cat/resources/bcn/BicingNou/est_informacio.json", {
        signal: controller.signal,
      }),
      fetch("https://opendata-ajuntament.barcelona.cat/resources/bcn/BicingNou/est_estat.json", {
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeout);

    if (!infoRes.ok || !statusRes.ok) throw new Error("Bicing API unavailable");

    const infoData: BicingAPIResponse = await infoRes.json();
    const statusData: BicingStatusResponse = await statusRes.json();

    const statusMap = new Map(
      statusData.data.stations.map((s) => [s.station_id, s])
    );

    const stations: BicingStation[] = infoData.data.stations
      .slice(0, 50) // Limit for performance
      .map((station) => {
        const status = statusMap.get(station.station_id);
        return {
          id: station.station_id,
          name: station.name,
          coordinates: { lat: station.lat, lng: station.lon },
          availableBikes: status?.num_bikes_available_types.mechanical ?? 0,
          availableElectricBikes: status?.num_bikes_available_types.ebike ?? 0,
          availableDocks: status?.num_docks_available ?? 0,
          totalDocks: station.capacity,
          status: (status?.status === "IN_SERVICE" ? "IN_SERVICE" : "CLOSED") as BicingStation["status"],
          district: "",
        };
      });

    return { stations, status: "live" };
  } catch {
    return { stations: DEMO_BICING_STATIONS, status: "demo" };
  }
}

// ─── Traffic (Demo only - no public real-time API) ────────────────────────────

export async function fetchTrafficData(): Promise<{ data: TrafficData; status: DataStatus }> {
  // Barcelona doesn't have a fully public real-time traffic API
  // This is demo data structured to be replaced when an API is available
  return { data: DEMO_TRAFFIC, status: "demo" };
}
