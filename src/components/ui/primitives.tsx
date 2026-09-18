import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-page ${className}`}>{children}</div>;
}

export function Eyebrow({
  children,
  tone = "navy",
  className = "",
}: {
  children: ReactNode;
  tone?: "navy" | "leaf" | "white";
  className?: string;
}) {
  const toneStyles: Record<string, string> = {
    navy: "text-brand-navy-700",
    leaf: "text-brand-leaf-700",
    white: "text-white/80",
  };
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] ${toneStyles[tone]} ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "navy",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "navy" | "leaf" | "white";
}) {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  const titleTone = tone === "white" ? "text-white" : "text-brand-slate-900";
  const subtitleTone = tone === "white" ? "text-white/75" : "text-brand-slate-600";
  return (
    <div className={`flex flex-col gap-4 max-w-3xl ${alignment}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.08] text-balance ${titleTone}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`text-base sm:text-lg leading-relaxed text-balance ${subtitleTone}`}>{subtitle}</p>
      ) : null}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "invert";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-navy-700 text-white shadow-[0_1px_0_rgba(255,255,255,0.15)_inset] hover:bg-brand-navy-800 focus-visible:outline-brand-navy-700",
  secondary:
    "bg-brand-leaf-700 text-white shadow-[0_1px_0_rgba(255,255,255,0.15)_inset] hover:bg-brand-leaf-800 focus-visible:outline-brand-leaf-700",
  outline:
    "border border-white/50 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "border border-brand-slate-300 text-brand-slate-800 hover:border-brand-navy-700 hover:text-brand-navy-800 focus-visible:outline-brand-navy-700",
  invert:
    "bg-white text-brand-navy-800 hover:bg-brand-navy-50 focus-visible:outline-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/btn inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {showArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
        />
      ) : null}
    </Link>
  );
}

export function StatBar({
  stats,
  tone = "dark",
}: {
  stats: { value: string; label: string }[];
  tone?: "dark" | "light";
}) {
  const valueTone = tone === "dark" ? "text-white" : "text-brand-slate-900";
  const labelTone = tone === "dark" ? "text-white/65" : "text-brand-slate-500";
  const dividerTone = tone === "dark" ? "divide-white/15" : "divide-brand-slate-200";
  return (
    <div className={`grid grid-cols-2 divide-y divide-x sm:grid-cols-4 sm:divide-y-0 ${dividerTone}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1.5 px-4 py-5 text-center first:pl-0 sm:first:pl-4">
          <span className={`font-display text-3xl sm:text-4xl font-semibold tabular-nums ${valueTone}`}>
            {stat.value}
          </span>
          <span className={`text-xs sm:text-sm ${labelTone}`}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Badge({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  const styles =
    tone === "dark"
      ? "border border-white/20 bg-white/10 text-white backdrop-blur"
      : "border border-brand-slate-200 bg-white text-brand-slate-800 shadow-soft";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
}

/**
 * Stylised stand-in for real photography: layered tint + grain + crop-mark
 * corners, so pages don't ship with a flat two-color gradient box.
 */
export function MediaPlaceholder({
  label,
  tone = "navy",
  className = "",
  icon,
}: {
  label: string;
  tone?: "navy" | "leaf" | "duo";
  className?: string;
  icon?: ReactNode;
}) {
  const gradients: Record<string, string> = {
    navy: "from-brand-navy-800 via-brand-navy-700 to-brand-navy-950",
    leaf: "from-brand-leaf-800 via-brand-leaf-700 to-brand-leaf-950",
    duo: "from-brand-navy-800 via-brand-navy-900 to-brand-leaf-900",
  };
  return (
    <div
      className={`bg-grain relative flex items-center justify-center overflow-hidden rounded-md bg-linear-to-br text-white ${gradients[tone]} ${className}`}
    >
      <div className="crop-marks text-white/40" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="relative z-1 flex flex-col items-center gap-3 px-6 text-center">
        {icon ? <span className="text-white/50">{icon}</span> : null}
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">{label}</span>
      </div>
    </div>
  );
}

export function TabPills<T extends string>({
  items,
  active,
  onChange,
}: {
  items: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 rounded-md border border-brand-slate-200 bg-brand-slate-50 p-1.5 sm:inline-flex">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={active === item.id}
          className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
            active === item.id
              ? "bg-brand-navy-800 text-white shadow-soft"
              : "text-brand-slate-600 hover:bg-white hover:text-brand-slate-900"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
