/**
 * Netlify Function: bicing proxy
 * Proxies requests to Barcelona Open Data - Bicing API
 * Merges station info and status in one response
 */

import type { Context } from "@netlify/functions";

const BICING_INFO_URL =
  "https://opendata-ajuntament.barcelona.cat/resources/bcn/BicingNou/est_informacio.json";
const BICING_STATUS_URL =
  "https://opendata-ajuntament.barcelona.cat/resources/bcn/BicingNou/est_estat.json";

export default async function handler(_req: Request, _ctx: Context) {
  try {
    const [infoRes, statusRes] = await Promise.allSettled([
      fetch(BICING_INFO_URL, { headers: { "User-Agent": "CityFlow/1.0" } }),
      fetch(BICING_STATUS_URL, { headers: { "User-Agent": "CityFlow/1.0" } }),
    ]);

    if (infoRes.status === "rejected" || statusRes.status === "rejected") {
      return new Response(
        JSON.stringify({ error: "Bicing API unavailable", source: "demo" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const infoResponse = (infoRes as PromiseFulfilledResult<Response>).value;
    const statusResponse = (statusRes as PromiseFulfilledResult<Response>).value;

    if (!infoResponse.ok || !statusResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Bicing API error", source: "demo" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const [infoData, statusData] = await Promise.all([
      infoResponse.json(),
      statusResponse.json(),
    ]);

    return new Response(
      JSON.stringify({ info: infoData, status: statusData }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal error", message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const config = {
  path: "/api/bicing",
};
