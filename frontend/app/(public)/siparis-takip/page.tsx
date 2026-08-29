import React from "react";
import type { Metadata } from "next";
import { OrderTrackingClient } from "./OrderTrackingClient";

export const metadata: Metadata = {
  title: "Sipariş Takibi | Artisan Woodworks",
  description: "Siparişinizin veya özel teklif talebinizin güncel durumunu takip numaranız ve telefon numaranızla sorgulayın.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function OrderTrackingPage() {
  return <OrderTrackingClient />;
}
