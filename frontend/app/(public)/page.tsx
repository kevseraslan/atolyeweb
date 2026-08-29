import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-[#fdfbf9] border-b border-[#e5e2e1] overflow-hidden py-12 md:py-20">
        <PageContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text & CTA */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6f2ef] border border-[#d4c3be] w-fit">
                <span className="w-2 h-2 rounded-full bg-[#8d5b4c]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#442a22]">
                  Masif Ahşap Zanaatı
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#442a22] font-bold leading-[1.15]">
                Evinize Özel, Ustalıkla Üretilen Mobilyalar
              </h1>

              <p className="text-base md:text-lg text-[#504441] leading-relaxed">
                Hayalinizdeki mobilyayı ölçülerinize, tarzınıza ve renk tercihinize
                göre sizin için üretiyoruz. Yılların tecrübesiyle şekillenen
                doğal ahşap, yaşam alanlarınıza zamansız bir karakter katıyor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/urunler">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Koleksiyonu İncele
                  </Button>
                </Link>
                <Link href="/ozel-siparis">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Özel Sipariş &amp; Teklif Al
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#d4c3be]/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#442a22]">
                    ✓ Özel Ölçü
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#442a22]">
                    ✓ Cila &amp; Renk
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#442a22]">
                    ✓ El İşçiliği
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#442a22]">
                    ✓ Doğrudan Atölyeden
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Hero Illustration Visual */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#e5e2e1] bg-[#f6f2ef]">
                <Image
                  src="/visuals/hero/workshop-hero.svg"
                  alt="Özel üretim masif ahşap mobilya atölyesi ve yemek masası işçiliği"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Workshop Values & Process */}
      <section className="py-20 bg-[#ffffff] w-full border-b border-[#e5e2e1]">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-[#8d5b4c] tracking-widest uppercase">
              Üretim Felsefemiz
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#442a22] font-bold mt-2">
              Ham Ağaçtan Yaşayan Eserlere
            </h2>
            <p className="text-[#504441] text-sm md:text-base mt-3 leading-relaxed">
              Her aşamasında titizlikle çalıştığımız özel üretim sürecimiz, sizin isteklerinizle başlar ve ustalarımızın zanaatıyla tamamlanır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col gap-4 p-8 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1] hover:border-[#d4c3be] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#f0e6e0] flex items-center justify-center text-[#442a22] font-serif text-xl font-bold">
                01
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#442a22]">
                Ölçü &amp; Tasarım Talebi
              </h3>
              <p className="text-sm text-[#504441] leading-relaxed">
                Mekanınıza en uygun ebatları, cila tonunu ve ahşap türünü belirleyin veya hayalinizdeki özel modeli bize iletin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 p-8 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1] hover:border-[#d4c3be] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#f0e6e0] flex items-center justify-center text-[#442a22] font-serif text-xl font-bold">
                02
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#442a22]">
                Masif Ahşap Seçimi
              </h3>
              <p className="text-sm text-[#504441] leading-relaxed">
                Meşe, ceviz, kestane ve dişbudak gibi dayanıklı ve doğal dokulu masif ağaçları titizlikle seçip hazırlıyoruz.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 p-8 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1] hover:border-[#d4c3be] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#f0e6e0] flex items-center justify-center text-[#442a22] font-serif text-xl font-bold">
                03
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#442a22]">
                Usta El İşçiliği &amp; Teslimat
              </h3>
              <p className="text-sm text-[#504441] leading-relaxed">
                Geleneksel birleştirme teknikleri ve doğal koruyucu yağlarla işlenen ürününüz, sipariş takip güvencesiyle teslim edilir.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Workshop Story Presentation */}
      <section className="py-20 bg-[#fcf9f8] w-full">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 flex flex-col gap-6">
              <span className="text-xs font-semibold text-[#8d5b4c] tracking-widest uppercase">
                Atölyemiz
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#442a22] font-semibold leading-tight">
                Mobilyadan Daha Fazlasını, Yaşayan Hikayeler Üretiyoruz
              </h2>
              <p className="text-base text-[#504441] leading-relaxed">
                Her ağacın kendine has bir dokusu, damar yapısı ve hikayesi vardır. Biz bu hikayeyi saygıyla işliyor,
                yaşam alanlarınıza sıcaklık ve karakter katan, nesiller boyu
                kullanılacak kalıcı eserlere dönüştürüyoruz.
              </p>
              <div>
                <Link href="/hakkimizda">
                  <Button variant="outline" size="md">
                    Hikayemizi Okuyun
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl relative shadow-md border border-[#e5e2e1] bg-[#f6f2ef]">
                <Image
                  src="/visuals/illustrations/craftsman-story.svg"
                  alt="Zanaatkar ahşap işçiliği ve marangoz tezgahı rende çalışması"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
