import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DataStatus, AQILevel } from "@/types";

// ─── Tailwind Utilities ────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Status Utilities ─────────────────────────────────────────────────────────

export function getStatusColor(status: DataStatus): string {
  switch (status) {
    case "live": return "text-emerald-400";
    case "cached": return "text-amber-400";
    case "demo": return "text-sky-400";
    case "loading": return "text-neutral-400";
    case "error": return "text-red-400";
    case "offline": return "text-neutral-500";
  }
}

export function getStatusDotClass(status: DataStatus): string {
  switch (status) {
    case "live": return "bg-emerald-400 animate-pulse";
    case "cached": return "bg-amber-400";
    case "demo": return "bg-sky-400";
    case "loading": return "bg-neutral-400 animate-pulse";
    case "error": return "bg-red-400";
    case "offline": return "bg-neutral-600";
  }
}

export function getStatusLabel(status: DataStatus): string {
  switch (status) {
    case "live": return "LIVE";
    case "cached": return "CACHED";
    case "demo": return "DEMO";
    case "loading": return "LOADING";
    case "error": return "ERROR";
    case "offline": return "OFFLINE";
  }
}

// ─── AQI Utilities ────────────────────────────────────────────────────────────

export function getAQIColor(level: AQILevel): string {
  switch (level) {
    case "good": return "text-emerald-400";
    case "fair": return "text-green-400";
    case "moderate": return "text-amber-400";
    case "poor": return "text-orange-400";
    case "very_poor": return "text-red-400";
  }
}

export function getAQIBadgeClass(level: AQILevel): string {
  switch (level) {
    case "good": return "bg-emerald-400/20 text-emerald-400 border-emerald-400/30";
    case "fair": return "bg-green-400/20 text-green-400 border-green-400/30";
    case "moderate": return "bg-amber-400/20 text-amber-400 border-amber-400/30";
    case "poor": return "bg-orange-400/20 text-orange-400 border-orange-400/30";
    case "very_poor": return "bg-red-400/20 text-red-400 border-red-400/30";
  }
}

// ─── Traffic Utilities ────────────────────────────────────────────────────────

export function getTrafficColor(level: string): string {
  switch (level) {
    case "fluid": return "text-emerald-400";
    case "dense": return "text-amber-400";
    case "congested": return "text-orange-400";
    case "stopped": return "text-red-400";
    default: return "text-neutral-400";
  }
}

export function getTrafficLabel(level: string): string {
  switch (level) {
    case "fluid": return "Fluid";
    case "dense": return "Dense";
    case "congested": return "Congested";
    case "stopped": return "Stopped";
    default: return "Unknown";
  }
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCompact(num: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}

// ─── Date Utilities ────────────────────────────────────────────────────────────

export function formatTime(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(date);
}

export function formatTimeAgo(date: Date | null): string {
  if (!date) return "never";
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── Distance Utilities ───────────────────────────────────────────────────────

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// ─── Map Style URLs ────────────────────────────────────────────────────────────

export function getMapStyleUrl(style: "dark" | "light" | "satellite" | "streets", maptilerKey?: string): string {
  if (maptilerKey) {
    const styles = {
      dark: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${maptilerKey}`,
      light: `https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerKey}`,
      satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${maptilerKey}`,
      streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`,
    };
    return styles[style];
  }
  // Free fallback: OpenFreeMap
  const fallbacks = {
    dark: "https://tiles.openfreemap.org/styles/liberty",
    light: "https://tiles.openfreemap.org/styles/bright",
    satellite: "https://tiles.openfreemap.org/styles/liberty",
    streets: "https://tiles.openfreemap.org/styles/liberty",
  };
  return fallbacks[style];
}
