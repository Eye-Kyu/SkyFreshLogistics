import { CloseBand } from "./primitives";

// Superseded by CloseBand in the redesign; no page uses it. Kept so nothing
// importing it breaks, pending the owner's OK to delete.
export function CTASection({
  title,
  subtitle,
  primary,
  secondary,
}: {
  title: string;
  subtitle?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "navy" | "leaf";
}) {
  return <CloseBand title={title} line={subtitle} primary={primary} secondary={secondary} />;
}
