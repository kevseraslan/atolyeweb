import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function CustomOrderPageShell() {
  return (
    <PageContainer className="py-16">
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-bold text-[#442a22]">
          Özel Sipariş Talebi
        </h1>
        <p className="text-base text-[#504441] leading-relaxed">
          Hayalinizdeki mobilyayı usta ellerde gerçeğe dönüştürün. Adımlı özel sipariş başvuru formu ve onay akışı Aşama 10 (Order System) kapsamında uygulanacaktır.
        </p>
      </div>
    </PageContainer>
  );
}
