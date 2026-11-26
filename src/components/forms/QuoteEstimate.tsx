"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { AnimatedPrice } from "@/components/motion/AnimatedPrice";
import {
  ANY_AIRLINE,
  fetchLists,
  kg,
  optionLabel,
  priceLane,
  todayInNairobi,
  usdRate,
  type Dimension,
  type Estimate,
  type Lists,
} from "@/lib/estimateClient";

// Instant freight estimate for the contact page's QuoteForm, backed by
// GET /api/lists (dropdowns) and POST /api/quotes/price (public pricing: approved
// rate + freight total only, never buy rates or margins). It sits inside the
// QuoteForm's <form>, and its fields carry `name`s, so the lane details travel
// with the quote request (POST /api/quote-requests). A lane priced on the home
// page arrives in the query string (?origin=&destination=&commodity=&weight=).

interface DimRow {
  pieces: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
}

const MAX_DIM_ROWS = 10; // the QUOTE sheet has ten dimension rows
const emptyRow = (): DimRow => ({ pieces: "", lengthCm: "", widthCm: "", heightCm: "" });

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
    const params = new URLSearchParams(window.location.search);
    fetchLists()
      .then((data) => {
        if (cancelled) return;
        setLists(data);
        // Most Bravair exports leave from Nairobi (JKIA); default there if listed.
        const defaultOrigin = data.origins.find((o) => o.code === "NBO") ?? data.origins[0];
        const wanted = params.get("origin");
        setOrigin((v) => v || (data.origins.some((o) => o.code === wanted) ? wanted! : defaultOrigin?.code) || "");
        const dest = params.get("destination");
        if (dest && data.destinations.some((d) => d.code === dest)) setDestination(dest);
        const com = params.get("commodity");
        if (com && data.commodities.some((c) => c.name === com)) setCommodity(com);
        const w = params.get("weight");
        if (w && Number(w) > 0) setGrossWeight(w);
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

    const dimensions: Dimension[] = [];
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
    setEstimate(
      await priceLane({
        origin,
        destination,
        commodity,
        airline,
        readyDate,
        grossWeightKg: weight,
        dimensions,
        airlines: lists?.airlines ?? [],
      })
    );
  }

  if (listsFailed) {
    return (
      <p className="notice small">
        Instant estimates are unavailable right now. Submit the form and our team will price your shipment.
      </p>
    );
  }

  return (
    <fieldset className="estimate">
      <legend>
        Instant freight estimate <span>optional</span>
      </legend>

      {!lists ? (
        <p className="muted small" aria-live="polite">
          Loading routes…
        </p>
      ) : (
        <>
          <div className="form-grid">
            <SelectField label="Origin" name="estimateOrigin" value={origin} onChange={edit(setOrigin)}>
              {lists.origins.map((o) => (
                <option key={o.code} value={o.code}>
                  {optionLabel(o)}
                </option>
              ))}
            </SelectField>
            <SelectField label="Destination airport" name="estimateDestination" value={destination} onChange={edit(setDestination)}>
              <option value="">Select…</option>
              {lists.destinations.map((d) => (
                <option key={d.code} value={d.code}>
                  {optionLabel(d)}
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
            <label className="field">
              <span className="field__label">Cargo ready date</span>
              <input
                type="date"
                name="estimateReadyDate"
                value={readyDate}
                onChange={(e) => edit(setReadyDate)(e.target.value)}
                className="input"
              />
            </label>
            <label className="field">
              <span className="field__label">Gross weight (kg)</span>
              <input
                type="number"
                name="estimateGrossWeightKg"
                min="0"
                step="any"
                inputMode="decimal"
                value={grossWeight}
                onChange={(e) => edit(setGrossWeight)(e.target.value)}
                placeholder="e.g. 260"
                className="input"
              />
            </label>
          </div>

          <div className="dims">
            <span className="field__label">
              Dimensions <span className="field__hint">(optional, for volumetric weight)</span>
            </span>
            <div aria-hidden="true" className="dims__row small muted">
              <span>Pieces</span>
              <span>Length (cm)</span>
              <span>Width (cm)</span>
              <span>Height (cm)</span>
              <span />
            </div>
            {dims.map((row, i) => (
              <div key={i} className="dims__row">
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
                    className="input"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => edit(setDims)(dims.length === 1 ? [emptyRow()] : dims.filter((_, j) => j !== i))}
                  aria-label={`Remove dimension line ${i + 1}`}
                  className="iconbtn"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            ))}
            {dims.length < MAX_DIM_ROWS ? (
              <button type="button" onClick={() => edit(setDims)([...dims, emptyRow()])} className="linkbtn">
                <Plus aria-hidden="true" size={16} /> Add line
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={getEstimate}
            disabled={estimate.kind === "loading"}
            aria-busy={estimate.kind === "loading"}
            className="btn btn--quiet"
            style={{ justifySelf: "start" }}
          >
            <Calculator aria-hidden="true" size={16} />
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
        <div className="result">
          <p className="small muted">Estimated air freight with {estimate.airline}</p>
          <AnimatedPrice value={r.freightTotalUsd} className="result__price" />
          <dl>
            <dt>Rate</dt>
            <dd>{usdRate.format(r.approvedFreightRateUsdKg)} per kg</dd>
            <dt>Chargeable weight</dt>
            <dd>
              {kg.format(r.chargeableWeightKg)} kg ({r.weightBasis === "VOLUMETRIC" ? "volumetric" : "gross"})
            </dd>
          </dl>
          <p className="small muted">
            Freight only, including airline surcharges. Documentation, handling, cold chain and other services are quoted
            separately. Not a binding quote: our team confirms the final price.
          </p>
        </div>
      );
    }
    case "noRate":
      return (
        <p className="result small">
          We don&apos;t have a published rate for this route and date yet. Submit the form below and our team will quote it
          for you.
        </p>
      );
    case "error":
      return (
        <p className="form-error" role="alert">
          {estimate.message}
        </p>
      );
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
    <label className="field">
      <span className="field__label">{label}</span>
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {children}
      </select>
    </label>
  );
}
