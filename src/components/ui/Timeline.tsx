export function Timeline({
  items,
}: {
  items: { label: string; title: string; description: string }[];
}) {
  return (
    <ol className="relative border-l border-brand-slate-200 pl-8 sm:pl-10">
      {items.map((item, idx) => (
        <li key={idx} className="relative mb-12 last:mb-0">
          <span className="absolute -left-[2.55rem] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-green-700 bg-white text-[0.65rem] font-bold text-brand-green-800 sm:-left-[3.05rem]">
            {idx + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-700">
            {item.label}
          </span>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-brand-slate-900">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-slate-600">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function NumberedSteps({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200 sm:grid-cols-3">
      {steps.map((step, idx) => (
        <div key={step.title} className="flex flex-col gap-3 bg-white p-7">
          <span className="font-display text-3xl font-semibold text-brand-slate-300">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-base font-semibold text-brand-slate-900">{step.title}</h3>
          <p className="text-sm leading-relaxed text-brand-slate-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
