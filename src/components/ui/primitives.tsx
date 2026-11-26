import { ReactNode } from "react";
import Link from "next/link";
import { photoSrcSet, type Photo } from "@/data/photos";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
  className?: string;
}) {
  return (
    <Link href={href} className={`btn ${variant === "quiet" ? "btn--quiet" : ""} ${className}`}>
      {children}
    </Link>
  );
}

/** The inner pages' Banner hero: a head, one line, and whatever the page leads with. */
export function PageIntro({
  title,
  lead,
  children,
  aside,
  tone = "paper",
  photo,
}: {
  title: string;
  lead: string;
  children?: ReactNode;
  aside?: ReactNode;
  tone?: "paper" | "field";
  photo?: { photo: Photo; slot: string; ratio?: "land" | "tall" | "wide" };
}) {
  return (
    <section className={`intro ${tone === "field" ? "intro--field" : ""} ${photo ? "intro--photo" : ""}`}>
      <Container>
        <div className="intro__grid">
          <div className="stack-lg">
            <h1 data-hero-item>{title}</h1>
            <p className="lead" data-hero-item>
              {lead}
            </p>
            {children ? <div data-hero-item>{children}</div> : null}
          </div>
          {photo ? (
            <div data-hero-item>
              <PhotoSlot photo={photo.photo} slot={photo.slot} ratio={photo.ratio ?? "land"} priority sizes="(min-width: 60rem) 55vw, 100vw" />
            </div>
          ) : aside ? (
            <div data-hero-item>{aside}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** A photograph in a slot the owner's own picture replaces. */
export function PhotoSlot({
  photo,
  slot,
  ratio = "land",
  priority = false,
  sizes = "(min-width: 60rem) 50vw, 100vw",
  className = "",
}: {
  photo: Photo;
  slot: string;
  ratio?: "land" | "tall" | "wide" | "fill";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const { src, srcSet } = photoSrcSet(photo);
  return (
    <figure
      className={`photo ${ratio === "fill" ? "" : `photo--${ratio}`} ${className}`}
      data-slot={slot}
      data-alt={photo.slotAlt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- slot images are swapped by the owner; next/image would need remote config per source */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={photo.w}
        height={photo.h}
        alt={photo.alt}
        style={{ ["--pos" as string]: photo.position ?? "50% 50%" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </figure>
  );
}

/** The navy close: the page's job again, in one line and its actions. */
export function CloseBand({
  title,
  line,
  primary,
  secondary,
}: {
  title: string;
  line?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="band section--s">
      <Container>
        <div className="close" data-reveal>
          <h2>{title}</h2>
          <div className="close__aside">
            {line ? <p>{line}</p> : null}
            <div className="actions">
              {secondary ? (
                <Button href={secondary.href} variant="quiet">
                  {secondary.label}
                </Button>
              ) : null}
              <Button href={primary.href}>{primary.label}</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** A segmented filter: one button per choice, the current one pressed. */
export function Segmented<T extends string>({
  items,
  active,
  onChange,
  label,
}: {
  items: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.id} type="button" onClick={() => onChange(item.id)} aria-pressed={active === item.id}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
