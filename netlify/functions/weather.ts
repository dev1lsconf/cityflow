/**
 * Netlify Function: weather proxy
 * Proxies requests to Open-Meteo API
 * Keeps any future API key server-side
 */

import type { Context } from "@netlify/functions";

const BARCELONA_LAT = 41.3851;
const BARCELONA_LNG = 2.1734;

export default async function handler(_req: Request, _ctx: Context) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${BARCELONA_LAT}&longitude=${BARCELONA_LNG}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code` +
      `&timezone=Europe%2FMadrid`;

    const response = await fetch(url, {
      headers: { "User-Agent": "CityFlow/1.0" },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Weather service unavailable", status: response.status }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
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
  path: "/api/weather",
};
