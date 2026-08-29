import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { getSiteName } from "@/lib/site-name";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteName = getSiteName();
const defaultOgImage = `${siteUrl}/opengraph-default.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Özel Mobilya & Masif Ahşap Tasarım | ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description:
    "Evinize özel ölçü ve zanaatkar üretimi masif ahşap mobilyalar. Yemek masası, konsol, sehpa ve özel tasarım ahşap mobilya atölyesi.",
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: siteName,
    title: `Özel Mobilya & Masif Ahşap Tasarım | ${siteName}`,
    description:
      "Evinize özel ölçü ve zanaatkar üretimi masif ahşap mobilyalar. Yemek masası, konsol, sehpa ve özel tasarım ahşap mobilya atölyesi.",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Özel Mobilya & Masif Ahşap Tasarım | ${siteName}`,
    description:
      "Evinize özel ölçü ve zanaatkar üretimi masif ahşap mobilyalar. Yemek masası, konsol, sehpa ve özel tasarım ahşap mobilya atölyesi.",
    images: [defaultOgImage],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcf9f8] text-[#1b1c1c]">
        {children}
      </body>
    </html>
  );
}
