import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function OrderTrackingPageShell() {
  return (
    <PageContainer className="py-16">
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-bold text-[#442a22]">
          Sipariş Takibi
        </h1>
        <p className="text-base text-[#504441] leading-relaxed">
          Takip Numarası ve Telefon Numarası ile canlı sipariş durum sorgulama sistemi Aşama 11 (Order Tracking) kapsamında aktifleşecektir.
        </p>
      </div>
    </PageContainer>
  );
}
