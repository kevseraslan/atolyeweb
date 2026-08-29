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
    "Hayalinizdeki mobilyayı ölçülerinize, tarzınıza ve renk tercihinize göre sizin için üretiyoruz. Masif ahşap ve özel üretim mobilya atölyesi.",
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcf9f8] text-[#1b1c1c]">
        {children}
      </body>
    </html>
  );
}
