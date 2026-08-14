"use client";

import { useAppStore } from "@/lib/store/appStore";
import { cn } from "@/lib/utils";
import type { Layer, LayerCategory, LayerId } from "@/types";
import { ChevronDown, ChevronRight, X, Layers } from "lucide-react";
import { useState } from "react";

const CATEGORY_LABELS: Record<LayerCategory, string> = {
  mobility: "Mobility",
  city: "City",
  environment: "Environment",
};

const CATEGORY_ICONS: Record<LayerCategory, string> = {
  mobility: "🚇",
  city: "🏛",
  environment: "🌿",
};

function LayerToggle({ layer, onToggle }: { layer: Layer; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
        layer.enabled
          ? "bg-white/8 hover:bg-white/12"
          : "hover:bg-white/5"
      )}
      aria-pressed={layer.enabled}
      aria-label={`${layer.enabled ? "Disable" : "Enable"} ${layer.name} layer`}
    >
      {/* Icon */}
      <span className="text-base w-5 text-center flex-shrink-0 select-none" aria-hidden>
        {layer.icon}
      </span>

      {/* Name */}
      <span
        className={cn(
          "flex-1 text-sm font-medium transition-colors",
          layer.enabled ? "text-white" : "text-neutral-500"
        )}
      >
        {layer.name}
      </span>

      {/* Color dot + toggle */}
      <div className="flex items-center gap-2">
        {layer.enabled && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: layer.color }}
            aria-hidden
          />
        )}
        {/* Toggle switch */}
        <div
          className={cn(
            "relative w-8 h-4 rounded-full transition-all duration-300 flex-shrink-0",
            layer.enabled ? "bg-white/20" : "bg-neutral-700"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300",
              layer.enabled
                ? "translate-x-4 bg-white"
                : "translate-x-0.5 bg-neutral-500"
            )}
            style={layer.enabled ? { backgroundColor: layer.color } : {}}
          />
        </div>
      </div>
    </button>
  );
}

interface LayerCategoryGroupProps {
  category: LayerCategory;
  layers: Layer[];
  onToggle: (id: LayerId) => void;
}

function LayerCategoryGroup({ category, layers, onToggle }: LayerCategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const activeCount = layers.filter((l) => l.enabled).length;

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
        aria-expanded={isExpanded}
      >
        <span className="text-sm" aria-hidden>{CATEGORY_ICONS[category]}</span>
        <span className="flex-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider group-hover:text-neutral-300 transition-colors">
          {CATEGORY_LABELS[category]}
        </span>
        {activeCount > 0 && (
          <span className="text-xs text-neutral-500 font-medium">
            {activeCount}
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-neutral-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-neutral-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-0.5 pl-1">
          {layers.map((layer) => (
            <LayerToggle
              key={layer.id}
              layer={layer}
              onToggle={() => onToggle(layer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LayerPanelProps {
  className?: string;
  onClose?: () => void;
}

export function LayerPanel({ className, onClose }: LayerPanelProps) {
  const { layers, toggleLayer } = useAppStore();

  const categorized = {
    mobility: layers.filter((l) => l.category === "mobility"),
    city: layers.filter((l) => l.category === "city"),
    environment: layers.filter((l) => l.category === "environment"),
  };

  const totalActive = layers.filter((l) => l.enabled).length;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-neutral-950/95 backdrop-blur-xl border-r border-white/8",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-semibold text-white">Layers</span>
          {totalActive > 0 && (
            <span className="text-xs bg-white/10 text-neutral-300 px-1.5 py-0.5 rounded-full">
              {totalActive}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-neutral-500 hover:text-white"
            aria-label="Close layer panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-4">
        {(["mobility", "city", "environment"] as LayerCategory[]).map((cat) => (
          <LayerCategoryGroup
            key={cat}
            category={cat}
            layers={categorized[cat]}
            onToggle={toggleLayer}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/8">
        <p className="text-xs text-neutral-600 text-center">
          {totalActive === 0 ? "No layers active" : `${totalActive} layer${totalActive > 1 ? "s" : ""} active`}
        </p>
      </div>
    </div>
  );
}
