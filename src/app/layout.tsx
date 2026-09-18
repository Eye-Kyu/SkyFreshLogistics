import type { Metadata } from "next";
import "./globals.css";
import { fontDisplay, fontSans } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Export Logistics for Fresh Produce`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.fullName,
  openGraph: {
    type: "website",
    siteName: site.fullName,
    title: `${site.name} — Export Logistics for Fresh Produce`,
    description: site.tagline,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Export Logistics for Fresh Produce`,
    description: site.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
