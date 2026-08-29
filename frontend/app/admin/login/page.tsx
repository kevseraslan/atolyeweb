import React from "react";
import type { Metadata } from "next";
import { AdminLoginClient } from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin Girişi | Yönetim Paneli",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
