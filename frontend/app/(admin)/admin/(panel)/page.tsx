import React from "react";

export default function AdminDashboardPageShell() {
  return (
    <div className="flex flex-col gap-6 p-8 bg-[#fcf9f8] rounded-xl border border-[#e5e2e1]">
      <h1 className="font-serif text-3xl text-[#442a22] font-bold">
        Yönetim Paneli
      </h1>
      <p className="text-sm text-[#504441]">
        Admin dashboard, ürün/sipariş/kategori yönetimi ve medya yükleme arayüzü Aşama 12 (Admin Panel) kapsamında geliştirilecektir.
      </p>
    </div>
  );
}
