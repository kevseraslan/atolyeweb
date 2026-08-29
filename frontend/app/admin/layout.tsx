"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminMe, logoutAdmin } from "@/features/admin/api";
import { AdminUser } from "@/features/admin/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let isMounted = true;
    if (isLoginPage) {
      return;
    }

    getAdminMe()
      .then((user) => {
        if (isMounted) {
          setAdmin(user);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          router.push("/admin/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading && !admin) {
    return (
      <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center p-4 text-[#442a22] font-semibold">
        Yönetim paneli yükleniyor...
      </div>
    );
  }

  const navItems = [
    { label: "Özet Paneli", href: "/admin", icon: "📊" },
    { label: "Siparişler & Teklifler", href: "/admin/siparisler", icon: "📦" },
    { label: "Ürünler", href: "/admin/urunler", icon: "🪑" },
    { label: "Kategoriler", href: "/admin/kategoriler", icon: "📁" },
    { label: "Renkler & Dokular", href: "/admin/renkler", icon: "🎨" },
    { label: "Ahşap & Malzemeler", href: "/admin/malzemeler", icon: "🪵" },
    { label: "Site Ayarları", href: "/admin/ayarlar", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f3f2] flex flex-col md:flex-row text-[#1b1c1c]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#442a22] text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-[#59392e]">
          <Link href="/admin" className="font-serif text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 bg-white text-[#442a22] rounded flex items-center justify-center text-sm">AW</span>
            <span>Yönetim Paneli</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#2c1b16] text-white font-semibold"
                    : "text-[#d4c3be] hover:bg-[#36211b] hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#59392e] bg-[#36211b] flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="block text-xs font-semibold truncate text-white">
              {admin?.full_name || "Admin"}
            </span>
            <span className="block text-[10px] text-[#b3a39e] truncate">{admin?.email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-[#d4c3be] hover:text-white transition-colors"
            title="Oturumu Kapat"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
