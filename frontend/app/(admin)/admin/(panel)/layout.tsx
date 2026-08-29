import React from "react";
import Link from "next/link";

export default function AdminPanelLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#f6f3f2]">
      {/* Minimal Admin Sidebar */}
      <aside className="w-64 bg-[#442a22] text-white flex flex-col justify-between p-6">
        <div>
          <div className="mb-8">
            <Link href="/admin" className="font-serif text-2xl font-bold">
              Artisan
            </Link>
            <span className="block text-[10px] uppercase tracking-widest text-[#ffdbd0]">
              Admin Panel Shell
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="px-4 py-3 rounded text-xs font-semibold uppercase tracking-widest bg-[#5d4037] text-white"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-[#5d4037]">
          <Link
            href="/admin/login"
            className="text-xs font-semibold uppercase tracking-widest text-[#ffdbd0] hover:text-white"
          >
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
        </header>

        <main className="p-8 flex-grow overflow-auto">{children}</main>
      </div>
    </div>
  );
}
