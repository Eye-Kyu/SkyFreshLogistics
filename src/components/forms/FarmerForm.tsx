"use client";

import { FormEvent, useState } from "react";
import { Sprout } from "lucide-react";

// NOTE for developer: this form currently simulates submission client-side.
// Wire `handleSubmit` up to your form backend (API route, CRM, or email service)
// before launch — see the Contact page's QuoteForm for the same pattern.

export function FarmerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 600);
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-brand-green-700/20 bg-brand-green-50 p-8 text-center">
        <Sprout aria-hidden="true" className="h-8 w-8 text-brand-green-700" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-brand-green-900">Application received</h3>
        <p className="text-sm text-brand-green-800">
          Thank you for registering. Our sourcing team will review your details and follow up within 3–5 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 border border-brand-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Farm / Farmer name" name="farmName" required />
        <Field label="Location (County/Region)" name="location" required />
        <Field label="Primary produce grown" name="produce" required placeholder="e.g. Avocados, roses" />
        <Field label="Land size (acres)" name="landSize" type="number" />
        <Field label="Phone number" name="phone" type="tel" required />
        <Field label="Email address" name="email" type="email" required />
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-brand-slate-700">Certifications held (if any)</span>
        <input
          name="certifications"
          placeholder="e.g. GlobalGAP, KEPHIS"
          className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-brand-slate-700">Tell us about your supply capacity</span>
        <textarea
          name="message"
          rows={4}
          required
          className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-brand-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-brand-slate-700">
        {label}
        {required ? <span className="text-brand-green-600"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-green-700 focus:outline-none"
      />
    </label>
  );
}
