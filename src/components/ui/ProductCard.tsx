export function ProductCard({
  name,
  category,
  description,
  tone = "green",
}: {
  name: string;
  category: string;
  description: string;
  tone?: "green" | "blue";
}) {
  const gradient =
    tone === "blue"
      ? "from-brand-blue-100 via-brand-blue-50 to-white"
      : "from-brand-green-100 via-brand-green-50 to-white";
  const tagTone = tone === "blue" ? "text-brand-blue-700" : "text-brand-green-700";

  return (
    <div className="group flex flex-col overflow-hidden border border-brand-slate-200 bg-white transition-all duration-200 hover:border-brand-slate-300 hover:shadow-lifted">
      <div className={`relative flex h-32 items-center justify-center bg-linear-to-br ${gradient}`}>
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(135deg,currentColor_0,currentColor_1px,transparent_0,transparent_10px)]"
        />
        <span className="relative font-display text-sm font-medium uppercase tracking-[0.14em] text-brand-slate-400">
          Specimen photo pending
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-brand-slate-100 p-5">
        <span className={`text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${tagTone}`}>{category}</span>
        <h3 className="font-display text-base font-semibold text-brand-slate-900">{name}</h3>
        <p className="text-sm leading-relaxed text-brand-slate-600">{description}</p>
      </div>
    </div>
  );
}
