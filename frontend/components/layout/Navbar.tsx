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
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl tracking-tight text-[#442a22] font-semibold"
        >
          Artisan Woodworks
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-[#442a22] border-b-2 border-[#442a22] pb-1"
                    : "text-[#504441] hover:text-[#442a22]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
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
            className="md:hidden text-[#442a22] p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fcf9f8] border-b border-[#e5e2e1] px-5 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold tracking-widest uppercase py-2 ${
                pathname === item.href
                  ? "text-[#442a22] font-bold"
                  : "text-[#504441]"
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
