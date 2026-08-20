import { ReactNode } from "react";
import { Button } from "./primitives";
import { Container } from "./primitives";

export function CTASection({
  title,
  subtitle,
  primary,
  secondary,
  tone = "green",
}: {
  title: string;
  subtitle?: string;
  primary: { label: ReactNode; href: string };
  secondary?: { label: ReactNode; href: string };
  tone?: "green" | "blue";
}) {
  const gradient =
    tone === "green"
      ? "from-brand-green-900 via-brand-green-800 to-brand-blue-900"
      : "from-brand-blue-900 via-brand-blue-800 to-brand-green-900";

  return (
    <section className={`bg-grain bg-linear-to-br ${gradient}`}>
      <Container className="flex flex-col items-center gap-7 py-20 text-center">
        <h2 className="max-w-2xl font-display text-3xl sm:text-4xl font-semibold leading-[1.1] text-white text-balance">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-xl text-white/75 text-balance">{subtitle}</p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={primary.href} variant="invert" showArrow>
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="outline">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
