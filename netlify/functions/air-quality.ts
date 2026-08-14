/**
 * Netlify Function: air-quality proxy
 * Proxies requests to Open-Meteo Air Quality API
 */

import type { Context } from "@netlify/functions";

export default async function handler(_req: Request, _ctx: Context) {
  try {
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=41.3851&longitude=2.1734` +
      `&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone` +
      `&timezone=Europe%2FMadrid`;

    const response = await fetch(url, {
      headers: { "User-Agent": "CityFlow/1.0" },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Air quality service unavailable" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal error", message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const config = {
  path: "/api/air-quality",
};
