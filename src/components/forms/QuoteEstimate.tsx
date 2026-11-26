"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";

// Instant freight estimate for the contact page's QuoteForm, backed by
// GET /api/lists (dropdowns) and POST /api/quotes/price (public pricing: approved
// rate + freight total only, never buy rates or margins). It sits inside the
// QuoteForm's <form>, and its fields carry `name`s, so the lane details travel
// with the quote request once that form is wired to a backend.

interface Lists {
  origins: { code: string; name: string }[];
  destinations: { code: string; name: string }[];
  airlines: string[];
  commodities: { id: number; name: string; subtypes: string[] }[];
}

interface PriceResult {
  chargeableWeightKg: number;
  weightBasis: "GROSS" | "VOLUMETRIC";
  approvedFreightRateUsdKg: number;
  freightTotalUsd: number;
}

type Estimate =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "priced"; airline: string; result: PriceResult }
  | { kind: "noRate" }
  | { kind: "error"; message: string };

interface DimRow {
  pieces: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
}

const ANY_AIRLINE = "";
const MAX_DIM_ROWS = 10; // the QUOTE sheet has ten dimension rows
const emptyRow = (): DimRow => ({ pieces: "", lengthCm: "", widthCm: "", heightCm: "" });

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdRate = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 });
const kg = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function todayInNairobi(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());
}

const inputClass =
  "border border-brand-slate-300 bg-white px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-navy-700 focus:outline-none";

async function fetchPrice(body: object): Promise<{ status: number; json: Partial<PriceResult> & { error?: string } }> {
  const res = await fetch("/api/quotes/price", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export function QuoteEstimate() {
  const [lists, setLists] = useState<Lists | null>(null);
  const [listsFailed, setListsFailed] = useState(false);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [commodity, setCommodity] = useState("");
  const [airline, setAirline] = useState(ANY_AIRLINE);
  const [readyDate, setReadyDate] = useState(todayInNairobi);
  const [grossWeight, setGrossWeight] = useState("");
  const [dims, setDims] = useState<DimRow[]>([emptyRow()]);
  const [estimate, setEstimate] = useState<Estimate>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/lists")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: Lists) => {
        if (cancelled) return;
        setLists(data);
        // Most Bravair exports leave from Nairobi (JKIA); default there if listed.
        const defaultOrigin = data.origins.find((o) => o.code === "NBO") ?? data.origins[0];
        setOrigin((v) => v || defaultOrigin?.code || "");
      })
      .catch(() => !cancelled && setListsFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Any edit makes a shown estimate stale.
  function edit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setEstimate({ kind: "idle" });
    };
  }

  function updateDim(i: number, field: keyof DimRow, value: string) {
    edit(setDims)(dims.map((row, j) => (j === i ? { ...row, [field]: value } : row)));
  }

  async function getEstimate() {
    if (!origin || !destination || !commodity || !readyDate) {
      setEstimate({ kind: "error", message: "Choose an origin, destination, product and ready date." });
      return;
    }
    const weight = Number(grossWeight);
    if (!grossWeight || !Number.isFinite(weight) || weight <= 0) {
      setEstimate({ kind: "error", message: "Enter the gross weight in kg." });
      return;
    }

    const dimensions = [];
    for (const [i, row] of dims.entries()) {
      const values = [row.pieces, row.lengthCm, row.widthCm, row.heightCm];
      if (values.every((v) => v.trim() === "")) continue; // blank row
      const nums = values.map(Number);
      if (values.some((v) => v.trim() === "") || nums.some((n) => !Number.isFinite(n) || n <= 0) || !Number.isInteger(nums[0])) {
        setEstimate({
          kind: "error",
          message: `Dimension line ${i + 1}: enter whole-number pieces and length, width and height in cm, or clear the line.`,
        });
        return;
      }
      dimensions.push({ pieces: nums[0], lengthCm: nums[1], widthCm: nums[2], heightCm: nums[3] });
    }

    setEstimate({ kind: "loading" });
    const base = { origin, destination, commodity, readyDate, grossWeightKg: weight, dimensions };
    const candidates = airline === ANY_AIRLINE ? lists?.airlines ?? [] : [airline];

    try {
      const responses = await Promise.all(
        candidates.map(async (name) => ({ name, ...(await fetchPrice({ ...base, airline: name })) }))
      );
      const priced = responses.filter((r) => r.status === 200);
      if (priced.length > 0) {
        const best = priced.reduce((a, b) => ((b.json.freightTotalUsd ?? Infinity) < (a.json.freightTotalUsd ?? Infinity) ? b : a));
        setEstimate({ kind: "priced", airline: best.name, result: best.json as PriceResult });
      } else if (responses.length > 0 && responses.every((r) => r.status === 422)) {
        setEstimate({ kind: "noRate" });
      } else {
        const badRequest = responses.find((r) => r.status === 400);
        setEstimate({
          kind: "error",
          message: badRequest?.json.error
            ? `Please check your shipment details (${badRequest.json.error}).`
            : "We couldn't calculate an estimate right now. Submit the form and our team will quote you directly.",
        });
      }
    } catch {
      setEstimate({ kind: "error", message: "We couldn't reach the pricing service. Please try again." });
    }
  }

  if (listsFailed) {
    return (
      <p className="border border-brand-slate-200 bg-brand-slate-50 p-4 text-sm text-brand-slate-600">
        Instant estimates are unavailable right now — submit the form and our team will price your shipment.
      </p>
    );
  }

  return (
    <fieldset className="grid gap-4 border border-brand-slate-200 bg-brand-slate-50 p-5">
      <legend className="px-1 font-display text-base font-semibold text-brand-navy-900">
        Instant freight estimate <span className="font-sans text-sm font-normal text-brand-slate-500">(optional)</span>
      </legend>

      {!lists ? (
        <p className="text-sm text-brand-slate-500" aria-live="polite">
          Loading routes…
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Origin" name="estimateOrigin" value={origin} onChange={edit(setOrigin)}>
              {lists.origins.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.name && o.name !== o.code ? `${o.name} (${o.code})` : o.code}
                </option>
              ))}
            </SelectField>
            <SelectField label="Destination airport" name="estimateDestination" value={destination} onChange={edit(setDestination)}>
              <option value="">Select…</option>
              {lists.destinations.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name && d.name !== d.code ? `${d.name} (${d.code})` : d.code}
                </option>
              ))}
            </SelectField>
            <SelectField label="Product" name="estimateCommodity" value={commodity} onChange={edit(setCommodity)}>
              <option value="">Select…</option>
              {lists.commodities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </SelectField>
            <SelectField label="Airline" name="estimateAirline" value={airline} onChange={edit(setAirline)}>
              <option value={ANY_AIRLINE}>Any airline (lowest rate)</option>
              {lists.airlines.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </SelectField>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-slate-700">Cargo ready date</span>
              <input
                type="date"
                name="estimateReadyDate"
                value={readyDate}
                onChange={(e) => edit(setReadyDate)(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-slate-700">Gross weight (kg)</span>
              <input
                type="number"
                name="estimateGrossWeightKg"
                min="0"
                step="any"
                inputMode="decimal"
                value={grossWeight}
                onChange={(e) => edit(setGrossWeight)(e.target.value)}
                placeholder="e.g. 260"
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-brand-slate-700">
              Dimensions <span className="font-normal text-brand-slate-500">(optional — for volumetric weight)</span>
            </span>
            <div
              aria-hidden="true"
              className="grid grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-2 text-xs text-brand-slate-500"
            >
              <span>Pieces</span>
              <span>Length (cm)</span>
              <span>Width (cm)</span>
              <span>Height (cm)</span>
              <span className="w-8" />
            </div>
            {dims.map((row, i) => (
              <div key={i} className="grid grid-cols-[repeat(4,minmax(0,1fr))_auto] items-center gap-2">
                {(
                  [
                    ["pieces", "Pieces"],
                    ["lengthCm", "L (cm)"],
                    ["widthCm", "W (cm)"],
                    ["heightCm", "H (cm)"],
                  ] as const
                ).map(([field, label]) => (
                  <input
                    key={field}
                    type="number"
                    name={`estimateDimensions[${i}].${field}`}
                    min="0"
                    step={field === "pieces" ? "1" : "any"}
                    inputMode={field === "pieces" ? "numeric" : "decimal"}
                    aria-label={`Line ${i + 1} ${label}`}
                    placeholder={label}
                    value={row[field]}
                    onChange={(e) => updateDim(i, field, e.target.value)}
                    className={`${inputClass} min-w-0`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => edit(setDims)(dims.length === 1 ? [emptyRow()] : dims.filter((_, j) => j !== i))}
                  aria-label={`Remove dimension line ${i + 1}`}
                  className="p-2 text-brand-slate-500 hover:text-brand-navy-700"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
            {dims.length < MAX_DIM_ROWS ? (
              <button
                type="button"
                onClick={() => edit(setDims)([...dims, emptyRow()])}
                className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand-navy-700 hover:underline"
              >
                <Plus aria-hidden="true" className="h-4 w-4" /> Add line
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={getEstimate}
            disabled={estimate.kind === "loading"}
            className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-brand-navy-700 px-5 py-2.5 text-sm font-semibold text-brand-navy-700 transition-colors hover:bg-brand-navy-50 disabled:opacity-60"
          >
            <Calculator aria-hidden="true" className="h-4 w-4" />
            {estimate.kind === "loading" ? "Calculating…" : "Get estimate"}
          </button>

          <div aria-live="polite">
            <EstimateResult estimate={estimate} />
          </div>
        </>
      )}
    </fieldset>
  );
}

function EstimateResult({ estimate }: { estimate: Estimate }) {
  switch (estimate.kind) {
    case "priced": {
      const r = estimate.result;
      return (
        <div className="border border-brand-navy-700/20 bg-white p-4">
          <p className="text-sm text-brand-slate-600">Estimated air freight · {estimate.airline}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-brand-navy-900">{usd.format(r.freightTotalUsd)}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-brand-slate-500">Rate</dt>
            <dd className="text-brand-slate-800">{usdRate.format(r.approvedFreightRateUsdKg)} / kg</dd>
            <dt className="text-brand-slate-500">Chargeable weight</dt>
            <dd className="text-brand-slate-800">
              {kg.format(r.chargeableWeightKg)} kg ({r.weightBasis === "VOLUMETRIC" ? "volumetric" : "gross"})
            </dd>
          </dl>
          <p className="mt-3 text-xs text-brand-slate-500">
            Freight only, including airline surcharges. Documentation, handling, cold chain and other services are
            quoted separately. Not a binding quote — our team confirms the final price.
          </p>
        </div>
      );
    }
    case "noRate":
      return (
        <p className="border border-brand-slate-200 bg-white p-4 text-sm text-brand-slate-700">
          We don&apos;t have a published rate for this route and date yet. Submit the form below and our team will
          quote it for you.
        </p>
      );
    case "error":
      return <p className="text-sm text-red-700">{estimate.message}</p>;
    default:
      return null;
  }
}

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-brand-slate-700">{label}</span>
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {children}
      </select>
    </label>
  );
}
