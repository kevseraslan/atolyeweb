import React from "react";
import type { Metadata } from "next";
import { SpecialOrderClient } from "./SpecialOrderClient";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Özel Mobilya Sipariş & Teklif Talebi",
  description:
    "Evinize özel masif ahşap mobilya siparişi verin. İstenen ölçü, ahşap türü ve renk tercihinize göre ücretsiz fiyat teklifi oluşturun.",
  alternates: {
    canonical: `${siteUrl}/ozel-siparis`,
  },
};

export default function SpecialOrderPage() {
  return <SpecialOrderClient />;
}
