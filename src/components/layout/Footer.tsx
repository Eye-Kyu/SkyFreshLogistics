import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { footerLinks, site } from "@/data/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "@/components/ui/social-icons";

const socials = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.social.twitter, label: "X", Icon: XIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="bg-grain bg-brand-slate-950 text-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.fullName} — home`}>
            {/* The mark is drawn on white, so it sits on a white tile against the dark footer. */}
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white p-0.5">
              <Image src="/logo-mark.webp" alt="" width={32} height={32} className="object-contain" />
            </span>
            <span className="font-display text-lg font-semibold text-white">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{site.tagline}</p>
          <div className="mt-5 flex flex-col gap-1.5 text-sm text-white/60">
            <span>{site.address}</span>
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="hover:text-white">
              {site.phone}
            </a>
          </div>
          <div className="mt-5 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((group) => (
          <div key={group.heading}>
            <h3 className="text-sm font-semibold text-white">{group.heading}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-white">24/7 Cargo Hotline</h3>
          <a
            href={`tel:${site.hotline.replace(/\s+/g, "")}`}
            className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-brand-leaf-300 hover:text-brand-leaf-200"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            {site.hotline}
          </a>
          <p className="mt-2 text-sm text-white/60">{site.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
