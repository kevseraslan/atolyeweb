import React from "react";
import { Badge } from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <main className="flex-grow pt-8 pb-24 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 order-2 md:order-1 flex flex-col gap-6">
          <Badge variant="tertiary" className="w-fit">
            Hakkımızda
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl text-[#442a22] font-bold leading-tight">
            Atölyemizin Hikayesi
          </h1>
          <p className="text-base text-[#504441] leading-relaxed">
            Ahşabın sıcaklığını ve dokusunu modern tasarımla buluşturduğumuz
            yolculuğumuz, bir marangoz tezgahında başladı. Her bir ağaç
            parçasının kendine has damar yapısını ve karakterini koruyarak,
            zamansız mobilyalar üretiyoruz.
          </p>
          <p className="text-sm text-[#504441] leading-relaxed">
            Ustalığımız, geleneksel el işçiliği tekniklerini günümüzün hassas
            üretim teknolojileriyle birleştirmekte yatıyor. Ceviz, meşe ve
            dişbudak gibi özenle seçilmiş sert ağaçlar, atölyemizde sadece bir
            mobilya değil, nesilden nesile aktarılacak birer mirasa dönüşüyor.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="inline-flex items-center bg-[#f0eded] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-[#504441]">
              <span className="material-symbols-outlined mr-2 text-[#442a22] text-sm">
                verified
              </span>{" "}
              15 Yıllık Ustalık
            </span>
            <span className="inline-flex items-center bg-[#f0eded] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-[#504441]">
              <span className="material-symbols-outlined mr-2 text-[#442a22] text-sm">
                forest
              </span>{" "}
              Sürdürülebilir Ahşap
            </span>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 relative">
          <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-ambient bg-[#e5e2e1] hover-lift">
            <img
              className="w-full h-full object-cover"
              alt="Masif ahşap zanaatkar çalışması"
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
