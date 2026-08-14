# CityFlow — Barcelona Urban Intelligence Platform

> Explore Barcelona through real-time mobility, weather, transport and urban intelligence.

CityFlow is a full-stack Next.js application that visualizes Barcelona's urban data in real time through an interactive map and multiple data panels.

---

## Features

- **Interactive map** — MapLibre GL JS with 14 data layers (metro, bicing, places, traffic, weather, air quality…)
- **Live data** — Real-time weather (Open-Meteo), air quality, Bicing bike availability
- **Geocoding search** — Search any place in Barcelona via Nominatim/OSM
- **Info panel** — Click any map feature to see details, nearby transit, weather
- **Dashboard** — Stats cards + 4 Recharts graphs (traffic, temperature, bikes, AQI)
- **Explore** — Browse 12+ Barcelona landmarks by category
- **City Insights** — Auto-generated conclusions from live data
- **Demo mode** — Always visible even when APIs are unavailable; data labelled `DEMO` vs `LIVE`
- **Responsive** — Mobile-first, works from 320px to ultrawide
- **Netlify-ready** — Functions as API proxies, zero configuration deploy

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Map | MapLibre GL JS |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand |
| Data fetching | TanStack React Query |
| Hosting | Netlify + @netlify/plugin-nextjs |

---

## Data Sources

All data is open and free — no paid APIs required.

| Source | Data | API Key |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Weather, air quality | Not required |
| [Barcelona Open Data](https://opendata-ajuntament.barcelona.cat) | Bicing stations | Not required |
| [Nominatim / OSM](https://nominatim.openstreetmap.org) | Geocoding, search | Not required |
| [OpenFreeMap](https://openfreemap.org) | Map tiles | Not required |
| [MapTiler](https://cloud.maptiler.com) | Premium map styles | Optional |

---

## Installation

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone https://github.com/your-username/cityflow.git
cd cityflow

npm install

cp .env.example .env.local
# Edit .env.local if needed (all defaults work without any API key)

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` in the project root. All variables are optional — the app runs fully in demo mode without any keys.

```env
# Optional: MapTiler API key for premium map styles
# Get a free key at https://cloud.maptiler.com
NEXT_PUBLIC_MAPTILER_API_KEY=

# App URL (used for SEO and OG metadata)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Force demo mode (true/false)
NEXT_PUBLIC_DEMO_MODE=false
```

**Private variables** (never exposed to the browser):

```env
# Optional: Barcelona Open Data token for higher rate limits
BARCELONA_DATA_TOKEN=
```

> ⚠️ Never commit `.env.local` to version control.

---

## Development

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Serve production build locally
npm start
```

---

## Project Structure

```
cityflow/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing page (/)
│   ├── map/page.tsx          # Interactive map (/map)
│   ├── dashboard/page.tsx    # Data dashboard (/dashboard)
│   ├── explore/page.tsx      # Place explorer (/explore)
│   ├── insights/page.tsx     # City insights (/insights)
│   ├── about/page.tsx        # About (/about)
│   ├── layout.tsx            # Root layout + SEO metadata
│   ├── globals.css           # Global styles + MapLibre overrides
│   ├── sitemap.ts            # Auto-generated sitemap
│   └── robots.ts             # robots.txt
│
├── components/
│   ├── map/
│   │   ├── MapView.tsx       # MapLibre GL JS map
│   │   ├── LayerPanel.tsx    # Layer toggle sidebar
│   │   ├── LiveDataBar.tsx   # Bottom live data strip
│   │   ├── SearchBar.tsx     # Geocoding search
│   │   ├── InfoPanel.tsx     # Feature detail panel
│   │   └── MapControls.tsx   # Fullscreen / style switcher
│   ├── layout/
│   │   └── Navbar.tsx        # Top navigation bar
│   └── insights/
│       ├── CityInsights.tsx  # Insight cards component
│       └── InsightsPageClient.tsx
│
├── lib/
│   ├── api/
│   │   ├── city.ts           # Weather, air quality, bicing APIs
│   │   └── geocoding.ts      # Nominatim geocoding
│   ├── data/
│   │   └── demo.ts           # Demo/fallback data
│   ├── hooks/
│   │   └── useData.ts        # React Query data hooks
│   ├── store/
│   │   ├── appStore.ts       # Zustand global state
│   │   └── queryProvider.tsx # React Query provider
│   └── utils/
│       └── index.ts          # cn(), formatters, helpers
│
├── netlify/
│   └── functions/
│       ├── weather.ts        # /api/weather proxy
│       ├── air-quality.ts    # /api/air-quality proxy
│       └── bicing.ts         # /api/bicing proxy
│
├── types/
│   └── index.ts              # All TypeScript types
│
├── public/
│   ├── icon.svg
│   └── site.webmanifest
│
├── .env.example
├── netlify.toml
└── next.config.ts
```

---

## Netlify Functions

Three serverless functions act as API proxies. They keep any future private API keys server-side and add proper caching headers.

| Function | Path | Source | Cache |
|---|---|---|---|
| `weather.ts` | `/api/weather` | Open-Meteo | 15 min |
| `air-quality.ts` | `/api/air-quality` | Open-Meteo AQ | 30 min |
| `bicing.ts` | `/api/bicing` | Barcelona Open Data | 5 min |

---

## Deploy to Netlify

### Option 1 — Git-based deploy (recommended)

1. Push the repo to GitHub/GitLab
2. Create a new site in [Netlify](https://app.netlify.com)
3. Connect your repository
4. Netlify auto-detects `netlify.toml` — no manual config needed
5. Add optional environment variables in **Site settings → Environment variables**
6. Click **Deploy**

### Option 2 — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Environment variables in Netlify

Go to **Site settings → Environment variables** and add:

```
NEXT_PUBLIC_APP_URL     = https://your-site.netlify.app
NEXT_PUBLIC_MAPTILER_API_KEY = (optional)
```

---

## Map Styles

By default, CityFlow uses [OpenFreeMap](https://openfreemap.org) tiles (free, no key).

For premium styles with better dark mode, get a free key at [MapTiler Cloud](https://cloud.maptiler.com) (free tier: 100k requests/month) and set `NEXT_PUBLIC_MAPTILER_API_KEY`.

---

## Data Status Labels

The app always shows the source status of each data point:

| Label | Meaning |
|---|---|
| `LIVE` | Fetched from a real API successfully |
| `CACHED` | Using a recent cached response |
| `DEMO` | Fallback data when API is unavailable |
| `LOADING` | Fetching in progress |
| `ERROR` | API failed, showing last known data |

---

## Accessibility

- Keyboard navigation throughout
- `aria-label`, `aria-pressed`, `aria-expanded`, `role` attributes
- Focus-visible styles
- `prefers-reduced-motion` respected
- Semantic HTML (`nav`, `main`, `aside`, `footer`, `section`)
- Colour contrast meets WCAG AA for text

---

## License

MIT — use freely for personal or commercial projects.

---

## Disclaimer

CityFlow is an experimental platform. Not affiliated with Barcelona City Council, TMB, or Bicing. Data accuracy depends on third-party sources.
