"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Map, BarChart2, Compass, Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/mapa", label: "Explorar", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/descubrir", label: "Descubrir", icon: Lightbulb },
  { href: "/sobre-nosotros", label: "Acerca de", icon: Info },
];

interface NavbarProps {
  showSearch?: boolean;
  transparent?: boolean;
}

export function Navbar({ showSearch = false, transparent = false }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className={cn(
          "relative z-40 flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-white/8 h-14",
          transparent
            ? "bg-transparent"
            : "bg-neutral-950/90 backdrop-blur-xl"
        )}
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mr-2 flex-shrink-0 group"
          aria-label="Inicio CityFlow"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Map className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight hidden sm:block">
            CityFlow
          </span>
        </Link>

        {/* Navegación desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive(href)
                  ? "text-white bg-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Derecha */}
        <div className="ml-auto flex items-center gap-2">
          {!showSearch && (
            <Link
              href="/mapa"
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              Abrir Mapa
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-neutral-950/98 backdrop-blur-xl pt-14 flex flex-col">
          <div className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(href)
                    ? "text-white bg-white/10"
                    : "text-neutral-400 hover:text-white hover:bg-white/8"
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <div className="mt-4">
              <Link
                href="/mapa"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors"
              >
                <Map className="w-4 h-4" />
                Abrir Mapa
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
