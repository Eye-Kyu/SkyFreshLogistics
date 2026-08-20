"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Package, Plane, Ship } from "lucide-react";

const origins = ["Nairobi (NBO)", "Naivasha", "Mombasa (MBA)"]; // [P] confirm origin hubs

const destinations = [
  "Amsterdam, Netherlands",
  "London, United Kingdom",
  "Dubai, UAE",
  "Doha, Qatar",
  "Tokyo, Japan",
  "Moscow, Russia",
];

const modes = ["Air Freight", "Sea Freight", "Mixed Consolidation"] as const;
type Mode = (typeof modes)[number];

const modeIcons: Record<Mode, typeof Plane> = {
  "Air Freight": Plane,
  "Sea Freight": Ship,
  "Mixed Consolidation": Package,
};

// [P] Estimates are illustrative — replace with real route data from operations.
const transitTable: Record<string, Record<Mode, string>> = {
  "Amsterdam, Netherlands": { "Air Freight": "24–48 hours", "Sea Freight": "18–22 days", "Mixed Consolidation": "3–5 days" },
  "London, United Kingdom": { "Air Freight": "24–48 hours", "Sea Freight": "20–24 days", "Mixed Consolidation": "3–5 days" },
  "Dubai, UAE": { "Air Freight": "12–24 hours", "Sea Freight": "12–16 days", "Mixed Consolidation": "2–4 days" },
  "Doha, Qatar": { "Air Freight": "12–24 hours", "Sea Freight": "13–17 days", "Mixed Consolidation": "2–4 days" },
  "Tokyo, Japan": { "Air Freight": "36–60 hours", "Sea Freight": "28–35 days", "Mixed Consolidation": "5–7 days" },
  "Moscow, Russia": { "Air Freight": "24–48 hours", "Sea Freight": "N/A — air/mixed only", "Mixed Consolidation": "4–6 days" },
};

export function TransitCalculator() {
  const [origin, setOrigin] = useState(origins[0]);
  const [destination, setDestination] = useState(destinations[0]);
  const [mode, setMode] = useState<Mode>("Air Freight");

  const estimate = useMemo(() => transitTable[destination]?.[mode] ?? "Contact us for an estimate", [destination, mode]);
  const ModeIcon = modeIcons[mode];

  return (
    <div className="border border-brand-slate-200 bg-white">
      <div className="border-b border-brand-slate-200 bg-brand-slate-50 px-6 py-5 sm:px-8">
        <h3 className="font-display text-lg font-semibold text-brand-slate-900">Estimate Your Transit Time</h3>
        <p className="mt-1 text-sm text-brand-slate-600">
          Select your route and shipping mode for an indicative transit estimate.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-slate-700">Origin</span>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="border border-brand-slate-300 bg-white px-3 py-2.5 text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
            >
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-slate-700">Destination</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border border-brand-slate-300 bg-white px-3 py-2.5 text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-slate-700">Shipping Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="border border-brand-slate-300 bg-white px-3 py-2.5 text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
            >
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Route readout — boarding-pass style */}
        <div className="mt-6 flex flex-col gap-5 border border-brand-green-700/20 bg-brand-green-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-center">
              <div className="font-display text-sm font-semibold text-brand-slate-900 sm:text-base">{origin}</div>
              <div className="text-[0.65rem] uppercase tracking-wide text-brand-slate-500">Origin</div>
            </div>
            <div className="flex flex-col items-center gap-1 text-brand-green-700">
              <ModeIcon aria-hidden="true" className="h-4 w-4" />
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="text-center">
              <div className="font-display text-sm font-semibold text-brand-slate-900 sm:text-base">{destination}</div>
              <div className="text-[0.65rem] uppercase tracking-wide text-brand-slate-500">Destination</div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-brand-green-700/20 pt-4 sm:flex-col sm:items-end sm:gap-1 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-green-800">Estimated transit</span>
            <span className="font-display text-xl font-semibold text-brand-green-800 sm:text-2xl">{estimate}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-brand-slate-400">
          Estimates are indicative and exclude documentation and customs processing time. Request a quote for confirmed schedules.
        </p>
      </div>
    </div>
  );
}
