import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-5 md:px-16 py-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center bg-no-repeat w-full h-full absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1920&q=80')",
            }}
          />
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8]/95 via-[#fcf9f8]/80 to-[#fcf9f8]/40 md:w-3/4" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col justify-center gap-6">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#442a22] font-bold leading-tight">
              Evinize Özel, Ustalıkla Üretilen Mobilyalar
            </h1>
            <p className="text-lg md:text-xl text-[#504441] max-w-2xl leading-relaxed">
              Hayalinizdeki mobilyayı ölçülerinize, tarzınıza ve renk tercihinize
              göre sizin için üretiyoruz. Yılların tecrübesiyle şekillenen
              ahşap, yaşam alanlarınıza ruh katıyor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/urunler">
                <Button variant="primary" size="lg">
                  Ürünleri İncele
                </Button>
              </Link>
              <Link href="/ozel-siparis">
                <Button variant="outline" size="lg">
                  Özel Sipariş Oluştur
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-4 border-t border-[#d4c3be]/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-xl">
                  straighten
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#504441]">
                  Özel Ölçü
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-xl">
                  palette
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#504441]">
                  Renk Seçimi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-xl">
                  handyman
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#504441]">
                  El İşçiliği
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-xl">
                  storefront
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#504441]">
                  Atölyeden
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Introduction Section */}
      <section className="px-5 md:px-16 py-24 max-w-[1280px] mx-auto bg-[#fcf9f8] w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex flex-col gap-6 order-2 md:order-1">
            <span className="text-xs font-semibold text-[#442a22] tracking-widest uppercase">
              Atölyemiz
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#442a22] font-semibold">
              Mobilyadan Daha Fazlasını Üretiyoruz
            </h2>
            <p className="text-base text-[#504441] leading-relaxed">
              Her ağacın bir hikayesi vardır. Biz bu hikayeyi saygıyla işliyor,
              yaşam alanlarınıza sıcaklık ve karakter katan, nesiller boyu
              kullanılacak kalıcı eserlere dönüştürüyoruz. Seri üretimden uzak,
              her parçası tek ve size özel.
            </p>

            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#442a22] mt-1 text-xl">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-[#442a22]">
                    Yılların Ustalığı
                  </span>
                  <span className="text-sm text-[#504441]">
                    Geleneksel ahşap işleme teknikleriyle modern tasarımı
                    harmanlıyoruz.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#442a22] mt-1 text-xl">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-[#442a22]">
                    Kaliteli Malzeme
                  </span>
                  <span className="text-sm text-[#504441]">
                    Sadece özenle seçilmiş, sürdürülebilir kaynaklardan elde
                    edilen masif ahşap kullanıyoruz.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#442a22] mt-1 text-xl">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-[#442a22]">
                    Kişiye Özel Tasarım & Ölçü
                  </span>
                  <span className="text-sm text-[#504441]">
                    Mekanınıza tam uyum sağlayacak, istekleriniz doğrultusunda
                    şekillenen tasarımlar.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7 relative order-1 md:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-lg relative shadow-md">
              <img
                className="object-cover w-full h-full"
                alt="Masif ahşap işleyen zanaatkar usta"
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#f0eded] rounded-full opacity-50 blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
