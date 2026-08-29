"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDashboard } from "@/features/admin/api";
import { AdminDashboardSummary } from "@/features/admin/types";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminDashboard()
      .then((data) => {
        if (isMounted) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="text-[#442a22] font-semibold">Özet paneli verileri yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Atölye Özet Paneli</h1>
        <p className="text-sm text-[#504441] mt-1">
          Genel sipariş durumları ve ürün kataloğu istatistikleri.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#e5e2e1] p-5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#827470]">Yeni Talepler</span>
          <span className="text-3xl font-bold text-[#442a22] block mt-2">
            {summary?.new_requests || 0}
          </span>
          <span className="text-xs text-[#6e605d] block mt-1">Henüz incelenmeyenler</span>
        </div>

        <div className="bg-white border border-[#e5e2e1] p-5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#827470]">İncelemede</span>
          <span className="text-3xl font-bold text-[#b45309] block mt-2">
            {summary?.under_review || 0}
          </span>
          <span className="text-xs text-[#6e605d] block mt-1">Ölçü/Cila değerlendirmesi</span>
        </div>

        <div className="bg-white border border-[#e5e2e1] p-5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#827470]">Üretimde</span>
          <span className="text-3xl font-bold text-[#1d4ed8] block mt-2">
            {summary?.in_production || 0}
          </span>
          <span className="text-xs text-[#6e605d] block mt-1">Atölyede hazırlananlar</span>
        </div>

        <div className="bg-white border border-[#e5e2e1] p-5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#827470]">Teslimata Hazır</span>
          <span className="text-3xl font-bold text-[#15803d] block mt-2">
            {summary?.ready || 0}
          </span>
          <span className="text-xs text-[#6e605d] block mt-1">Kalite kontrolü bitti</span>
        </div>

        <div className="bg-white border border-[#e5e2e1] p-5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#827470]">Toplam Ürün</span>
          <span className="text-3xl font-bold text-[#442a22] block mt-2">
            {summary?.total_products || 0}
          </span>
          <span className="text-xs text-[#6e605d] block mt-1">Katalogdaki kayıtlar</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#e5e2e1] p-6 rounded-lg shadow-sm flex flex-col gap-4">
        <h2 className="font-serif text-xl font-semibold text-[#442a22]">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/siparisler"
            className="px-4 py-3 bg-[#442a22] text-white text-sm font-semibold rounded hover:bg-[#2c1b16] transition-colors"
          >
            Siparişleri İncele & Yönet
          </Link>
          <Link
            href="/admin/urunler"
            className="px-4 py-3 bg-[#f6f3f2] text-[#442a22] border border-[#d4c3be] text-sm font-semibold rounded hover:bg-[#e8dedb] transition-colors"
          >
            Yeni Ürün Ekle / Düzenle
          </Link>
          <Link
            href="/admin/ayarlar"
            className="px-4 py-3 bg-[#f6f3f2] text-[#442a22] border border-[#d4c3be] text-sm font-semibold rounded hover:bg-[#e8dedb] transition-colors"
          >
            Site İletişim Bilgilerini Düzenle
          </Link>
        </div>
      </div>
    </div>
  );
}
