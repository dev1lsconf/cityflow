/**
 * Demo data for CityFlow
 * Used when real APIs are unavailable or in demo mode.
 * All data is clearly marked as demo/mock.
 * Data structures match real API response shapes for easy replacement.
 */

import type {
  MetroStation,
  MetroLine,
  BicingStation,
  Place,
  TrafficData,
  AirQualityData,
  WeatherData,
  ChartDataPoint,
  CityInsight,
  ExploreCategory,
  SearchResult,
  BusStop,
} from "@/types";

// ─── Metro Lines ──────────────────────────────────────────────────────────────

export const DEMO_METRO_LINES: MetroLine[] = [
  { id: "L1", name: "L1", color: "#d52b1e", status: "good" },
  { id: "L2", name: "L2", color: "#9b4f96", status: "good" },
  { id: "L3", name: "L3", color: "#007b53", status: "good" },
  { id: "L4", name: "L4", color: "#f9a51b", status: "delays", statusMessage: "Minor delays on northern section" },
  { id: "L5", name: "L5", color: "#1d4fa2", status: "good" },
  { id: "L9N", name: "L9N", color: "#f7941d", status: "good" },
  { id: "L9S", name: "L9S", color: "#f7941d", status: "good" },
  { id: "L10N", name: "L10N", color: "#00a0df", status: "good" },
  { id: "L11", name: "L11", color: "#8dc641", status: "good" },
];

// ─── Metro Stations ───────────────────────────────────────────────────────────

export const DEMO_METRO_STATIONS: MetroStation[] = [
  {
    id: "s1",
    name: "Plaça Catalunya",
    coordinates: { lat: 41.3874, lng: 2.1700 },
    lines: ["L1", "L3"],
    district: "Eixample",
  },
  {
    id: "s2",
    name: "Passeig de Gràcia",
    coordinates: { lat: 41.3917, lng: 2.1650 },
    lines: ["L2", "L3", "L4"],
    district: "Eixample",
  },
  {
    id: "s3",
    name: "Sagrada Família",
    coordinates: { lat: 41.4036, lng: 2.1744 },
    lines: ["L2", "L5"],
    district: "Eixample",
  },
  {
    id: "s4",
    name: "Barceloneta",
    coordinates: { lat: 41.3817, lng: 2.1897 },
    lines: ["L4"],
    district: "Ciutat Vella",
  },
  {
    id: "s5",
    name: "Arc de Triomf",
    coordinates: { lat: 41.3908, lng: 2.1810 },
    lines: ["L1"],
    district: "Eixample",
  },
  {
    id: "s6",
    name: "Diagonal",
    coordinates: { lat: 41.3942, lng: 2.1540 },
    lines: ["L3", "L5"],
    district: "Eixample",
  },
  {
    id: "s7",
    name: "Universitat",
    coordinates: { lat: 41.3858, lng: 2.1635 },
    lines: ["L1", "L2"],
    district: "Eixample",
  },
  {
    id: "s8",
    name: "Liceu",
    coordinates: { lat: 41.3807, lng: 2.1738 },
    lines: ["L3"],
    district: "Ciutat Vella",
  },
  {
    id: "s9",
    name: "Jaume I",
    coordinates: { lat: 41.3832, lng: 2.1780 },
    lines: ["L4"],
    district: "Ciutat Vella",
  },
  {
    id: "s10",
    name: "Verdaguer",
    coordinates: { lat: 41.4010, lng: 2.1647 },
    lines: ["L4", "L5"],
    district: "Eixample",
  },
];

// ─── Bicing Stations ──────────────────────────────────────────────────────────

export const DEMO_BICING_STATIONS: BicingStation[] = [
  {
    id: "b1",
    name: "C/ Gran Via, 56",
    coordinates: { lat: 41.3875, lng: 2.1650 },
    availableBikes: 8,
    availableElectricBikes: 3,
    availableDocks: 7,
    totalDocks: 18,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b2",
    name: "Pl. Catalunya, 1",
    coordinates: { lat: 41.3869, lng: 2.1698 },
    availableBikes: 12,
    availableElectricBikes: 5,
    availableDocks: 3,
    totalDocks: 20,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b3",
    name: "C/ Aragó, 281",
    coordinates: { lat: 41.3914, lng: 2.1645 },
    availableBikes: 3,
    availableElectricBikes: 1,
    availableDocks: 12,
    totalDocks: 16,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b4",
    name: "Pg. de Gràcia, 24",
    coordinates: { lat: 41.3893, lng: 2.1643 },
    availableBikes: 0,
    availableElectricBikes: 2,
    availableDocks: 14,
    totalDocks: 16,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b5",
    name: "C/ Marina, 170",
    coordinates: { lat: 41.4029, lng: 2.1812 },
    availableBikes: 6,
    availableElectricBikes: 2,
    availableDocks: 8,
    totalDocks: 16,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b6",
    name: "C/ Muntaner, 3",
    coordinates: { lat: 41.3845, lng: 2.1594 },
    availableBikes: 9,
    availableElectricBikes: 4,
    availableDocks: 5,
    totalDocks: 18,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b7",
    name: "C/ Provença, 385",
    coordinates: { lat: 41.3975, lng: 2.1721 },
    availableBikes: 14,
    availableElectricBikes: 6,
    availableDocks: 2,
    totalDocks: 22,
    status: "IN_SERVICE",
    district: "Eixample",
  },
  {
    id: "b8",
    name: "Rambla Catalunya, 33",
    coordinates: { lat: 41.3903, lng: 2.1631 },
    availableBikes: 5,
    availableElectricBikes: 2,
    availableDocks: 11,
    totalDocks: 18,
    status: "IN_SERVICE",
    district: "Eixample",
  },
];

// ─── Places / POIs ────────────────────────────────────────────────────────────

export const DEMO_PLACES: Place[] = [
  {
    id: "p1",
    name: "Sagrada Família",
    category: "landmark",
    coordinates: { lat: 41.4036, lng: 2.1744 },
    description: "Antoni Gaudí's iconic unfinished basilica, a UNESCO World Heritage Site.",
    address: "C/ de Mallorca, 401",
    district: "Eixample",
    tags: ["architecture", "gaudí", "landmark", "unesco"],
    openingHours: "9:00 - 20:00",
    website: "https://sagradafamilia.org",
    nearbyTransit: { metro: ["L2", "L5"] },
  },
  {
    id: "p2",
    name: "Park Güell",
    category: "park",
    coordinates: { lat: 41.4145, lng: 2.1527 },
    description: "A public park system composed of gardens and architectonic elements designed by Gaudí.",
    address: "C/ d'Olot, s/n",
    district: "Gràcia",
    tags: ["park", "gaudí", "architecture", "nature"],
    openingHours: "8:00 - 21:00",
    website: "https://parkguell.barcelona",
  },
  {
    id: "p3",
    name: "Casa Batlló",
    category: "landmark",
    coordinates: { lat: 41.3916, lng: 2.1649 },
    description: "One of the most iconic buildings of Art Nouveau architecture by Antoni Gaudí.",
    address: "Pg. de Gràcia, 43",
    district: "Eixample",
    tags: ["architecture", "gaudí", "art nouveau", "modernisme"],
    openingHours: "9:00 - 21:00",
    website: "https://casabatllo.es",
    nearbyTransit: { metro: ["L2", "L3", "L4"] },
  },
  {
    id: "p4",
    name: "La Barceloneta",
    category: "beach",
    coordinates: { lat: 41.3759, lng: 2.1916 },
    description: "Barcelona's most popular urban beach stretching along the Mediterranean coast.",
    district: "Barceloneta",
    tags: ["beach", "sea", "leisure"],
    nearbyTransit: { metro: ["L4"] },
  },
  {
    id: "p5",
    name: "MACBA",
    category: "museum",
    coordinates: { lat: 41.3833, lng: 2.1680 },
    description: "Barcelona Museum of Contemporary Art, designed by Richard Meier.",
    address: "Plaça dels Àngels, 1",
    district: "Ciutat Vella",
    tags: ["art", "museum", "contemporary"],
    openingHours: "11:00 - 19:30",
    nearbyTransit: { metro: ["L1", "L3"] },
  },
  {
    id: "p6",
    name: "La Boqueria",
    category: "food",
    coordinates: { lat: 41.3816, lng: 2.1717 },
    description: "Barcelona's most iconic public market with fresh produce, fish, meat and more.",
    address: "La Rambla, 91",
    district: "Ciutat Vella",
    tags: ["market", "food", "local"],
    openingHours: "8:00 - 20:30",
    nearbyTransit: { metro: ["L3"] },
  },
  {
    id: "p7",
    name: "Parc de la Ciutadella",
    category: "park",
    coordinates: { lat: 41.3862, lng: 2.1860 },
    description: "Barcelona's main green lung in the heart of the city with a lake, zoo and fountain.",
    district: "Eixample",
    tags: ["park", "nature", "leisure"],
    nearbyTransit: { metro: ["L1", "L4"] },
  },
  {
    id: "p8",
    name: "Hospital de Sant Pau",
    category: "hospital",
    coordinates: { lat: 41.4121, lng: 2.1743 },
    description: "Modernista complex and hospital, designated UNESCO World Heritage Site.",
    address: "C/ de Sant Antoni Maria Claret, 167",
    district: "Eixample",
    tags: ["architecture", "hospital", "modernisme", "heritage"],
    nearbyTransit: { metro: ["L5"] },
  },
  {
    id: "p9",
    name: "Camp Nou",
    category: "sports",
    coordinates: { lat: 41.3808, lng: 2.1228 },
    description: "Home of FC Barcelona, the largest stadium in Spain and Europe.",
    address: "C/ d'Aristides Maillol, s/n",
    district: "Les Corts",
    tags: ["sports", "football", "stadium"],
    nearbyTransit: { metro: ["L3", "L5"] },
  },
  {
    id: "p10",
    name: "Tibidabo",
    category: "landmark",
    coordinates: { lat: 41.4218, lng: 2.1189 },
    description: "The highest point in the Collserola mountains with panoramic views over Barcelona.",
    district: "Sarrià-Sant Gervasi",
    tags: ["viewpoint", "nature", "amusement park"],
  },
  {
    id: "p11",
    name: "Fundació Joan Miró",
    category: "museum",
    coordinates: { lat: 41.3684, lng: 2.1592 },
    description: "Museum dedicated to the works of Joan Miró, located on the hill of Montjuïc.",
    address: "Parc de Montjuïc, s/n",
    district: "Sants-Montjuïc",
    tags: ["art", "museum", "miró"],
    openingHours: "10:00 - 19:00",
  },
  {
    id: "p12",
    name: "Palau de la Música Catalana",
    category: "culture",
    coordinates: { lat: 41.3875, lng: 2.1754 },
    description: "A concert hall built in the Catalan Modernista style, UNESCO World Heritage Site.",
    address: "C/ del Palau de la Música, 4-6",
    district: "Ciutat Vella",
    tags: ["music", "architecture", "modernisme", "concert"],
    nearbyTransit: { metro: ["L1", "L4"] },
  },
];

// ─── Traffic Data ─────────────────────────────────────────────────────────────

export const DEMO_TRAFFIC: TrafficData = {
  level: "dense",
  description: "Dense traffic on main access roads, normal on most streets.",
  incidents: [
    {
      id: "i1",
      coordinates: { lat: 41.3901, lng: 2.1540 },
      type: "roadwork",
      description: "Road works on Avinguda Diagonal reducing to one lane",
      severity: "medium",
    },
    {
      id: "i2",
      coordinates: { lat: 41.3769, lng: 2.1849 },
      type: "accident",
      description: "Minor accident on Via Laietana, right lane blocked",
      severity: "low",
    },
  ],
};

// ─── Weather Data ─────────────────────────────────────────────────────────────

export const DEMO_WEATHER: WeatherData = {
  temperature: 24,
  feelsLike: 26,
  humidity: 65,
  windSpeed: 12,
  windDirection: 220,
  precipitation: 0,
  weatherCode: 1,
  description: "Partly cloudy",
  icon: "⛅",
  status: "demo",
  lastUpdated: new Date(),
};

// ─── Air Quality Data ─────────────────────────────────────────────────────────

export const DEMO_AIR_QUALITY: AirQualityData = {
  aqi: 42,
  level: "good",
  description: "Air quality is satisfactory. Outdoor activities are safe.",
  pm10: 18,
  pm25: 9,
  no2: 35,
  o3: 68,
  status: "demo",
  lastUpdated: new Date(),
};

// ─── Chart Data ───────────────────────────────────────────────────────────────

export function generateTrafficChartData(): ChartDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 3600000);
    const h = hour.getHours();
    // Simulate realistic traffic patterns
    let value: number;
    if (h >= 7 && h <= 9) value = 75 + Math.random() * 20; // morning peak
    else if (h >= 17 && h <= 20) value = 80 + Math.random() * 15; // evening peak
    else if (h >= 1 && h <= 5) value = 10 + Math.random() * 10; // night
    else value = 35 + Math.random() * 25; // normal

    return {
      time: `${h.toString().padStart(2, "0")}:00`,
      value: Math.round(value),
      label: `${Math.round(value)}%`,
    };
  });
}

export function generateTemperatureChartData(): ChartDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 3600000);
    const h = hour.getHours();
    // Simulate realistic temperature for Barcelona
    const base = 18;
    const variation = h >= 12 && h <= 17 ? 8 : h >= 6 && h <= 12 ? (h - 6) * 1.3 : h >= 17 ? 8 - (h - 17) * 1.2 : -2;

    return {
      time: `${h.toString().padStart(2, "0")}:00`,
      value: Math.round(base + variation + (Math.random() - 0.5) * 2),
      label: `${Math.round(base + variation)}°C`,
    };
  });
}

export function generateBicingChartData(): ChartDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 3600000);
    const h = hour.getHours();
    let value: number;
    if (h >= 7 && h <= 10) value = 300 + Math.random() * 200; // morning commute
    else if (h >= 17 && h <= 20) value = 500 + Math.random() * 300; // evening
    else if (h >= 11 && h <= 16) value = 600 + Math.random() * 200; // midday peak
    else value = 100 + Math.random() * 150;

    return {
      time: `${h.toString().padStart(2, "0")}:00`,
      value: Math.round(value),
      label: `${Math.round(value)} bikes`,
    };
  });
}

export function generateAirQualityChartData(): ChartDataPoint[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 3600000);
    const h = hour.getHours();
    let value: number;
    if (h >= 7 && h <= 10) value = 45 + Math.random() * 20; // morning traffic
    else if (h >= 17 && h <= 20) value = 50 + Math.random() * 25;
    else if (h >= 1 && h <= 5) value = 20 + Math.random() * 10;
    else value = 30 + Math.random() * 20;

    return {
      time: `${h.toString().padStart(2, "0")}:00`,
      value: Math.round(value),
      label: `AQI ${Math.round(value)}`,
    };
  });
}

// ─── City Insights ────────────────────────────────────────────────────────────

export const DEMO_INSIGHTS: CityInsight[] = [
  {
    id: "i1",
    type: "traffic",
    title: "Traffic below daily average",
    description: "Current traffic volume is approximately 15% lighter than the typical weekday average for this time of day.",
    confidence: "medium",
    isDemo: true,
    timestamp: new Date(),
    icon: "🚗",
  },
  {
    id: "i2",
    type: "mobility",
    title: "High bike availability in Eixample",
    description: "Bicing stations around Eixample have above-average availability, with over 60% of docks occupied by bikes.",
    confidence: "high",
    isDemo: true,
    timestamp: new Date(),
    icon: "🚲",
  },
  {
    id: "i3",
    type: "weather",
    title: "Temperature expected to rise",
    description: "Temperatures are forecast to reach 27°C by 15:00 and gradually decrease in the evening.",
    confidence: "high",
    isDemo: true,
    timestamp: new Date(),
    icon: "🌡",
  },
  {
    id: "i4",
    type: "air",
    title: "Good air quality across the city",
    description: "Air quality is currently rated 'Good' across all monitoring stations. Safe for outdoor activities.",
    confidence: "high",
    isDemo: true,
    timestamp: new Date(),
    icon: "🌿",
  },
  {
    id: "i5",
    type: "general",
    title: "Metro running on schedule",
    description: "All metro lines except L4 are operating normally. Minor delays reported on L4 northern section.",
    confidence: "medium",
    isDemo: true,
    timestamp: new Date(),
    icon: "🚇",
  },
];

// ─── Explore Categories ───────────────────────────────────────────────────────

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { id: "food", name: "Food & Drink", icon: "🍽", description: "Restaurants, bars, markets and local cuisine", color: "#e8825c" },
  { id: "culture", name: "Culture", icon: "🎭", description: "Museums, galleries, theaters and concerts", color: "#9b7fe8" },
  { id: "nature", name: "Nature", icon: "🌿", description: "Parks, beaches, gardens and outdoor spaces", color: "#5cb85c" },
  { id: "architecture", name: "Architecture", icon: "🏛", description: "Modernisme, landmarks and iconic buildings", color: "#5ca8e8" },
  { id: "nightlife", name: "Nightlife", icon: "🌙", description: "Clubs, bars and after-dark entertainment", color: "#e85ca8" },
  { id: "shopping", name: "Shopping", icon: "🛍", description: "Markets, boutiques and shopping areas", color: "#e8c95c" },
  { id: "sports", name: "Sports", icon: "⚽", description: "Stadiums, sports facilities and recreation", color: "#5ce8c9" },
];

// ─── Bus Stops ────────────────────────────────────────────────────────────────

export const DEMO_BUS_STOPS: BusStop[] = [
  {
    id: "bs1",
    name: "Pl. Catalunya - Rambla",
    coordinates: { lat: 41.3870, lng: 2.1705 },
    lines: ["V13", "V15", "H16"],
  },
  {
    id: "bs2",
    name: "Pg. de Gràcia - Diagonal",
    coordinates: { lat: 41.3944, lng: 2.1534 },
    lines: ["V7", "63", "H10"],
  },
  {
    id: "bs3",
    name: "Sagrada Família",
    coordinates: { lat: 41.4041, lng: 2.1748 },
    lines: ["19", "33", "B20"],
  },
  {
    id: "bs4",
    name: "La Barceloneta",
    coordinates: { lat: 41.3797, lng: 2.1872 },
    lines: ["17", "64", "V11"],
  },
];

// ─── Search Suggestions ───────────────────────────────────────────────────────

export const DEMO_SEARCH_SUGGESTIONS: SearchResult[] = [
  {
    id: "sr1",
    name: "Plaça Catalunya",
    type: "place",
    coordinates: { lat: 41.3874, lng: 2.1700 },
    description: "Central square and transport hub of Barcelona",
    category: "landmark",
    icon: "🏛",
  },
  {
    id: "sr2",
    name: "Sagrada Família",
    type: "poi",
    coordinates: { lat: 41.4036, lng: 2.1744 },
    description: "Gaudí's iconic unfinished basilica",
    category: "landmark",
    icon: "⛪",
  },
  {
    id: "sr3",
    name: "La Barceloneta",
    type: "district",
    coordinates: { lat: 41.3759, lng: 2.1916 },
    description: "Barcelona's iconic beach neighborhood",
    category: "district",
    icon: "🏖",
  },
  {
    id: "sr4",
    name: "Camp Nou",
    type: "poi",
    coordinates: { lat: 41.3808, lng: 2.1228 },
    description: "FC Barcelona's home stadium",
    category: "sports",
    icon: "⚽",
  },
  {
    id: "sr5",
    name: "Park Güell",
    type: "poi",
    coordinates: { lat: 41.4145, lng: 2.1527 },
    description: "Gaudí's famous public park",
    category: "park",
    icon: "🌿",
  },
];

// ─── Barcelona District Boundaries (simplified centroids) ─────────────────────

export const BARCELONA_DISTRICTS = [
  { name: "Eixample", coordinates: { lat: 41.3930, lng: 2.1556 } },
  { name: "Gràcia", coordinates: { lat: 41.4027, lng: 2.1550 } },
  { name: "Sarrià-Sant Gervasi", coordinates: { lat: 41.4009, lng: 2.1189 } },
  { name: "Sant Martí", coordinates: { lat: 41.4105, lng: 2.2001 } },
  { name: "Sants-Montjuïc", coordinates: { lat: 41.3663, lng: 2.1489 } },
  { name: "Horta-Guinardó", coordinates: { lat: 41.4241, lng: 2.1781 } },
  { name: "Nou Barris", coordinates: { lat: 41.4378, lng: 2.1828 } },
  { name: "Sant Andreu", coordinates: { lat: 41.4336, lng: 2.1896 } },
  { name: "Les Corts", coordinates: { lat: 41.3839, lng: 2.1232 } },
  { name: "Ciutat Vella", coordinates: { lat: 41.3806, lng: 2.1747 } },
];

// Barcelona map center
export const BARCELONA_CENTER: [number, number] = [2.1734, 41.3851];
export const BARCELONA_DEFAULT_ZOOM = 13;
