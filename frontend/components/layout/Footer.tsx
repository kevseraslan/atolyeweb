import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f0eded] text-[#1b1c1c] mt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 px-5 md:px-16 py-16 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-serif text-2xl text-[#442a22] font-semibold">
            Artisan Woodworks
          </span>
          <p className="text-sm text-[#504441] leading-relaxed">
            Evinize özel, ustalıkla üretilen, nesilden nesile aktarılacak masif
            ahşap mobilyalar.
          </p>
        </div>

        {/* Menü */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-[#442a22] uppercase tracking-widest">
            Menü
          </h4>
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/urunler"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              Ürünler
            </Link>
            <Link
              href="/ozel-siparis"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              Özel Sipariş
            </Link>
            <Link
              href="/siparis-takip"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              Sipariş Takibi
            </Link>
          </nav>
        </div>

        {/* Kurumsal / Yasal */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-[#442a22] uppercase tracking-widest">
            Kurumsal
          </h4>
          <nav className="flex flex-col gap-3">
            <Link
              href="/hakkimizda"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="text-sm text-[#504441] hover:text-[#442a22] transition-colors"
            >
              İletişim
            </Link>
            <span className="text-sm text-[#504441]">Kullanım Koşulları</span>
            <span className="text-sm text-[#504441]">Gizlilik Politikası</span>
          </nav>
        </div>

        {/* İletişim */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-[#442a22] uppercase tracking-widest">
            İletişim
          </h4>
          <div className="flex flex-col gap-2 text-sm text-[#504441]">
            <p>
              Atölye Sokak No:123
              <br />
              Ahşap Mahallesi, İstanbul
            </p>
            <p className="mt-2 font-medium">info@artisanwoodworks.com</p>
            <p className="font-medium">+90 555 123 45 67</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d4c3be]/40 px-5 md:px-16 py-6 max-w-[1280px] mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#504441]">
          © 2026 Artisan Woodworks. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};
