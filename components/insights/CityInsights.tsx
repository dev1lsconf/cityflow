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
  high: "Alta confianza",
  medium: "Confianza media",
  low: "Baja confianza",
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
    <div className="flex gap-4 p-4 rounded-2xl border bg-neutral-900/60 border-white/8 transition-all duration-200 hover:border-white/18">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", config.bg, config.border)}>
        {insight.icon ? (
          <span className="text-lg" aria-hidden>{insight.icon}</span>
        ) : (
          <Icon className={cn("w-5 h-5", config.color)} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-white leading-tight">{insight.title}</h3>
          {insight.isDemo && (
            <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">DEMO</span>
          )}
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
        <h3 className="text-sm font-semibold text-neutral-400 mb-1">Datos insuficientes</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          No hay suficientes datos en tiempo real para generar este análisis. Conecta a las fuentes de datos para obtener análisis reales.
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

  const insights = useMemo<CityInsight[]>(() => {
    const generated: CityInsight[] = [];

    if (weatherData?.temperature !== undefined) {
      if (weatherData.temperature > 30) {
        generated.push({
          id: "gen-heat", type: "weather",
          title: "Temperaturas altas hoy",
          description: `La temperatura actual es de ${weatherData.temperature}°C. Mantente hidratado y busca sombra en las horas de más calor.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo", timestamp: new Date(), icon: "☀️",
        });
      } else if (weatherData.temperature < 12) {
        generated.push({
          id: "gen-cold", type: "weather",
          title: "Tiempo fresco",
          description: `La temperatura es de ${weatherData.temperature}°C. Abrígate para las actividades al aire libre.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo", timestamp: new Date(), icon: "🧥",
        });
      } else {
        generated.push({
          id: "gen-nice", type: "weather",
          title: "Condiciones agradables",
          description: `${weatherData.temperature}°C con ${weatherData.description.toLowerCase()}. Condiciones ideales para actividades al aire libre y bicicleta.`,
          confidence: weatherData.status === "live" ? "high" : "medium",
          isDemo: weatherData.status === "demo", timestamp: new Date(), icon: weatherData.icon,
        });
      }
    }

    if (airData?.aqi !== undefined) {
      if (airData.level === "good" || airData.level === "fair") {
        generated.push({
          id: "gen-air", type: "air",
          title: "Buena calidad del aire en la ciudad",
          description: `La calidad del aire es "${airData.level === "good" ? "buena" : "aceptable"} con un ICA de ${airData.aqi}. Seguro y recomendado para deportes al aire libre.`,
          confidence: airData.status === "live" ? "high" : "medium",
          isDemo: airData.status === "demo", timestamp: new Date(), icon: "🌿",
        });
      } else {
        generated.push({
          id: "gen-air-bad", type: "air",
          title: "Niveles elevados de contaminación",
          description: `ICA actual ${airData.aqi}. Se recomienda a los grupos sensibles limitar la exposición al exterior.`,
          confidence: airData.status === "live" ? "high" : "medium",
          isDemo: airData.status === "demo", timestamp: new Date(), icon: "😷",
        });
      }
    }

    if (bicingData?.stations && bicingData.stations.length > 0) {
      const total = bicingData.stations.reduce((acc, s) => acc + s.availableBikes + s.availableElectricBikes, 0);
      const avg = total / bicingData.stations.length;
      generated.push({
        id: "gen-bicing", type: "mobility",
        title: avg > 8 ? "Alta disponibilidad de bicis" : avg > 3 ? "Disponibilidad moderada de bicis" : "Baja disponibilidad de bicis",
        description: avg > 3
          ? `${total} bicis disponibles en ${bicingData.stations.length} estaciones. Media de ${avg.toFixed(1)} por estación.`
          : `Solo ${total} bicis disponibles en ${bicingData.stations.length} estaciones. Considera transporte alternativo.`,
        confidence: bicingData.status === "live" ? "high" : "medium",
        isDemo: bicingData.status === "demo", timestamp: new Date(), icon: "🚲",
      });
    }

    // Traducir insights demo
    const demoTraducidos: CityInsight[] = [
      {
        id: "d-traffic", type: "traffic",
        title: "Tráfico por debajo de la media diaria",
        description: "El volumen de tráfico actual es aproximadamente un 15% inferior a la media habitual de un día laborable a esta hora.",
        confidence: "medium", isDemo: true, timestamp: new Date(), icon: "🚗",
      },
      {
        id: "d-bicing", type: "mobility",
        title: "Alta disponibilidad de bicis en el Eixample",
        description: "Las estaciones Bicing del Eixample tienen disponibilidad superior a la media, con más del 60% de plazas ocupadas por bicis.",
        confidence: "high", isDemo: true, timestamp: new Date(), icon: "🚲",
      },
      {
        id: "d-weather", type: "weather",
        title: "Se esperan temperaturas en aumento",
        description: "La previsión indica que se alcanzarán los 27°C a las 15:00 y la temperatura irá bajando a partir de la tarde.",
        confidence: "high", isDemo: true, timestamp: new Date(), icon: "🌡",
      },
      {
        id: "d-air", type: "air",
        title: "Buena calidad del aire en toda la ciudad",
        description: "La calidad del aire es \"buena\" en todas las estaciones de medición. Seguro para actividades deportivas al aire libre.",
        confidence: "high", isDemo: true, timestamp: new Date(), icon: "🌿",
      },
      {
        id: "d-metro", type: "general",
        title: "Metro circulando con normalidad",
        description: "Todas las líneas de metro excepto la L4 funcionan con normalidad. Se registran pequeñas demoras en el tramo norte de la L4.",
        confidence: "medium", isDemo: true, timestamp: new Date(), icon: "🚇",
      },
    ];

    const combined = [...generated, ...demoTraducidos.filter((d) => !generated.some((g) => g.type === d.type))];
    return maxItems ? combined.slice(0, maxItems) : combined;
  }, [weatherData, airData, bicingData, maxItems]);

  return (
    <div className={cn("space-y-3", className)}>
      {insights.length === 0 ? (
        <NoDataInsight />
      ) : (
        insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)
      )}
      {compact && insights.length > 0 && (
        <p className="text-xs text-neutral-600 text-center pt-1">
          Análisis generados a partir de las fuentes de datos disponibles
        </p>
      )}
    </div>
  );
}
