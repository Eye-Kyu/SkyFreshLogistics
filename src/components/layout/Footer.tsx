import Link from "next/link";
import { footerLinks, site } from "@/data/site";
import { photoCredits } from "@/data/photos";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "@/components/ui/social-icons";

const socials = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.social.twitter, label: "X", Icon: XIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
];

// Mast footer: the wordmark large over the site's index, the hotline beside it.
export function Footer() {
  const tel = `tel:${site.hotline.replace(/\s+/g, "")}`;
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot__mast">
          <div className="foot__word" aria-hidden="true">
            {site.name}
          </div>
          <Link href="/contact" className="btn">
            Get a quote
          </Link>
        </div>

        <div className="foot__cols">
          <address className="foot__contact">
            <span>{site.fullName}</span>
            <span>{site.address}</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/\s+/g, "")}`}>{site.phone}</a>
            <div className="foot__social">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </address>

          {footerLinks.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.href}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2>24/7 cargo hotline</h2>
            <a href={tel} className="foot__hot">
              {site.hotline}
            </a>
            <p className="foot__credits" style={{ marginTop: "var(--space-xs)" }}>
              {site.hours}
            </p>
          </div>
        </div>

        <div className="foot__legal">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
          </nav>
        </div>
        <p className="foot__credits" data-credits>
          Photographs, stand-ins until Bravair&apos;s own:{" "}
          {photoCredits.map((c, i) => (
            <span key={c.page}>
              <a href={c.page}>{c.author}</a> ({c.license}, Wikimedia Commons)
              {i < photoCredits.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
