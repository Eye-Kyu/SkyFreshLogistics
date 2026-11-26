import type { Metadata } from "next";
import "./globals.css";
import { fontDisplay, fontSans } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Motion } from "@/components/motion/Motion";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name}: export logistics for fresh produce and flowers`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.fullName,
  openGraph: {
    type: "website",
    siteName: site.fullName,
    title: `${site.name}: export logistics for fresh produce and flowers`,
    description: site.tagline,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: export logistics for fresh produce and flowers`,
    description: site.tagline,
  },
};

// Adds `.js` before first paint so reveal styles only apply when script runs.
// If the motion runtime has not started within 2.5s, `.motion-off` shows
// everything, so a failed bundle never leaves the page blank.
const motionGuard = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('motion-off')},2500)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
