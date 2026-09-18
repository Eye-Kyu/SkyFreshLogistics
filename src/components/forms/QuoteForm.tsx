"use client";

import { FormEvent, useState } from "react";
import { CircleCheck } from "lucide-react";

// NOTE for developer: this form currently simulates submission client-side.
// Wire `handleSubmit` up to your form backend (API route, CRM, or email service
// such as SendGrid/Postmark, or a Zapier/Make webhook) before launch.

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 600);
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
    <form onSubmit={handleSubmit} className="grid gap-5 border border-brand-slate-200 bg-white p-6 sm:p-8">
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
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-brand-slate-700">Message</span>
        <textarea
          name="message"
          rows={4}
          className="border border-brand-slate-300 px-3 py-2.5 text-sm text-brand-slate-800 focus:border-brand-navy-700 focus:outline-none"
          placeholder="Tell us anything else that will help us prepare your quote"
        />
      </label>
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
