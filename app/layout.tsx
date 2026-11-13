import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Serampore Rooms — Student housing, sorted",
    template: "%s · Serampore Rooms",
  },
  description:
    "Find student-shared rooms, PGs, and flats across Serampore. Compare rent, amenities, and localities, then connect directly with the person who shared the room — no brokerage.",
  keywords: [
    "Serampore rooms",
    "student housing Serampore",
    "PG in Serampore",
    "rooms near Serampore College",
    "Serampore rent",
  ],
  openGraph: {
    title: "Serampore Rooms — Student housing, sorted",
    description:
      "Student-shared rooms, PGs, and flats across Serampore. Search by budget and locality, and talk directly to the person who shared the room.",
    type: "website",
    locale: "en_IN",
    siteName: "Serampore Rooms",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
