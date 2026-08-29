import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProductsPageShell() {
  return (
    <PageContainer className="py-16">
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-bold text-[#442a22]">
          Ürünlerimiz
        </h1>
        <p className="text-base text-[#504441] leading-relaxed">
          Atölyemizde özenle üretilen özel masif mobilya kataloğumuz Aşama 8 (Product System) kapsamında dinamik olarak yayınlanacaktır.
        </p>
      </div>
    </PageContainer>
  );
}
