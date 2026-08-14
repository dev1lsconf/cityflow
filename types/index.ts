// ─── Geographic Types ──────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ─── Map Types ────────────────────────────────────────────────────────────────

export type MapStyle = "dark" | "light" | "satellite" | "streets";

export interface MapState {
  center: Coordinates;
  zoom: number;
  bearing: number;
  pitch: number;
  style: MapStyle;
}

// ─── Layer Types ──────────────────────────────────────────────────────────────

export type LayerId =
  | "metro"
  | "bus"
  | "bicing"
  | "traffic"
  | "parking"
  | "places"
  | "events"
  | "hospitals"
  | "education"
  | "parks"
  | "temperature"
  | "rain"
  | "wind"
  | "air_quality";

export type LayerCategory = "mobility" | "city" | "environment";

export interface Layer {
  id: LayerId;
  name: string;
  category: LayerCategory;
  icon: string;
  color: string;
  enabled: boolean;
  loading?: boolean;
  error?: string;
}

// ─── Data Source Status ────────────────────────────────────────────────────────

export type DataStatus = "live" | "cached" | "demo" | "loading" | "error" | "offline";

export interface DataSourceStatus {
  id: string;
  name: string;
  status: DataStatus;
  lastUpdated: Date | null;
  error?: string;
}

// ─── Weather Types ────────────────────────────────────────────────────────────

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  weatherCode: number;
  description: string;
  icon: string;
  status: DataStatus;
  lastUpdated: Date | null;
}

// ─── Transit Types ────────────────────────────────────────────────────────────

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  status: "good" | "delays" | "disrupted" | "closed";
  statusMessage?: string;
}

export interface MetroStation {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: string[];
  district: string;
}

export interface BusStop {
  id: string;
  name: string;
  coordinates: Coordinates;
  lines: string[];
}

export interface BicingStation {
  id: string;
  name: string;
  coordinates: Coordinates;
  availableBikes: number;
  availableElectricBikes: number;
  availableDocks: number;
  totalDocks: number;
  status: "IN_SERVICE" | "CLOSED" | "PLANNED";
  district: string;
}

export interface TrafficData {
  level: "fluid" | "dense" | "congested" | "stopped";
  description: string;
  incidents: TrafficIncident[];
}

export interface TrafficIncident {
  id: string;
  coordinates: Coordinates;
  type: "accident" | "roadwork" | "closure" | "event";
  description: string;
  severity: "low" | "medium" | "high";
}

// ─── Places Types ─────────────────────────────────────────────────────────────

export type PlaceCategory =
  | "landmark"
  | "museum"
  | "park"
  | "restaurant"
  | "shopping"
  | "hospital"
  | "school"
  | "hotel"
  | "beach"
  | "sports"
  | "nightlife"
  | "culture"
  | "food"
  | "nature"
  | "architecture";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  coordinates: Coordinates;
  description?: string;
  address?: string;
  district?: string;
  rating?: number;
  imageUrl?: string;
  tags?: string[];
  openingHours?: string;
  website?: string;
  nearbyTransit?: {
    metro?: string[];
    bus?: string[];
    bicing?: BicingStation[];
  };
}

// ─── Air Quality Types ────────────────────────────────────────────────────────

export type AQILevel = "good" | "fair" | "moderate" | "poor" | "very_poor";

export interface AirQualityData {
  aqi: number;
  level: AQILevel;
  description: string;
  pm10: number;
  pm25: number;
  no2: number;
  o3: number;
  status: DataStatus;
  lastUpdated: Date | null;
}

// ─── Live Data Bar ────────────────────────────────────────────────────────────

export interface LiveDataItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status: DataStatus;
  trend?: "up" | "down" | "stable";
  icon?: string;
}

export interface LiveDataState {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  bicing: {
    totalAvailable: number;
    totalElectric: number;
    status: DataStatus;
  } | null;
  traffic: TrafficData | null;
  metro: {
    status: "good" | "delays" | "disrupted";
    lines: MetroLine[];
    status_data: DataStatus;
  } | null;
  lastUpdated: Date | null;
  isConnected: boolean;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface DashboardStats {
  population: number;
  activeBikes: number;
  trafficLevel: string;
  temperature: number;
  airQuality: string;
  metroStatus: string;
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  name: string;
  type: "place" | "address" | "district" | "poi";
  coordinates: Coordinates;
  description?: string;
  category?: string;
  icon?: string;
}

// ─── Insight Types ────────────────────────────────────────────────────────────

export type InsightType = "traffic" | "weather" | "mobility" | "air" | "general";

export interface CityInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  isDemo: boolean;
  timestamp: Date;
  icon?: string;
}

// ─── Explore Types ────────────────────────────────────────────────────────────

export interface ExploreCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  count?: number;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface SelectedFeature {
  type: "place" | "station" | "stop" | "bicing";
  data: Place | MetroStation | BusStop | BicingStation;
}
