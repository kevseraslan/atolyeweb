"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    { label: "Özel Sipariş", href: "/ozel-siparis" },
    { label: "Sipariş Takip", href: "/siparis-takip" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fcf9f8]/80 glass-effect border-b border-[#e5e2e1]/50">
      <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1280px] mx-auto h-20">
        {/* Brand */}
        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl tracking-tight text-[#442a22] font-semibold"
        >
          Artisan Woodworks
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-[#442a22] border-b border-[#442a22] pb-1"
                    : "text-[#504441] hover:text-[#442a22]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/ozel-siparis"
            className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-[#442a22] text-white text-xs font-semibold tracking-widest uppercase rounded hover:bg-[#5d4037] transition-colors duration-300"
          >
            Sipariş Oluştur
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Menüyü Aç"
            className="md:hidden text-[#442a22] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fcf9f8] border-b border-[#e5e2e1] px-5 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold tracking-widest uppercase py-2 ${
                pathname === item.href ? "text-[#442a22] font-bold" : "text-[#504441]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/ozel-siparis"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 w-full text-center px-6 py-3 bg-[#442a22] text-white text-xs font-semibold tracking-widest uppercase rounded"
          >
            Sipariş Oluştur
          </Link>
        </div>
      )}
    </header>
  );
};
