"use client";

import { FormEvent, useState } from "react";
import { site } from "@/data/site";

// NOTE for developer: this form has no backend yet. It used to print a fake
// "Application received" message; it now says plainly that nothing was sent
// and points the grower to email or the hotline. Set `ENDPOINT` to a real API
// route (see /api/quote-requests for the pattern) to make it submit.
const ENDPOINT = "";

export function FarmerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "unsent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstInvalid = form.querySelector<HTMLElement>(":invalid");
    if (firstInvalid) {
      form.reportValidity();
      firstInvalid.focus();
      return;
    }
    if (!ENDPOINT) {
      setStatus("unsent");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: new FormData(form) });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="notice notice--ok stack-sm" role="status">
        <h3>Application received</h3>
        <p>Our sourcing team will review your details and follow up within 3 to 5 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form" data-endpoint={ENDPOINT} noValidate>
      <div className="form-grid">
        <Field label="Farm / Farmer name" name="farmName" autoComplete="organization" required />
        <Field label="Location (County/Region)" name="location" required />
        <Field label="Primary produce grown" name="produce" required placeholder="e.g. Avocados, roses" />
        <Field label="Land size (acres)" name="landSize" type="number" />
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" required />
        <Field label="Email address" name="email" type="email" autoComplete="email" required />
        <label className="field span-2">
          <span className="field__label">Certifications held (if any)</span>
          <input name="certifications" placeholder="e.g. GlobalGAP, KEPHIS" className="input" />
        </label>
        <label className="field span-2">
          <span className="field__label">
            Tell us about your supply capacity <span className="field__hint">(required)</span>
          </span>
          <textarea name="message" rows={4} required className="input" />
        </label>
      </div>
      <p className={status === "error" ? "form-error" : "form-note"} role="status">
        {status === "unsent"
          ? `Nothing was sent: online applications are not connected yet. Email ${site.email} or call ${site.hotline} with these details.`
          : status === "error"
            ? "That did not go through. Try again in a minute, or email us."
            : ""}
      </p>
      <button type="submit" className="btn" disabled={status === "submitting"} aria-busy={status === "submitting"} style={{ justifySelf: "start" }}>
        {status === "submitting" ? "Submitting…" : "Submit application"}
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
