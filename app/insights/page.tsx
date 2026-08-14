import { Lightbulb } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { InsightsPageClient } from "@/components/insights/InsightsPageClient";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">City Insights</h1>
          </div>
          <p className="text-sm text-neutral-500">
            Automatically generated conclusions from available real-time data.
            Insights are only shown when sufficient data is available.
          </p>
        </div>
        <InsightsPageClient />
      </main>
    </div>
  );
}
