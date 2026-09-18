import { Quote } from "lucide-react";

export function TestimonialCard({
  quote,
  name,
  role,
  company,
}: {
  quote: string;
  name: string;
  role: string;
  company: string;
}) {
  return (
    <figure className="flex h-full flex-col justify-between gap-8 border-l-2 border-brand-navy-700 bg-brand-slate-50 p-7">
      <Quote aria-hidden="true" className="h-7 w-7 text-brand-navy-300" strokeWidth={1.5} />
      <blockquote className="flex-1 text-sm sm:text-base leading-relaxed text-brand-slate-800">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-brand-slate-200 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-leaf-200 bg-white text-sm font-semibold text-brand-leaf-700">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-slate-900">{name}</div>
          <div className="text-xs text-brand-slate-500">
            {role}, {company}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
