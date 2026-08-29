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
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80"
            />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
