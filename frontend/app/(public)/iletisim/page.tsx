import React from "react";
import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "İletişim & Atölye Adresi",
  description:
    "Artisan Woodworks ahşap mobilya atölyesi iletişim bilgileri, adres ve mesaj formu.",
  alternates: {
    canonical: `${siteUrl}/iletisim`,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
