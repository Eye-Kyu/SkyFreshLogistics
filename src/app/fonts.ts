import localFont from "next/font/local";

// Self-hosted via @fontsource-variable — no runtime requests to Google Fonts.
export const fontDisplay = localFont({
  src: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
});

export const fontSans = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-sans-local",
  weight: "200 800",
  display: "swap",
});
