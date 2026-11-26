"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { AnimatedPrice } from "@/components/motion/AnimatedPrice";
import {
  ANY_AIRLINE,
  fetchLists,
  kg,
  optionLabel,
  priceLane,
  todayInNairobi,
  usdRate,
  type Estimate,
  type Lists,
} from "@/lib/estimateClient";

// The home page's signature: the live freight estimate, priced by the same
// rate engine as the contact form. "Request this quote" carries the lane to
// /contact, where QuoteEstimate picks it up from the query string.
export function EstimateDesk() {
  const [lists, setLists] = useState<Lists | null>(null);
  const [failed, setFailed] = useState(false);
  const [origin, setOrigin] = useState("NBO");
  const [destination, setDestination] = useState("");
  const [commodity, setCommodity] = useState("");
  const [weight, setWeight] = useState("");
  const [estimate, setEstimate] = useState<Estimate>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    fetchLists()
      .then((data) => {
        if (cancelled) return;
        setLists(data);
        const nbo = data.origins.find((o) => o.code === "NBO") ?? data.origins[0];
        setOrigin(nbo?.code ?? "");
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  function edit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setEstimate({ kind: "idle" });
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!destination || !commodity) {
      setEstimate({ kind: "error", message: "Choose a destination and a product." });
      return;
    }
    const w = Number(weight);
    if (!weight || !Number.isFinite(w) || w <= 0) {
      setEstimate({ kind: "error", message: "Enter the gross weight in kg." });
      return;
    }
    setEstimate({ kind: "loading" });
    setEstimate(
      await priceLane({
        origin,
        destination,
        commodity,
        airline: ANY_AIRLINE,
        readyDate: todayInNairobi(),
        grossWeightKg: w,
        dimensions: [],
        airlines: lists?.airlines ?? [],
      })
    );
  }

  const quoteHref = `/contact?${new URLSearchParams({ origin, destination, commodity, weight }).toString()}#quote`;
  const disabled = !lists || estimate.kind === "loading";

  return (
    <form className="desk" onSubmit={onSubmit} aria-labelledby="desk-title" noValidate>
      <div className="desk__head">
        <h2 id="desk-title">Price an air freight lane</h2>
        <span className="desk__live">Live rates, today&apos;s date</span>
      </div>

      {failed ? (
        <div className="desk__body">
          <p className="muted">
            Instant pricing is unavailable right now. Send your lane through the quote form and the team prices it within
            one business day.
          </p>
          <Link href="/contact" className="btn btn--quiet">
            Open the quote form
          </Link>
        </div>
      ) : (
        <div className="desk__body">
          <div className="desk__lane">
            <label className="field">
              <span className="field__label">From</span>
              <select className="input" value={origin} onChange={(e) => edit(setOrigin)(e.target.value)} disabled={!lists}>
                {lists ? (
                  lists.origins.map((o) => (
                    <option key={o.code} value={o.code}>
                      {optionLabel(o)}
                    </option>
                  ))
                ) : (
                  <option value="NBO">NBO</option>
                )}
              </select>
            </label>
            <Plane aria-hidden="true" size={20} className="desk__plane" />
            <label className="field">
              <span className="field__label">To</span>
              <select
                className="input"
                value={destination}
                onChange={(e) => edit(setDestination)(e.target.value)}
                disabled={!lists}
              >
                <option value="">{lists ? "Choose airport" : "Loading airports…"}</option>
                {lists?.destinations.map((d) => (
                  <option key={d.code} value={d.code}>
                    {optionLabel(d)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="desk__row">
            <label className="field">
              <span className="field__label">Product</span>
              <select className="input" value={commodity} onChange={(e) => edit(setCommodity)(e.target.value)} disabled={!lists}>
                <option value="">Choose product</option>
                {lists?.commodities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Gross weight, kg</span>
              <input
                className="input"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="e.g. 260"
                value={weight}
                onChange={(e) => edit(setWeight)(e.target.value)}
              />
            </label>
          </div>
          <button type="submit" className="btn btn--block" disabled={disabled} aria-busy={estimate.kind === "loading"}>
            {estimate.kind === "loading" ? "Pricing every airline…" : "Get the lowest rate"}
          </button>
        </div>
      )}

      <div aria-live="polite">
        {estimate.kind === "priced" ? (
          <>
            <div className="desk__result">
              <div>
                <AnimatedPrice value={estimate.result.freightTotalUsd} className="desk__price" />
                <p className="desk__meta">
                  {estimate.airline}, {usdRate.format(estimate.result.approvedFreightRateUsdKg)} per kg on{" "}
                  {kg.format(estimate.result.chargeableWeightKg)} kg
                </p>
              </div>
              <Link href={quoteHref} className="btn btn--quiet">
                Request this quote
              </Link>
            </div>
            <p className="desk__note">Air freight with airline surcharges. Not binding until the team confirms.</p>
          </>
        ) : estimate.kind === "noRate" ? (
          <div className="desk__result">
            <p>No published rate for this lane today. The team will price it for you.</p>
            <Link href={quoteHref} className="btn btn--quiet">
              Ask for a price
            </Link>
          </div>
        ) : estimate.kind === "error" ? (
          <p className="desk__note form-error" role="alert" style={{ paddingTop: "var(--space-md)" }}>
            {estimate.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
