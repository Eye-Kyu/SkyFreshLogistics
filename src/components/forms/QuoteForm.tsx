"use client";

import { FormEvent, useRef, useState } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstInvalid = form.querySelector<HTMLElement>(":invalid:not(fieldset)");
    if (firstInvalid) {
      form.reportValidity();
      firstInvalid.focus();
      return;
    }
    const fd = new FormData(form);
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
      <div className="notice notice--ok stack-sm" role="status">
        <CircleCheck aria-hidden="true" size={32} strokeWidth={1.5} className="tile__icon" />
        <h2 style={{ fontSize: "var(--text-title)" }}>Quote request received</h2>
        <p>Our team will respond within one business day.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="quote-form" noValidate>
      <div className="form-grid">
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field label="Company" name="company" autoComplete="organization" required />
        <Field label="Email address" name="email" type="email" autoComplete="email" required />
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" required />
        <label className="field">
          <span className="field__label">Product type</span>
          <select name="productType" className="input">
            <option>Horticulture (fruits/vegetables/herbs)</option>
            <option>Floriculture (flowers/stems/fillers)</option>
            <option>Both</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <Field label="Estimated volume" name="volume" placeholder="e.g. 2 tonnes / week" />
        <Field label="Destination" name="destination" required placeholder="e.g. Amsterdam, Netherlands" className="span-2" />
      </div>
      <QuoteEstimate />
      <label className="field">
        <span className="field__label">Message</span>
        <textarea
          name="message"
          rows={4}
          className="input"
          placeholder="Tell us anything else that will help us prepare your quote"
        />
      </label>
      {/* Honeypot: hidden from people and assistive tech; bots that fill every
          field get a normal-looking success and their submission is dropped. */}
      <div aria-hidden="true" className="visually-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="form-error" role="alert">
        {status === "error" ? errorMessage : ""}
      </p>
      <button type="submit" className="btn" disabled={status === "submitting"} aria-busy={status === "submitting"} style={{ justifySelf: "start" }}>
        {status === "submitting" ? "Sending…" : "Request a quote"}
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
  autoComplete,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span className="field__label">
        {label}
        {required ? <span className="field__hint"> (required)</span> : null}
      </span>
      <input name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} className="input" />
    </label>
  );
}
