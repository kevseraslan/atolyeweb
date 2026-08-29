"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Ürünler", href: "/admin/urunler", icon: "chair" },
    { label: "Siparişler", href: "/admin/siparisler", icon: "orders" },
    { label: "Kategoriler", href: "/admin/kategoriler", icon: "category" },
    { label: "Renkler", href: "/admin/renkler", icon: "palette" },
    { label: "Malzemeler", href: "/admin/malzemeler", icon: "texture" },
    { label: "Ayarlar", href: "/admin/ayarlar", icon: "settings" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f6f3f2]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#442a22] text-white flex flex-col justify-between p-6">
        <div>
          <div className="mb-10">
            <Link href="/admin" className="font-serif text-2xl font-bold">
              Artisan
            </Link>
            <span className="block text-[10px] uppercase tracking-widest text-[#ffdbd0]">
              Yönetim Paneli
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-widest transition-colors ${
                    isActive
                      ? "bg-[#5d4037] text-white"
                      : "text-[#d4c3be] hover:bg-[#5d4037]/50 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#5d4037]">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#ffdbd0] hover:text-white"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Çıkış Yap
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-[#fcf9f8] border-b border-[#e5e2e1] flex items-center justify-between px-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#442a22]">
            Yönetim Paneli
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#504441]">Yönetici (Admin)</span>
          </div>
        </header>

        <main className="p-8 flex-grow overflow-auto">{children}</main>
      </div>
    </div>
  );
}
