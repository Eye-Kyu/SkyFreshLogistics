"use client";

import { FormEvent, useState } from "react";
import { CircleCheck } from "lucide-react";
import { QuoteEstimate } from "./QuoteEstimate";

// Submits to POST /api/quote-requests, which stores the lead for Sales (see
// GET /api/quote-requests). The optional instant estimate's inputs (fields named
// `estimate*`, from QuoteEstimate) are sent along as `lane`; the server re-prices
// them itself rather than trusting a price from the browser.

function text(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** The estimate panel's inputs, or undefined if the customer didn't fill it in. */
function laneFromForm(fd: FormData) {
  const destination = text(fd, "estimateDestination");
  const commodity = text(fd, "estimateCommodity");
  const weight = text(fd, "estimateGrossWeightKg");
  if (!destination || !commodity || !weight) return undefined;

  const dimensions = [];
  for (let i = 0; fd.has(`estimateDimensions[${i}].pieces`); i++) {
    const row = (["pieces", "lengthCm", "widthCm", "heightCm"] as const).map((f) => text(fd, `estimateDimensions[${i}].${f}`));
    if (row.every((v) => v === "")) continue; // blank line
    const [pieces, lengthCm, widthCm, heightCm] = row.map(Number);
    dimensions.push({ pieces, lengthCm, widthCm, heightCm });
  }

  return {
    origin: text(fd, "estimateOrigin"),
    destination,
    commodity,
    airline: text(fd, "estimateAirline") || null, // "" = any airline
    readyDate: text(fd, "estimateReadyDate"),
    grossWeightKg: Number(weight),
    dimensions,
  };
}

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: text(fd, "name"),
          company: text(fd, "company"),
          email: text(fd, "email"),
          phone: text(fd, "phone"),
          productType: text(fd, "productType"),
          estimatedVolume: text(fd, "volume"),
          destination: text(fd, "destination"),
          message: text(fd, "message"),
          website: text(fd, "website"),
          lane: laneFromForm(fd),
        }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setErrorMessage(
        res.status === 400 && body.error
          ? `Please check the form: ${body.error}.`
          : "Something went wrong sending your request. Please try again, or call our hotline."
      );
    } catch {
      setErrorMessage("We couldn't reach our server. Check your connection and try again, or call our hotline.");
    }
    setStatus("error");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-brand-navy-700/20 bg-brand-navy-50 p-8 text-center">
        <CircleCheck aria-hidden="true" className="h-8 w-8 text-brand-navy-700" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-brand-navy-900">Quote request received</h3>
        <p className="text-sm text-brand-navy-800">
          Thank you — our team will respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-5 border border-brand-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Company" name="company" required />
        <Field label="Email address" name="email" type="email" required />
        <Field label="Phone number" name="phone" type="tel" required />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-slate-700">Product type</span>
          <select
            name="productType"
            className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-navy-700 focus:outline-none"
          >
            <option>Horticulture (fruits/vegetables/herbs)</option>
            <option>Floriculture (flowers/stems/fillers)</option>
            <option>Both</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <Field label="Estimated volume" name="volume" placeholder="e.g. 2 tonnes / week" />
        <Field label="Destination" name="destination" required placeholder="e.g. Amsterdam, Netherlands" className="sm:col-span-2" />
      </div>
      <QuoteEstimate />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-brand-slate-700">Message</span>
        <textarea
          name="message"
          rows={4}
          className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-navy-700 focus:outline-none"
          placeholder="Tell us anything else that will help us prepare your quote"
        />
      </label>
      {/* Honeypot: hidden from people and assistive tech; bots that fill every
          field get a normal-looking success and their submission is dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-brand-navy-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Request a Quote"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-brand-slate-700">
        {label}
        {required ? <span className="text-brand-navy-600"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-navy-700 focus:outline-none"
      />
    </label>
  );
}
