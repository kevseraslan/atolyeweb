import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Artisan Woodworks - Evinize Özel, Ustalıkla Üretilen Mobilyalar",
  description:
    "Masif ahşap ve özel üretim mobilya atölyesi. Özel ölçü ve zanaatkar üretimi.",
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
