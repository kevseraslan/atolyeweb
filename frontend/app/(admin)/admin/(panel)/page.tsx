import React from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-[#442a22] font-bold">
          Hoş Geldiniz
        </h1>
        <p className="text-sm text-[#504441] mt-1">
          Artisan Woodworks yönetim paneline genel bakış.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#fcf9f8] p-6 rounded-xl border border-[#e5e2e1] shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#504441] tracking-widest block mb-2">
            Toplam Ürün
          </span>
          <span className="font-serif text-3xl font-bold text-[#442a22]">
            24
          </span>
        </div>
        <div className="bg-[#fcf9f8] p-6 rounded-xl border border-[#e5e2e1] shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#504441] tracking-widest block mb-2">
            Bekleyen Siparişler
          </span>
          <span className="font-serif text-3xl font-bold text-[#442a22]">
            8
          </span>
        </div>
        <div className="bg-[#fcf9f8] p-6 rounded-xl border border-[#e5e2e1] shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#504441] tracking-widest block mb-2">
            Kategoriler
          </span>
          <span className="font-serif text-3xl font-bold text-[#442a22]">
            6
          </span>
        </div>
        <div className="bg-[#fcf9f8] p-6 rounded-xl border border-[#e5e2e1] shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#504441] tracking-widest block mb-2">
            Aktif Renkler
          </span>
          <span className="font-serif text-3xl font-bold text-[#442a22]">
            12
          </span>
        </div>
      </div>

      {/* Quick Links / Dashboard Overview */}
      <div className="bg-[#fcf9f8] p-8 rounded-xl border border-[#e5e2e1] shadow-sm">
        <h2 className="font-serif text-xl font-semibold text-[#442a22] mb-4">
          Hızlı İşlemler
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/urunler"
            className="px-6 py-3 bg-[#442a22] text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#5d4037]"
          >
            Ürün Yönetimi
          </Link>
          <Link
            href="/admin/siparisler"
            className="px-6 py-3 border border-[#442a22] text-[#442a22] text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#f0eded]"
          >
            Sipariş Yönetimi
          </Link>
        </div>
      </div>
    </div>
  );
}
