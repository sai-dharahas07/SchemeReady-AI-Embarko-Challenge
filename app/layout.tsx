import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
import "./landing.css";
import "./india-theme.css";

export const metadata: Metadata = {
  title: { default: "SchemeReady AI | Discover Your Benefits. Prepare With Confidence.", template: "%s | SchemeReady AI" },
  description: "An independent citizen-assistance platform to discover government benefits, understand eligibility and prepare applications with confidence.",
  applicationName: "SchemeReady AI",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { themeColor: "#0A2540", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}