"use client";

import { useMemo, useState } from "react";
import { Package, Plane, Ship } from "lucide-react";

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

// [P] Estimates are illustrative. Replace with real route data from operations.
const transitTable: Record<string, Record<Mode, string>> = {
  "Amsterdam, Netherlands": { "Air Freight": "24 to 48 hours", "Sea Freight": "18 to 22 days", "Mixed Consolidation": "3 to 5 days" },
  "London, United Kingdom": { "Air Freight": "24 to 48 hours", "Sea Freight": "20 to 24 days", "Mixed Consolidation": "3 to 5 days" },
  "Dubai, UAE": { "Air Freight": "12 to 24 hours", "Sea Freight": "12 to 16 days", "Mixed Consolidation": "2 to 4 days" },
  "Doha, Qatar": { "Air Freight": "12 to 24 hours", "Sea Freight": "13 to 17 days", "Mixed Consolidation": "2 to 4 days" },
  "Tokyo, Japan": { "Air Freight": "36 to 60 hours", "Sea Freight": "28 to 35 days", "Mixed Consolidation": "5 to 7 days" },
  "Moscow, Russia": { "Air Freight": "24 to 48 hours", "Sea Freight": "Air or mixed only", "Mixed Consolidation": "4 to 6 days" },
};

export function TransitCalculator() {
  const [origin, setOrigin] = useState(origins[0]);
  const [destination, setDestination] = useState(destinations[0]);
  const [mode, setMode] = useState<Mode>("Air Freight");

  const estimate = useMemo(() => transitTable[destination]?.[mode] ?? "Contact us for an estimate", [destination, mode]);
  const ModeIcon = modeIcons[mode];

  return (
    <div className="transit">
      <div className="transit__controls">
        <label className="field">
          <span className="field__label">Origin</span>
          <select className="input" value={origin} onChange={(e) => setOrigin(e.target.value)}>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Destination</span>
          <select className="input" value={destination} onChange={(e) => setDestination(e.target.value)}>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Mode</span>
          <select className="input" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            {modes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="transit__readout" aria-live="polite">
        <div>
          <div className="transit__label">Lane</div>
          <div className="transit__lane with-icon">
            {origin}
            <ModeIcon aria-hidden="true" size={20} />
            {destination}
          </div>
        </div>
        <div>
          <div className="transit__label">Indicative transit</div>
          <div className="transit__time">{estimate}</div>
        </div>
      </div>

      <p className="small muted">
        Indicative only, excluding documentation and customs time. Request a quote for confirmed schedules.
      </p>
    </div>
  );
}
