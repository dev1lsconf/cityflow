"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchWeather, fetchAirQuality, fetchBicingStations } from "@/lib/api/city";
import { useAppStore } from "@/lib/store/appStore";
import type { WeatherData, AirQualityData, BicingStation, DataStatus } from "@/types";
import { DEMO_WEATHER, DEMO_AIR_QUALITY, DEMO_BICING_STATIONS } from "@/lib/data/demo";

// ─── Weather Hook ─────────────────────────────────────────────────────────────

export function useWeather() {
  const updateLiveData = useAppStore((s) => s.updateLiveData);

  const query = useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    placeholderData: { ...DEMO_WEATHER, status: "loading" },
  });

  useEffect(() => {
    if (query.data) {
      updateLiveData({ weather: query.data, lastUpdated: new Date() });
    }
  }, [query.data, updateLiveData]);

  return query;
}

// ─── Air Quality Hook ─────────────────────────────────────────────────────────

export function useAirQuality() {
  const updateLiveData = useAppStore((s) => s.updateLiveData);

  const query = useQuery<AirQualityData>({
    queryKey: ["airQuality"],
    queryFn: fetchAirQuality,
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
    placeholderData: { ...DEMO_AIR_QUALITY, status: "loading" },
  });

  useEffect(() => {
    if (query.data) {
      updateLiveData({ airQuality: query.data });
    }
  }, [query.data, updateLiveData]);

  return query;
}

// ─── Bicing Hook ──────────────────────────────────────────────────────────────

export function useBicingStations() {
  const updateLiveData = useAppStore((s) => s.updateLiveData);

  const query = useQuery<{ stations: BicingStation[]; status: DataStatus }>({
    queryKey: ["bicing"],
    queryFn: fetchBicingStations,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    placeholderData: { stations: DEMO_BICING_STATIONS, status: "loading" },
  });

  useEffect(() => {
    if (query.data) {
      const total = query.data.stations.reduce((acc, s) => acc + s.availableBikes + s.availableElectricBikes, 0);
      const electric = query.data.stations.reduce((acc, s) => acc + s.availableElectricBikes, 0);
      updateLiveData({
        bicing: {
          totalAvailable: total,
          totalElectric: electric,
          status: query.data.status,
        },
      });
    }
  }, [query.data, updateLiveData]);

  return query;
}

// ─── Live Data Orchestrator ───────────────────────────────────────────────────

export function useLiveData() {
  const weather = useWeather();
  const airQuality = useAirQuality();
  const bicing = useBicingStations();

  const isLoading = weather.isLoading || airQuality.isLoading || bicing.isLoading;
  const hasError = weather.isError && airQuality.isError && bicing.isError;

  return { weather, airQuality, bicing, isLoading, hasError };
}
