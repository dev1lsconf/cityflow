import Link from "next/link";
import { Map, Database, Globe, Code2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const TECH_STACK = [
  { name: "Next.js 16", desc: "App Router, React Server Components", category: "Framework" },
  { name: "TypeScript", desc: "Tipado estricto en todo el proyecto", category: "Lenguaje" },
  { name: "MapLibre GL JS", desc: "Renderizado de mapas WebGL open-source", category: "Mapas" },
  { name: "Recharts", desc: "Visualización de datos y gráficas", category: "Gráficas" },
  { name: "Tailwind CSS", desc: "Estilos utility-first", category: "Estilos" },
  { name: "Zustand", desc: "Estado global ligero y reactivo", category: "Estado" },
  { name: "React Query", desc: "Gestión de estado del servidor", category: "Datos" },
  { name: "Netlify", desc: "Despliegue y funciones serverless", category: "Hosting" },
];

const DATA_SOURCES = [
  {
    name: "Open-Meteo",
    desc: "Datos meteorológicos y calidad del aire. Gratuito, sin clave de API necesaria.",
    url: "https://open-meteo.com",
    icon: "🌤",
  },
  {
    name: "Open Data Barcelona — Bicing",
    desc: "Disponibilidad de estaciones Bicing en tiempo real, a través del portal de datos abiertos del Ayuntamiento de Barcelona.",
    url: "https://opendata-ajuntament.barcelona.cat",
    icon: "🚲",
  },
  {
    name: "Nominatim / OpenStreetMap",
    desc: "Geocodificación y búsqueda de lugares de forma gratuita. Sin clave de API.",
    url: "https://nominatim.openstreetmap.org",
    icon: "📍",
  },
  {
    name: "OpenFreeMap",
    desc: "Tiles de mapa gratuitos basados en datos de OpenStreetMap.",
    url: "https://openfreemap.org",
    icon: "🗺",
  },
];

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Cabecera */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CityFlow</h1>
              <p className="text-xs text-neutral-500">Plataforma de Inteligencia Urbana de Barcelona</p>
            </div>
          </div>
          <p className="text-base text-neutral-400 leading-relaxed">
            CityFlow es una plataforma experimental de inteligencia urbana construida para explorar cómo los datos públicos
            pueden transformar la manera en que entendemos las ciudades. Combina movilidad, meteorología y datos ambientales
            en tiempo real en una experiencia interactiva única.
          </p>
        </div>

        {/* Cita */}
        <section className="mb-10">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/8">
            <p className="text-sm text-neutral-300 leading-relaxed italic">
              &ldquo;Las ciudades generan una cantidad enorme de datos cada día. CityFlow es un intento de hacer
              esos datos accesibles, comprensibles y visualmente atractivos, sin necesidad de herramientas especializadas
              ni conocimientos técnicos.&rdquo;
            </p>
          </div>
        </section>

        {/* Fuentes de datos */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Fuentes de Datos</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            CityFlow está construido íntegramente sobre fuentes de datos públicas y abiertas.
            No se requieren APIs de pago ni servicios propietarios para la experiencia principal.
          </p>
          <div className="space-y-3">
            {DATA_SOURCES.map(({ name, desc, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/8 hover:border-white/15 transition-all duration-200 group"
              >
                <span className="text-xl flex-shrink-0" aria-hidden>{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{name}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Tecnología */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Tecnología</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map(({ name, desc, category }) => (
              <div key={name} className="p-3 rounded-xl bg-neutral-900/60 border border-white/8 hover:border-white/12 transition-colors">
                <div className="text-xs text-neutral-600 mb-0.5 font-medium uppercase tracking-wider">{category}</div>
                <div className="text-sm font-semibold text-white mb-0.5">{name}</div>
                <div className="text-xs text-neutral-600 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Transparencia */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Transparencia y Datos Abiertos</h2>
          </div>
          <div className="space-y-3 text-sm text-neutral-400 leading-relaxed">
            <p>
              CityFlow nunca presenta datos inventados como reales. Cuando los datos en vivo no están disponibles,
              se etiquetan claramente como <span className="text-sky-400 font-medium">DEMO</span>.
              Cuando los datos son reales y actuales, se muestran como{" "}
              <span className="text-emerald-400 font-medium">EN VIVO</span>.
            </p>
            <p>
              Todas las fuentes de terceros están acreditadas y enlazadas. La plataforma
              depende exclusivamente de conjuntos de datos abiertos sin dependencias comerciales.
            </p>
            <p>
              Sin seguimiento de usuarios, sin analíticas, sin cookies más allá de lo estrictamente necesario.
              Privacidad por diseño.
            </p>
          </div>
        </section>

        {/* Autor */}
        <section className="mb-10">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-white/8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 text-xl font-black text-white">
              EB
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-0.5 uppercase tracking-wider font-semibold">Creado por</p>
              <p className="text-lg font-bold text-white">Eric Batista</p>
              <p className="text-xs text-neutral-500 mt-0.5">Diseño, desarrollo y arquitectura</p>
            </div>
          </div>
        </section>

        {/* Aviso legal */}
        <section className="p-5 rounded-2xl bg-neutral-900/40 border border-white/6 text-xs text-neutral-600 leading-relaxed mb-8">
          <strong className="text-neutral-500 block mb-1">Aviso legal</strong>
          CityFlow es un proyecto experimental. No está afiliado con el Ayuntamiento de Barcelona,
          TMB, Bicing ni ningún operador oficial de la ciudad. La precisión de los datos depende de fuentes de terceros
          y puede no reflejar siempre las condiciones en tiempo real. No utilices esta plataforma para servicios
          de emergencia ni decisiones críticas de seguridad.
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/mapa" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors">
            <Map className="w-4 h-4" />Explorar el mapa
          </Link>
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-semibold text-sm transition-colors">
            Ver Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
