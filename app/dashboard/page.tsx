"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, Bike, Car, Thermometer, Wind, Activity, Train, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateTrafficChartData, generateTemperatureChartData,
  generateBicingChartData, generateAirQualityChartData,
} from "@/lib/data/demo";
import { useWeather, useAirQuality, useBicingStations } from "@/lib/hooks/useData";
import { ReactQueryProvider } from "@/lib/store/queryProvider";
import { Navbar } from "@/components/layout/Navbar";

function StatCard({ icon, label, value, unit, trend, trendValue, color = "text-blue-400", isDemo }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string;
  trend?: "up" | "down" | "stable"; trendValue?: string; color?: string; isDemo?: boolean;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-neutral-500";
  return (
    <div className="bg-neutral-900/60 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/8 transition-colors", color)}>
          {icon}
        </div>
        {isDemo && <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium">DEMO</span>}
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="w-3 h-3" />{trendValue}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-neutral-500">{unit}</span>}
        </div>
        <div className="text-xs text-neutral-500 mt-0.5 font-medium uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, isDemo = true }: {
  title: string; subtitle?: string; children: React.ReactNode; isDemo?: boolean;
}) {
  return (
    <div className="bg-neutral-900/60 border border-white/8 rounded-2xl p-5 hover:border-white/12 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {isDemo && <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium flex-shrink-0">DEMO</span>}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean; payload?: Array<{ value: number }>; label?: string; unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{payload[0].value}{unit}</p>
    </div>
  );
}

function DashboardInner() {
  const { data: weatherData, isLoading: weatherLoading } = useWeather();
  const { data: airData, isLoading: airLoading } = useAirQuality();
  const { data: bicingData, isLoading: bicingLoading } = useBicingStations();

  const trafficData = useMemo(() => generateTrafficChartData(), []);
  const tempData = useMemo(() => generateTemperatureChartData(), []);
  const bicingChartData = useMemo(() => generateBicingChartData(), []);
  const aqiData = useMemo(() => generateAirQualityChartData(), []);

  const totalBikes = bicingData?.stations?.reduce((acc, s) => acc + s.availableBikes + s.availableElectricBikes, 0) ?? 0;

  const airLevelEs = () => {
    const map: Record<string, string> = { good: "Buena", fair: "Aceptable", moderate: "Moderada", poor: "Mala", very_poor: "Muy mala" };
    return airData?.level ? (map[airData.level] ?? airData.level) : "—";
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Panel Urbano</h1>
            <span className="text-xs bg-white/8 text-neutral-400 border border-white/10 px-2.5 py-1 rounded-full font-medium">Barcelona</span>
          </div>
          <p className="text-sm text-neutral-500">Inteligencia urbana en tiempo real · Los datos se actualizan automáticamente</p>
        </div>

        {/* Estadísticas */}
        <section aria-label="Métricas clave" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Users className="w-5 h-5" />} label="Población" value="1,6M" color="text-purple-400" trend="stable" trendValue="—" />
          <StatCard icon={<Bike className="w-5 h-5" />} label="Bicis Activas" value={bicingLoading ? "—" : totalBikes} color="text-pink-400" trend="up" trendValue="+12%" isDemo={bicingData?.status === "demo"} />
          <StatCard icon={<Car className="w-5 h-5" />} label="Tráfico" value="Normal" color="text-amber-400" trend="down" trendValue="-8%" isDemo />
          <StatCard icon={<Thermometer className="w-5 h-5" />} label="Temperatura" value={weatherLoading ? "—" : `${weatherData?.temperature ?? "—"}°C`} color="text-orange-400" trend="up" trendValue="+2°" isDemo={weatherData?.status === "demo"} />
          <StatCard icon={<Wind className="w-5 h-5" />} label="Calidad Aire" value={airLoading ? "—" : airLevelEs()} color="text-emerald-400" trend="stable" trendValue="ICA 42" isDemo={airData?.status === "demo"} />
        </section>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Actividad del Tráfico" subtitle="Densidad vehicular · Últimas 24 horas">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trafficData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#trafficGrad)" dot={false} activeDot={{ r: 4, fill: "#f59e0b" }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Temperatura" subtitle="°C · Últimas 24 horas" isDemo={weatherData?.status === "demo"}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit="°C" />} />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#f97316" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Disponibilidad Bicing" subtitle="Bicis disponibles · Últimas 24 horas" isDemo={bicingData?.status === "demo"}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={bicingChartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="bicingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit=" bicis" />} />
                <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} fill="url(#bicingGrad)" dot={false} activeDot={{ r: 4, fill: "#ec4899" }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Índice de Calidad del Aire" subtitle="ICA Europeo · Últimas 24 horas" isDemo={airData?.status === "demo"}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aqiData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: "#525252", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit=" ICA" />} />
                <Bar dataKey="value" fill="#22c55e" radius={[2, 2, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Estado metro */}
        <section className="bg-neutral-900/60 border border-white/8 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-white">Estado del Metro</h3>
            </div>
            <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium">DEMO</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {[
              { id: "L1", color: "#d52b1e", ok: true }, { id: "L2", color: "#9b4f96", ok: true },
              { id: "L3", color: "#007b53", ok: true }, { id: "L4", color: "#f9a51b", ok: false },
              { id: "L5", color: "#1d4fa2", ok: true }, { id: "L9N", color: "#f7941d", ok: true },
              { id: "L9S", color: "#f7941d", ok: true }, { id: "L10N", color: "#00a0df", ok: true },
              { id: "L11", color: "#8dc641", ok: true },
            ].map((line) => (
              <div key={line.id} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/4 hover:bg-white/7 transition-colors">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: line.color }}>{line.id}</span>
                <span className={cn("text-xs font-medium", line.ok ? "text-emerald-400" : "text-amber-400")}>{line.ok ? "OK" : "Lento"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detalles meteorológicos */}
        {weatherData && (
          <section className="bg-neutral-900/60 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Detalles Meteorológicos</h3>
              {weatherData.status === "demo" && <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full font-medium">DEMO</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Sensación térmica", value: `${weatherData.feelsLike}°C`, icon: "🌡" },
                { label: "Humedad", value: `${weatherData.humidity}%`, icon: "💧" },
                { label: "Velocidad del viento", value: `${weatherData.windSpeed} km/h`, icon: "🌬" },
                { label: "Precipitación", value: `${weatherData.precipitation} mm`, icon: "🌧" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/4">
                  <span className="text-xl" aria-hidden>{icon}</span>
                  <div>
                    <div className="text-xs text-neutral-500">{label}</div>
                    <div className="text-sm font-semibold text-white">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <ReactQueryProvider><DashboardInner /></ReactQueryProvider>;
}
