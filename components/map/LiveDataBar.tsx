"use client";

import { useAppStore } from "@/lib/store/appStore";
import { useLiveData } from "@/lib/hooks/useData";
import { cn, getTrafficLabel } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/utils";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

function Separator() {
  return <div className="w-px h-6 bg-white/10 flex-shrink-0 hidden sm:block" />;
}

function DataItem({
  icon,
  label,
  value,
  unit,
  isLoading = false,
}: {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
      <span className="text-base" aria-hidden>
        {icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-neutral-500 leading-none mb-0.5">{label}</span>
        {isLoading ? (
          <div className="h-3.5 w-12 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-sm font-semibold text-white leading-none">
            {value}
            {unit && <span className="text-xs font-normal text-neutral-400 ml-0.5">{unit}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

export function LiveDataBar() {
  const { weather, airQuality, bicing, isLoading } = useLiveData();
  const liveData = useAppStore((s) => s.liveData);

  const weatherData = weather.data;
  const airData = airQuality.data;
  const bicingData = bicing.data;

  const lastUpdated = liveData.lastUpdated;
  const hasAnyLive =
    weatherData?.status === "live" ||
    airData?.status === "live" ||
    bicingData?.status === "live";

  return (
    <div
      className="flex items-center gap-0 overflow-x-auto scrollbar-none"
      role="region"
      aria-label="Datos urbanos en tiempo real"
    >
      {/* Indicador en vivo */}
      <div className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0">
        {isLoading ? (
          <RefreshCw className="w-3 h-3 text-neutral-500 animate-spin" />
        ) : liveData.isConnected ? (
          <Wifi className="w-3 h-3 text-emerald-400" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-400" />
        )}
        <span
          className={cn(
            "text-xs font-bold tracking-wider uppercase",
            hasAnyLive ? "text-emerald-400" : "text-sky-400"
          )}
        >
          {isLoading ? "Cargando" : hasAnyLive ? "En vivo" : "Demo"}
        </span>
        {!isLoading && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              hasAnyLive ? "bg-emerald-400 animate-pulse" : "bg-sky-400"
            )}
            aria-hidden
          />
        )}
      </div>

      <Separator />

      {/* Temperatura */}
      <DataItem
        icon={weatherData?.icon ?? "🌡"}
        label="Barcelona"
        value={weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : "—"}
        isLoading={isLoading && !weatherData}
      />

      {/* Descripción del tiempo */}
      {weatherData?.description && (
        <>
          <Separator />
          <DataItem
            icon="🌤"
            label="Tiempo"
            value={weatherData.description}
          />
        </>
      )}

      <Separator />

      {/* Tráfico */}
      <DataItem
        icon="🚗"
        label="Tráfico"
        value={liveData.traffic ? getTrafficLabel(liveData.traffic.level) : "Normal"}
      />

      <Separator />

      {/* Metro */}
      <DataItem
        icon="🚇"
        label="Metro"
        value="Circulando"
      />

      <Separator />

      {/* Bicis */}
      <DataItem
        icon="🚲"
        label="Bicis"
        value={
          bicingData?.stations
            ? bicingData.stations.reduce(
                (acc, s) => acc + s.availableBikes + s.availableElectricBikes,
                0
              )
            : "—"
        }
        isLoading={isLoading && !bicingData}
      />

      <Separator />

      {/* Calidad del aire */}
      <DataItem
        icon="🌿"
        label="Calidad Aire"
        value={
          airData
            ? airData.level === "good" ? "Buena"
            : airData.level === "fair" ? "Aceptable"
            : airData.level === "moderate" ? "Moderada"
            : airData.level === "poor" ? "Mala"
            : "Muy mala"
            : "—"
        }
        isLoading={isLoading && !airData}
      />

      {/* Humedad */}
      {weatherData?.humidity !== undefined && (
        <>
          <Separator />
          <DataItem
            icon="💧"
            label="Humedad"
            value={`${weatherData.humidity}%`}
          />
        </>
      )}

      {/* Viento */}
      {weatherData?.windSpeed !== undefined && (
        <>
          <Separator />
          <DataItem
            icon="🌬"
            label="Viento"
            value={`${weatherData.windSpeed}`}
            unit="km/h"
          />
        </>
      )}

      {/* Última actualización */}
      {lastUpdated && (
        <div className="flex items-center gap-1 px-3 py-2 flex-shrink-0 ml-auto">
          <span className="text-xs text-neutral-600">
            Actualizado {formatTimeAgo(lastUpdated)}
          </span>
        </div>
      )}
    </div>
  );
}
