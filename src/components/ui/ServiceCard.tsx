import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="group relative flex h-full flex-col gap-5 border border-brand-slate-200 bg-white p-7 transition-all duration-200 hover:border-brand-navy-700 hover:shadow-lifted">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.75 scale-x-0 bg-brand-navy-700 transition-transform duration-200 origin-left group-hover:scale-x-100"
      />
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center border border-brand-slate-200 text-brand-navy-700 transition-colors group-hover:border-brand-navy-700 group-hover:bg-brand-navy-700 group-hover:text-white">
          {icon}
        </div>
        {href ? (
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 text-brand-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-navy-700"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-semibold text-brand-slate-900">{title}</h3>
        <p className="text-sm leading-relaxed text-brand-slate-600">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }
  return content;
}
