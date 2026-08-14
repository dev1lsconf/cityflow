"use client";

import { Maximize2, Minimize2, RotateCcw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/appStore";
import type { MapStyle } from "@/types";

const MAP_STYLES: { id: MapStyle; label: string; icon: string }[] = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "satellite", label: "Satellite", icon: "🛰" },
  { id: "streets", label: "Streets", icon: "🗺" },
];

interface MapControlsProps {
  className?: string;
  onStyleChange?: (style: MapStyle) => void;
  onResetBearing?: () => void;
  onToggleFullscreen?: () => void;
}

export function MapControls({
  className,
  onStyleChange,
  onResetBearing,
  onToggleFullscreen,
}: MapControlsProps) {
  const { mapState, isFullscreen } = useAppStore();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className="map-control-btn"
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>

      {/* Reset bearing */}
      {mapState.bearing !== 0 && (
        <button
          onClick={onResetBearing}
          className="map-control-btn"
          title="Reset north"
          aria-label="Reset map to north"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface MapStyleSwitcherProps {
  currentStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
  className?: string;
}

export function MapStyleSwitcher({ currentStyle, onStyleChange, className }: MapStyleSwitcherProps) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl overflow-hidden border border-white/10 bg-neutral-900/90 backdrop-blur-md shadow-xl", className)}>
      <div className="px-3 py-2 flex items-center gap-2 border-b border-white/10">
        <Layers className="w-3 h-3 text-neutral-400" />
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Style</span>
      </div>
      {MAP_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleChange(style.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left",
            currentStyle === style.id
              ? "text-white bg-white/10"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
          aria-label={`Switch to ${style.label} style`}
        >
          <span>{style.icon}</span>
          <span>{style.label}</span>
        </button>
      ))}
    </div>
  );
}
