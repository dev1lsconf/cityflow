# CityFlow — Barcelona Urban Intelligence Platform

**Hecho por [Eric Batista](https://github.com/dev1lsconf)**

**Explora Barcelona a través de datos de movilidad, clima, transporte e inteligencia urbana en tiempo real.**

> Plataforma experimental de Smart City construida con Next.js, MapLibre GL JS y fuentes de datos abiertos.

🔗 **Repositorio:** [github.com/dev1lsconf/cityflow](https://github.com/dev1lsconf/cityflow)
🌐 **Demo en vivo:** [cityflow-barcelona.netlify.app](https://cityflow-barcelona.netlify.app)

---

## Índice

1. [Descripción](#descripción)
2. [Demo](#demo)
3. [Características](#características)
4. [Stack tecnológico](#stack-tecnológico)
5. [Fuentes de datos](#fuentes-de-datos)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Instalación y desarrollo local](#instalación-y-desarrollo-local)
8. [Variables de entorno](#variables-de-entorno)
9. [Páginas y rutas](#páginas-y-rutas)
10. [Componentes principales](#componentes-principales)
11. [Netlify Functions](#netlify-functions)
12. [Despliegue en Netlify](#despliegue-en-netlify)
13. [Estilos del mapa](#estilos-del-mapa)
14. [Sistema de estados de datos](#sistema-de-estados-de-datos)
15. [Modo Demo](#modo-demo)
16. [Accesibilidad](#accesibilidad)
17. [Decisiones de arquitectura](#decisiones-de-arquitectura)
18. [Disclaimer](#disclaimer)

---

## Descripción

CityFlow es un dashboard de inteligencia urbana para Barcelona que combina datos de movilidad, meteorología y calidad del aire en una interfaz interactiva y en tiempo real.

La plataforma está diseñada para sentirse como un producto real de Smart City: mapa como elemento principal, datos actualizados automáticamente, capas activables, búsqueda geocodificada y análisis generados a partir de los datos disponibles.

**Principios de diseño:**
- El mapa es el elemento dominante de la interfaz
- Los datos nunca se presentan como reales si no lo son (siempre etiquetados `LIVE`, `DEMO` o `CACHED`)
- La aplicación nunca se rompe si una API externa falla — siempre hay fallback
- Dark UI elegante y profesional, sin excesos visuales
- Mobile-first y completamente responsive

---

## Demo

La aplicación funciona completamente **sin ninguna API key**. Todas las fuentes principales son gratuitas y públicas:

- Clima y calidad del aire → Open-Meteo (sin clave)
- Bicing → Barcelona Open Data (sin clave)
- Geocoding/búsqueda → Nominatim / OpenStreetMap (sin clave)
- Mapa base → OpenFreeMap (sin clave)

---

## Características

### Mapa interactivo
- MapLibre GL JS con estilo oscuro elegante
- 14 capas de datos activables/desactivables
- Clustering de marcadores para places
- Fly-to animado al seleccionar resultados de búsqueda
- Controles de zoom, geolocalización, escala, orientación
- Panel de capas colapsable (desktop) / drawer (móvil)

### Capas de datos
| Categoría | Capas |
|---|---|
| **Movilidad** | 🚇 Metro · 🚌 Bus · 🚲 Bicing · 🚗 Traffic · 🅿 Parking |
| **Ciudad** | 🏛 Places · 🎭 Events · 🏥 Hospitals · 🏫 Education · 🌳 Parks |
| **Entorno** | 🌡 Temperature · 🌧 Rain · 🌬 Wind · 🌫 Air Quality |

### Live Data Bar
- Temperatura actual (Open-Meteo, actualización cada 15 min)
- Descripción del tiempo
- Estado del tráfico
- Estado del metro (todas las líneas L1–L11)
- Total de bicis disponibles (Bicing, actualización cada 5 min)
- Calidad del aire / AQI (Open-Meteo, actualización cada 30 min)
- Humedad y velocidad del viento
- Timestamp de última actualización
- Indicador de conexión LIVE / DEMO

### Buscador
- Geocodificación en tiempo real vía Nominatim/OSM
- Debounce de 350ms
- Sugerencias predefinidas al abrir (lugares populares de Barcelona)
- Navegación por teclado (↑ ↓ Enter Escape)
- Fly-to animado al seleccionar resultado
- Abre el panel de información si el lugar está en la base de datos

### Panel de información
- Se abre al hacer click en cualquier elemento del mapa
- Desktop: panel lateral deslizante (derecha)
- Móvil: bottom sheet con handle de arrastre
- Muestra: categoría, descripción, dirección, horarios, tags, temperatura local
- Nearby transit: estaciones de metro y Bicing más cercanas con distancia
- Enlace a Google Maps para navegación
- Enlace a web oficial si está disponible
- Se cierra con Escape o click fuera

### Dashboard `/dashboard`
- 5 stat cards: población, bicis activas, tráfico, temperatura, calidad del aire
- 4 gráficas Recharts:
  - **Traffic Activity** (área) — densidad de tráfico últimas 24h
  - **Temperature** (línea) — temperatura últimas 24h
  - **Bike Availability** (área) — bicis disponibles últimas 24h
  - **Air Quality Index** (barras) — AQI últimas 24h
- Estado de todas las líneas de metro (L1 a L11)
- Panel de detalles del tiempo (sensación, humedad, viento, precipitación)
- Tooltips personalizados en todas las gráficas

### Explorer `/explore`
- 12 lugares icónicos de Barcelona
- Filtro por 7 categorías: Food, Culture, Nature, Architecture, Nightlife, Shopping, Sports
- Buscador por texto (nombre, descripción, tags)
- Tarjetas con color header por categoría, tags, horarios, enlace al mapa
- CTA para abrir en el mapa interactivo

### City Insights `/insights`
- Conclusiones generadas automáticamente a partir de los datos disponibles
- Basadas en temperatura real, calidad del aire real, disponibilidad de Bicing
- Si los datos son insuficientes: "Not enough live data to generate this insight"
- Nunca presenta afirmaciones como reales si los datos no lo son
- Nivel de confianza: High / Medium / Low
- Badges DEMO / LIVE por insight

---

## Stack tecnológico

### Frontend
| Paquete | Versión | Uso |
|---|---|---|
| `next` | 16.3.1 | Framework (App Router, React Server Components) |
| `react` | 19.2.8 | UI library |
| `typescript` | ^5 | Tipado estricto |
| `tailwindcss` | ^4 | Estilos utility-first |
| `maplibre-gl` | ^4.7.1 | Mapa WebGL interactivo |
| `recharts` | ^2.15.4 | Gráficas y visualización de datos |
| `lucide-react` | ^0.468.0 | Sistema de iconos |
| `zustand` | ^5.0.15 | Estado global (capas, mapa, UI) |
| `@tanstack/react-query` | ^5.101.4 | Server state, caching, refetch automático |
| `clsx` + `tailwind-merge` | ^2 | Utilidades de className |
| `date-fns` | ^4.4.0 | Formateo de fechas |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes |

### Radix UI (headless components)
| Paquete | Uso |
|---|---|
| `@radix-ui/react-dialog` | Modales accesibles |
| `@radix-ui/react-switch` | Toggles de capas |
| `@radix-ui/react-tooltip` | Tooltips |
| `@radix-ui/react-scroll-area` | Scroll personalizado |
| `@radix-ui/react-separator` | Separadores |
| `@radix-ui/react-slot` | Composición de componentes |

### Backend / Deploy
| Paquete | Versión | Uso |
|---|---|---|
| `@netlify/plugin-nextjs` | ^5.15.13 | Adapter para Next.js en Netlify |
| `@netlify/functions` | ^2.8.2 | Tipos para Netlify Functions |

---

## Fuentes de datos

Todas las fuentes son **públicas, gratuitas y sin API key** salvo MapTiler (opcional).

| Fuente | Datos | Auth | Refresh |
|---|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Temperatura, sensación térmica, humedad, viento, precipitación, código meteorológico | ❌ No requiere | 15 min |
| [Open-Meteo Air Quality](https://air-quality-api.open-meteo.com) | AQI europeo, PM10, PM2.5, NO₂, O₃ | ❌ No requiere | 30 min |
| [Barcelona Open Data — Bicing](https://opendata-ajuntament.barcelona.cat/resources/bcn/BicingNou/) | Estado e información de estaciones Bicing (mecánicas y eléctricas) | ❌ No requiere | 5 min |
| [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org) | Geocodificación de búsqueda, reverse geocoding | ❌ No requiere | On demand |
| [OpenFreeMap](https://openfreemap.org) | Tiles de mapa base (estilo liberty/bright) | ❌ No requiere | Static |
| [MapTiler Cloud](https://cloud.maptiler.com) | Estilos premium: dark, light, satellite, streets | ✅ API key gratuita (100k req/mes) | Static |

### Datos en modo demo
Cuando una API no responde, se usan datos de `lib/data/demo.ts`:
- 10 estaciones de metro con coordenadas reales
- 8 estaciones Bicing con coordenadas reales
- 12 lugares icónicos de Barcelona con coordenadas reales
- Líneas de metro L1–L11 con colores oficiales
- Datos meteorológicos representativos de Barcelona

Todos los datos demo se marcan visualmente con el badge `DEMO`.

---

## Estructura del proyecto

```
cityflow/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fuentes, metadata SEO, viewport
│   ├── globals.css               # Estilos globales, overrides MapLibre GL, scrollbars
│   ├── page.tsx                  # Landing page (/)
│   ├── sitemap.ts                # Generación automática de sitemap.xml
│   ├── robots.ts                 # robots.txt
│   ├── map/
│   │   └── page.tsx              # Página del mapa interactivo (/map)
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard de estadísticas (/dashboard)
│   ├── explore/
│   │   └── page.tsx              # Explorador de lugares (/explore)
│   ├── insights/
│   │   └── page.tsx              # City Insights (/insights)
│   └── about/
│       └── page.tsx              # Sobre el proyecto (/about)
│
├── components/
│   ├── map/
│   │   ├── MapView.tsx           # Mapa principal (MapLibre GL JS, dinámico, no SSR)
│   │   ├── LayerPanel.tsx        # Panel lateral de capas con toggles
│   │   ├── LiveDataBar.tsx       # Barra inferior de datos en tiempo real
│   │   ├── SearchBar.tsx         # Buscador con geocodificación Nominatim
│   │   ├── InfoPanel.tsx         # Panel de detalle (side panel / bottom sheet)
│   │   └── MapControls.tsx       # Controles fullscreen y cambio de estilo
│   ├── layout/
│   │   └── Navbar.tsx            # Barra de navegación principal
│   └── insights/
│       ├── CityInsights.tsx      # Componente de tarjetas de insights
│       └── InsightsPageClient.tsx# Wrapper client con ReactQueryProvider
│
├── lib/
│   ├── api/
│   │   ├── city.ts               # fetchWeather(), fetchAirQuality(), fetchBicingStations()
│   │   └── geocoding.ts          # geocodeSearch(), reverseGeocode() via Nominatim
│   ├── data/
│   │   └── demo.ts               # Datos demo: metro, bicing, places, weather, insights
│   ├── hooks/
│   │   └── useData.ts            # useWeather(), useAirQuality(), useBicingStations(), useLiveData()
│   ├── store/
│   │   ├── appStore.ts           # Zustand store: mapa, capas, features, UI, live data
│   │   └── queryProvider.tsx     # ReactQueryProvider con configuración de cache
│   └── utils/
│       └── index.ts              # cn(), formatNumber(), formatTime(), debounce(), haversineDistance()...
│
├── netlify/
│   └── functions/
│       ├── weather.ts            # GET /api/weather → proxy a Open-Meteo
│       ├── air-quality.ts        # GET /api/air-quality → proxy a Open-Meteo AQ
│       └── bicing.ts             # GET /api/bicing → proxy a Barcelona Open Data
│
├── types/
│   └── index.ts                  # Todos los tipos TypeScript del proyecto
│
├── public/
│   ├── icon.svg                  # Favicon SVG
│   └── site.webmanifest          # Web App Manifest (PWA)
│
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore                    # .env.local y .next excluidos
├── netlify.toml                  # Configuración de Netlify
├── next.config.ts                # Configuración de Next.js
├── tsconfig.json                 # TypeScript config (strict mode)
└── package.json                  # Dependencias y scripts
```

---

## Instalación y desarrollo local

### Requisitos

- **Node.js** 20 o superior
- **npm** 10 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/dev1lsconf/cityflow.git
cd cityflow

# 2. Instalar dependencias
npm install

# 3. Crear archivo de variables de entorno
cp .env.example .env.local
# El archivo viene vacío — la app funciona sin ninguna variable definida

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con Turbopack (hot reload)
npm run build    # Build de producción
npm run start    # Sirve el build de producción localmente
npm run lint     # ESLint
npx tsc --noEmit # Comprobación de tipos TypeScript
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto (nunca lo subas a git — ya está en `.gitignore`).

### Variables públicas (`NEXT_PUBLIC_*`)

Estas variables se exponen al navegador. **No incluyas secretos aquí.**

```env
# URL base de la aplicación (para SEO y Open Graph)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API key de MapTiler para estilos de mapa premium (opcional)
# Obtén una clave gratuita en https://cloud.maptiler.com
# Sin esta clave, el mapa usa OpenFreeMap (gratuito, sin clave)
NEXT_PUBLIC_MAPTILER_API_KEY=

# Forzar modo demo aunque las APIs estén disponibles (true/false)
NEXT_PUBLIC_DEMO_MODE=false
```

### Variables privadas (solo servidor)

Estas variables NUNCA se exponen al cliente. Se usan en Netlify Functions.

```env
# Token de Barcelona Open Data (opcional — aumenta el rate limit)
BARCELONA_DATA_TOKEN=
```

### En producción (Netlify)

Ve a **Site settings → Environment variables** y añade:

```
NEXT_PUBLIC_APP_URL         = https://tu-sitio.netlify.app
NEXT_PUBLIC_MAPTILER_API_KEY = (opcional)
```

---

## Páginas y rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Static | Landing page con hero, features y CTAs |
| `/map` | Static + Client | Mapa interactivo completo |
| `/dashboard` | Static + Client | Dashboard con gráficas y estadísticas |
| `/explore` | Static + Client | Explorador de lugares por categoría |
| `/insights` | Static + Client | City Insights generados de datos reales |
| `/about` | Static | Sobre el proyecto, fuentes y tecnología |
| `/sitemap.xml` | Generated | Sitemap automático |
| `/robots.txt` | Generated | Robots.txt |
| `/api/weather` | Function | Proxy → Open-Meteo weather |
| `/api/air-quality` | Function | Proxy → Open-Meteo air quality |
| `/api/bicing` | Function | Proxy → Barcelona Open Data Bicing |

---

## Componentes principales

### `MapView.tsx`
El mapa MapLibre GL JS. Se importa con `dynamic()` sin SSR para evitar errores de window.

- Inicializa el mapa centrado en Barcelona (41.3851, 2.1734) con zoom 13 y pitch 30°
- Añade controles nativos: NavigationControl, GeolocateControl, ScaleControl, AttributionControl
- Registra 3 fuentes GeoJSON: `places-source` (con clustering), `metro-source`, `bicing-source`
- Actualiza la capa bicing cuando llegan datos reales de la API
- Maneja clicks en features para abrir el InfoPanel
- Escucha cambios de capas del store Zustand y actualiza visibilidad (`setLayoutProperty`)
- Expone `window.__cityflowMapRef` para que SearchBar pueda llamar `flyTo`

### `LayerPanel.tsx`
Panel de 14 capas organizadas en 3 categorías colapsables.

- Toggle switch animado por capa con color propio
- Contador de capas activas en el header
- En desktop: sidebar fijo de 224px, colapsable
- En móvil: drawer desde la izquierda con backdrop

### `LiveDataBar.tsx`
Barra inferior que muestra datos en tiempo real.

- Usa `useLiveData()` que orquesta `useWeather()`, `useAirQuality()`, `useBicingStations()`
- Indicador LIVE (verde animado) / DEMO (azul) según el origen de los datos
- Skeleton loading mientras cargan los datos
- Scroll horizontal en móvil con `scrollbar-none`

### `SearchBar.tsx`
Buscador con geocodificación Nominatim.

- Debounce de 350ms antes de llamar a la API
- Caché en memoria con expiración de 10 minutos
- Sugerencias predefinidas al abrir sin texto (4 lugares populares)
- Limita la búsqueda al bounding box de Barcelona
- Navegación por teclado completa (↑ ↓ Enter Escape)
- Al seleccionar: llama `map.flyTo()` vía `window.__cityflowMapRef`

### `InfoPanel.tsx`
Panel de detalle de un elemento seleccionado.

- Desktop: panel deslizante desde la derecha (320px/384px)
- Móvil: bottom sheet con handle, animación hacia arriba
- Calcula distancia haversine a estaciones metro y Bicing cercanas
- Se cierra con tecla Escape o click fuera (móvil)
- Animado con CSS transitions `translate-x` / `translate-y`

### `appStore.ts` (Zustand)
Estado global de la aplicación.

```typescript
mapState          // center, zoom, bearing, pitch, style
layers            // Array de 14 capas con enabled, loading, error
selectedFeature   // Elemento seleccionado en el mapa
searchQuery       // Query actual del buscador
searchResults     // Resultados de búsqueda
liveData          // weather, airQuality, bicing, traffic, metro
isLayerPanelOpen  // Estado del panel de capas (desktop)
isMobileDrawerOpen // Estado del drawer (móvil)
isDemoMode        // Forzar modo demo
```

---

## Netlify Functions

Tres funciones serverless actúan como proxies de API. Sirven para:
1. Mantener futuras API keys privadas en el servidor
2. Añadir headers de caché apropiados
3. Manejar errores de forma uniforme

### `GET /api/weather`
```
Fuente:  https://api.open-meteo.com/v1/forecast
Cache:   s-maxage=900 (15 min)
Datos:   temperatura, sensación, humedad, viento, precipitación, código WMO
```

### `GET /api/air-quality`
```
Fuente:  https://air-quality-api.open-meteo.com/v1/air-quality
Cache:   s-maxage=1800 (30 min)
Datos:   European AQI, PM10, PM2.5, NO₂, O₃
```

### `GET /api/bicing`
```
Fuente:  opendata-ajuntament.barcelona.cat (est_informacio + est_estat)
Cache:   s-maxage=300 (5 min)
Datos:   Posición, nombre, capacidad, bicis mecánicas/eléctricas disponibles, docks libres
```

En desarrollo local, las APIs se llaman directamente desde `lib/api/city.ts` sin pasar por las funciones.

---

## Despliegue en Netlify

### Opción 1 — Deploy desde GitHub (recomendado)

1. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Elige **GitHub** y selecciona el repositorio `cityflow`
3. Netlify detecta automáticamente el `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20
4. Haz clic en **Deploy site**
5. (Opcional) Añade variables de entorno en **Site settings → Environment variables**

### Opción 2 — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init       # Vincula el sitio
netlify deploy --prod
```

### Variables de entorno en producción

| Variable | Valor | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://tu-sitio.netlify.app` | Recomendada |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | Tu clave de MapTiler | Opcional |
| `BARCELONA_DATA_TOKEN` | Token Barcelona Open Data | Opcional |

### Configuración `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"   # Adapter oficial de Next.js

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"             # Bundler rápido para las Functions
```

---

## Estilos del mapa

### Sin API key (por defecto)
Usa [OpenFreeMap](https://openfreemap.org) — gratuito, sin clave, basado en OpenStreetMap.

```
Estilo dark:      https://tiles.openfreemap.org/styles/liberty
Estilo light:     https://tiles.openfreemap.org/styles/bright
```

### Con API key de MapTiler (opcional)
Estilos premium con mejor modo oscuro. Tier gratuito: **100.000 requests/mes**.

Obtén tu clave en [cloud.maptiler.com](https://cloud.maptiler.com) y configura:

```env
NEXT_PUBLIC_MAPTILER_API_KEY=tu_clave_aqui
```

| Estilo | URL MapTiler |
|---|---|
| Dark | `maps/dataviz-dark/style.json` |
| Light | `maps/dataviz/style.json` |
| Satellite | `maps/satellite/style.json` |
| Streets | `maps/streets-v2/style.json` |

El cambio de estilo se gestiona en `lib/utils/index.ts → getMapStyleUrl()`.

---

## Sistema de estados de datos

CityFlow nunca muestra datos sin identificar su origen. Cada dato lleva siempre uno de estos estados:

| Estado | Badge | Color | Significado |
|---|---|---|---|
| `live` | `LIVE` 🟢 | Verde animado | Obtenido de la API en tiempo real |
| `cached` | `CACHED` 🟡 | Ámbar | Respuesta cacheada reciente |
| `demo` | `DEMO` 🔵 | Azul | Datos de fallback, no son reales |
| `loading` | — | Gris animado | Petición en curso (skeleton) |
| `error` | `ERROR` 🔴 | Rojo | API falló, mostrando último dato conocido |
| `offline` | `OFFLINE` ⚫ | Gris | Sin conexión |

Los estados se calculan en `lib/api/city.ts` y se propagan a través del Zustand store.

---

## Modo Demo

La aplicación entra en modo demo automáticamente cuando una API no responde. También se puede forzar:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

En modo demo:
- La barra de datos muestra el badge `DEMO` en azul
- Todas las gráficas del dashboard usan datos generados en cliente
- Los insights muestran `DEMO` en cada tarjeta
- El mapa funciona completamente con datos estáticos de `lib/data/demo.ts`

El objetivo es que la demo en Netlify **nunca quede en blanco** aunque todas las APIs externas fallen.

---

## Accesibilidad

- Navegación completa por teclado (Tab, Escape, Enter, flechas en search)
- `aria-label` en todos los botones y controles interactivos
- `aria-pressed` en toggles de capas
- `aria-expanded` en menú móvil y grupos de capas
- `role="combobox"` y `role="option"` en el buscador
- `role="complementary"` en el panel de información
- `role="region"` y `role="application"` en el mapa
- HTML semántico: `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>`, `<header>`
- Estados focus-visible con outline azul (#3b82f6)
- `prefers-reduced-motion`: todas las animaciones se desactivan
- Contraste de texto ≥ 4.5:1 en elementos de texto principal

---

## Decisiones de arquitectura

**¿Por qué MapLibre GL JS y no Mapbox?**
MapLibre es un fork open-source de Mapbox GL JS. Sin licencia comercial, sin API key obligatoria para el propio motor del mapa.

**¿Por qué Zustand y no Context API?**
Zustand ofrece subscripciones selectivas que evitan re-renders innecesarios. Con Context API, cualquier cambio en el estado del mapa re-renderizaría todos los componentes suscritos.

**¿Por qué React Query y no SWR?**
TanStack Query ofrece mejor control sobre `staleTime`, `gcTime`, `refetchInterval` y manejo de errores. Esencial para datos con diferentes frecuencias de actualización (5 min bicing, 15 min weather, 30 min AQI).

**¿Por qué `output: "standalone"` en next.config?**
Necesario para que `@netlify/plugin-nextjs` genere el bundle correcto. Sin esto, las rutas de API y las Server Actions no funcionan en Netlify.

**¿Por qué `dynamic(() => import(...), { ssr: false })` en MapView?**
MapLibre GL JS accede a `window` y `document` en la inicialización. Si se renderiza en el servidor (SSR), Next.js lanza `ReferenceError: window is not defined`. El import dinámico con `ssr: false` garantiza que el mapa solo se instancia en el cliente.

**¿Por qué no Firebase/Supabase?**
La aplicación no requiere autenticación ni datos persistentes de usuario en esta versión. Añadir una base de datos para datos que ya existen en APIs públicas sería over-engineering. La persistencia queda preparada en la arquitectura para añadirse cuando sea necesario.

---

## Disclaimer

CityFlow es un proyecto experimental. No está afiliado con el Ayuntamiento de Barcelona, TMB, Bicing, ni ningún organismo oficial. La precisión de los datos depende de fuentes de terceros y puede no reflejar siempre las condiciones en tiempo real. No utilices esta plataforma para servicios de emergencia ni decisiones críticas de seguridad.

---

## Autor

**Eric Batista**
Diseño, desarrollo y arquitectura de CityFlow.

🔗 [github.com/dev1lsconf](https://github.com/dev1lsconf)

---

## Licencia

MIT — libre para uso personal y comercial.
