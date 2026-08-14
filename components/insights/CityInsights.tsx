"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useWeather, useAirQuality, useBicingStations } from "@/lib/hooks/useData";
import { DEMO_INSIGHTS } from "@/lib/data/demo";
import type { CityInsight, InsightType } from "@/types";
import { TrendingUp, CloudSun, Bike, Wind, Train, AlertCircle } from "lucide-react";

const TYPE_CONFIG: Record<InsightType, { color: string; bg: string; border: string; Icon: React.ComponentType<{ className?: string }> }> = {
  traffic: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", Icon: TrendingUp },
  weather: { color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", Icon: CloudSun },
  mobility: { color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", Icon: Bike },
  air: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", Icon: Wind },
  general: { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", Icon: Train },
};

const CONFIDENCE_LABEL: Record<CityInsight["confidence"], string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

const CONFIDENCE_COLOR: Record<CityInsight["confidence"], string> = {
  high: "text-emerald-400",
  medium: "text-amber-400",
  low: "text-neutral-500",
};

function InsightCard({ insight }: { insight: CityInsight }) {
  const config = TYPE_CONFIG[insight.type];
  const { Icon } = config;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-2xl border transition-all duration-200 hover:border-white/18",
        "bg-neutral-900/60 border-white/8"
      )}
    >
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg, config.border, "border")}>
        {insight.icon ? (
          <span className="text-lg" aria-hidden>{insight.icon}</span>
        ) : (
          <Icon className={cn("w-5 h-5", config.color)} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-white leading-tight">{insight.title}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {insight.isDemo && (
              <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded-full font-medium">
                DEMO
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed mb-2">{insight.description}</p>
        <span className={cn("text-xs font-medium", CONFIDENCE_COLOR[insight.confidence])}>
          {CONFIDENCE_LABEL[insight.confidence]}
        </span>
      </div>
    </div>
  );
}

function NoDataInsight() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border bg-neutral-900/40 border-white/6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-neutral-800/60 border border-white/8">
        <AlertCircle className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-neutral-400 mb-1">Not enough live data</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Not enough live data to generate this insight. Connect to data sources for real-time analysis.
        </p>
      </div>
    </div>
  );
}

interface CityInsightsProps {
  compact?: boolean;
  maxItems?: number;
  className?: string;
}

export function CityInsights({ compact = false, maxItems, className }: CityInsightsProps) {
  const { data: weatherData } = useWeather();
  const { data: airData } = useAirQuality();
  const { data: bicingData } = useBicingStations();

  // Generate insights based on available data
  const insights = useMemo<CityInsight[]>(() => {
    const generated: CityInsight[] = [];

    // Weather-based insight
    if (weatherData && weatherData.temperature !== undefined) {
      if (weatherData.temperature > 30) {
        generated.push({
          id: "gen-heat",
          type: "weather",
          title: "High temperatures today",
          description: `Current temperature is ${weatherData.temperature}°C. Stay hydrated and seek shade during peak hours.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo",
          timestamp: new Date(),
          icon: "☀️",
        });
      } else if (weatherData.temperature < 12) {
        generated.push({
          id: "gen-cold",
          type: "weather",
          title: "Cool weather expected",
          description: `Temperature is currently ${weatherData.temperature}°C. Dress appropriately for outdoor activities.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo",
          timestamp: new Date(),
          icon: "🧥",
        });
      } else {
        generated.push({
          id: "gen-nice",
          type: "weather",
          title: "Pleasant conditions",
          description: `${weatherData.temperature}°C with ${weatherData.description.toLowerCase()}. Great conditions for outdoor activities and cycling.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo",
          timestamp: new Date(),
          icon: weatherData.icon,
        });
      }
    }

    // Air quality insight
    if (airData && airData.aqi !== undefined) {
      if (airData.level === "good" || airData.level === "fair") {
        generated.push({
          id: "gen-air",
          type: "air",
          title: "Good air quality across the city",
          description: `Air quality is rated "${airData.level}" with an AQI of ${airData.aqi}. Safe and recommended for outdoor sports.`,
          confidence: airData.status === "live" ? "high" : "medium",
          isDemo: airData.status === "demo",
          timestamp: new Date(),
          icon: "🌿",
        });
      } else {
        generated.push({
          id: "gen-air-bad",
          type: "air",
          title: "Elevated air pollution levels",
          description: `AQI is currently ${airData.aqi} (${airData.level.replace("_", " ")}). Sensitive groups should limit outdoor exposure.`,
          confidence: airData.status === "live" ? "high" : "medium",
          isDemo: airData.status === "demo",
          timestamp: new Date(),
          icon: "😷",
        });
      }
    }

    // Bicing insight
    if (bicingData?.stations && bicingData.stations.length > 0) {
      const total = bicingData.stations.reduce((acc, s) => acc + s.availableBikes + s.availableElectricBikes, 0);
      const avgPerStation = total / bicingData.stations.length;
      generated.push({
        id: "gen-bicing",
        type: "mobility",
        title: avgPerStation > 8 ? "High bike availability" : avgPerStation > 3 ? "Moderate bike availability" : "Low bike availability",
        description: avgPerStation > 3
          ? `${total} bikes available across ${bicingData.stations.length} stations. Average of ${avgPerStation.toFixed(1)} per station.`
          : `Only ${total} bikes available across ${bicingData.stations.length} stations. Consider alternative transport.`,
        confidence: bicingData.status === "live" ? "high" : "medium",
        isDemo: bicingData.status === "demo",
        timestamp: new Date(),
        icon: "🚲",
      });
    }

    // Pad with demo insights if needed
    const combined = [...generated, ...DEMO_INSIGHTS.filter(
      (d) => !generated.some((g) => g.type === d.type)
    )];

    return maxItems ? combined.slice(0, maxItems) : combined;
  }, [weatherData, airData, bicingData, maxItems]);

  return (
    <div className={cn("space-y-3", className)}>
      {insights.length === 0 ? (
        <NoDataInsight />
      ) : (
        insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))
      )}
      {compact && insights.length > 0 && (
        <p className="text-xs text-neutral-600 text-center pt-1">
          Insights generated from available data sources
        </p>
      )}
    </div>
  );
}
