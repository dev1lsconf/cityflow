"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import { cn, debounce } from "@/lib/utils";
import { geocodeSearch } from "@/lib/api/geocoding";
import { useAppStore } from "@/lib/store/appStore";
import { DEMO_SEARCH_SUGGESTIONS } from "@/lib/data/demo";
import type { SearchResult } from "@/types";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search Barcelona..." }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setSelectedFeature, setMapState, mapState } = useAppStore();

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions(DEMO_SEARCH_SUGGESTIONS.slice(0, 4));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await geocodeSearch(query);
        setSuggestions(results.length > 0 ? results : []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350),
    []
  );

  useEffect(() => {
    if (isOpen && inputValue.length === 0) {
      setSuggestions(DEMO_SEARCH_SUGGESTIONS.slice(0, 4));
    }
  }, [isOpen, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);

    if (!isOpen) setIsOpen(true);

    if (value.length === 0) {
      setSuggestions(DEMO_SEARCH_SUGGESTIONS.slice(0, 4));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      debouncedSearch(value);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setInputValue(result.name);
    setIsOpen(false);
    setSuggestions([]);

    // Move map to location
    setMapState({
      center: result.coordinates,
      zoom: Math.max(mapState.zoom, 15),
    });

    // If it's a known place in our demo data, select it
    if (result.type === "poi" || result.type === "place") {
      // Create a minimal place object for the info panel
      const place = {
        id: result.id,
        name: result.name,
        category: (result.category ?? "landmark") as import("@/types").PlaceCategory,
        coordinates: result.coordinates,
        description: result.description,
      };
      setSelectedFeature({ type: "place", data: place });
    }

    // Fly the actual map
    if (typeof window !== "undefined") {
      const mapRef = (window as Window & { __cityflowMapRef?: import("maplibre-gl").Map | null }).__cityflowMapRef;
      if (mapRef) {
        mapRef.flyTo({
          center: [result.coordinates.lng, result.coordinates.lat],
          zoom: 15,
          duration: 1500,
          essential: true,
        });
      }
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions(DEMO_SEARCH_SUGGESTIONS.slice(0, 4));
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border rounded-xl px-3 py-2 transition-all duration-200",
          isOpen && inputValue.length > 0
            ? "border-white/20 shadow-lg shadow-black/30"
            : "border-white/10 hover:border-white/15"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-neutral-500 animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-neutral-500 flex-shrink-0" aria-hidden />
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none min-w-0"
          aria-label="Buscar en Barcelona"
          aria-autocomplete="list"
          aria-expanded={isOpen && suggestions.length > 0}
          role="combobox"
        />
        {inputValue.length > 0 && (
          <button
            onClick={handleClear}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-neutral-500 hover:text-white flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-neutral-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          role="listbox"
          aria-label="Sugerencias de búsqueda"
        >
          {inputValue.length === 0 && (
            <div className="px-3 py-2 border-b border-white/8">
              <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Lugares populares</span>
            </div>
          )}

          {suggestions.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors",
                index === highlightedIndex
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <span className="text-base flex-shrink-0 w-5 text-center" aria-hidden>
                {result.icon ?? "📌"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{result.name}</div>
                {result.description && (
                  <div className="text-xs text-neutral-500 truncate">{result.description}</div>
                )}
              </div>
              <MapPin className="w-3 h-3 text-neutral-600 flex-shrink-0" aria-hidden />
            </button>
          ))}

          {suggestions.length === 0 && inputValue.length > 0 && !isLoading && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-neutral-500">Sin resultados para &ldquo;{inputValue}&rdquo;</p>
              <p className="text-xs text-neutral-600 mt-1">Prueba con otro término de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
