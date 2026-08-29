/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Presentation Shell */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-5 md:px-16 py-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center bg-no-repeat w-full h-full absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><rect width='100%' height='100%' fill='%23f0eded'/><text x='50%' y='50%' font-family='serif' font-size='48' fill='%23442a22' text-anchor='middle' dy='.3em'>Masif Ahşap Mobilya Atölyesi</text></svg>\")",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8]/95 via-[#fcf9f8]/80 to-[#fcf9f8]/40 md:w-3/4" />
        </div>

        <PageContainer className="relative z-10">
          <div className="max-w-2xl flex flex-col gap-6">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#442a22] font-bold leading-tight">
              Evinize Özel, Ustalıkla Üretilen Mobilyalar
            </h1>
            <p className="text-base md:text-lg text-[#504441] leading-relaxed">
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
                <span className="text-xs font-semibold uppercase tracking-widest text-[#442a22]">
                  • Özel Ölçü
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#442a22]">
                  • Renk Seçimi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#442a22]">
                  • El İşçiliği
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#442a22]">
                  • Atölyeden
                </span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Workshop Story Presentation Shell */}
      <section className="py-20 bg-[#fcf9f8] w-full">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 flex flex-col gap-6">
              <span className="text-xs font-semibold text-[#442a22] tracking-widest uppercase">
                Atölyemiz
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#442a22] font-semibold">
                Mobilyadan Daha Fazlasını Üretiyoruz
              </h2>
              <p className="text-base text-[#504441] leading-relaxed">
                Her ağacın bir hikayesi vardır. Biz bu hikayeyi saygıyla işliyor,
                yaşam alanlarınıza sıcaklık ve karakter katan, nesiller boyu
                kullanılacak kalıcı eserlere dönüştürüyoruz.
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="aspect-[4/3] overflow-hidden rounded-lg relative shadow-sm bg-[#e5e2e1]">
                <img
                  className="object-cover w-full h-full"
                  alt="Zanaatkar ahşap çalışması"
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='750' viewBox='0 0 1000 750'><rect width='100%' height='100%' fill='%23e5e2e1'/><text x='50%' y='50%' font-family='serif' font-size='28' fill='%23442a22' text-anchor='middle' dy='.3em'>Artisan Woodworks Atölyesi</text></svg>"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
