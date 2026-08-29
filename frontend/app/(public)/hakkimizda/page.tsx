/* eslint-disable @next/next/no-img-element */
import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <PageContainer className="py-16">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 flex flex-col gap-6">
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
        </div>

        <div className="md:col-span-6">
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm bg-[#e5e2e1]">
            <img
              className="w-full h-full object-cover"
              alt="Masif ahşap zanaatkar çalışması"
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='750' viewBox='0 0 1000 750'><rect width='100%' height='100%' fill='%23e5e2e1'/><text x='50%' y='50%' font-family='serif' font-size='28' fill='%23442a22' text-anchor='middle' dy='.3em'>Artisan Woodworks Atölyesi</text></svg>"
            />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
