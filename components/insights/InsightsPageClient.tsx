"use client";

import { ReactQueryProvider } from "@/lib/store/queryProvider";
import { CityInsights } from "@/components/insights/CityInsights";

export function InsightsPageClient() {
  return (
    <ReactQueryProvider>
      <CityInsights />
    </ReactQueryProvider>
  );
}
