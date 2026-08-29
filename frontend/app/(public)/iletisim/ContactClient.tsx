"use client";

import React from "react";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ContactClient() {
  return (
    <PageContainer className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Info & Workshop Illustration */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <span className="text-xs font-semibold text-[#8d5b4c] tracking-widest uppercase">
            İletişim &amp; Randevu
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#442a22] font-bold">
            Atölyemize Ulaşın
          </h1>
          <p className="text-base text-[#504441] leading-relaxed">
            Özel sipariş fikirlerinizi, ölçülerinizi ve mobilya projelerinizi görüşmek için mesaj bırakabilir veya atölyemize uğrayabilirsiniz.
          </p>

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#e5e2e1] bg-[#f6f2ef]">
            <Image
              src="/visuals/illustrations/contact-atelier.svg"
              alt="Ahşap mobilya atölyesi vitrini ve çalışma alanı"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-6 bg-[#fcf9f8] p-8 md:p-10 rounded-2xl border border-[#e5e2e1] shadow-sm">
          <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
            Mesaj Gönderin
          </h2>
          <p className="text-sm text-[#504441] mb-6">
            Talebinizi aldıktan sonra ustalarımız en kısa sürede sizinle iletişime geçecektir.
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Ad Soyad" placeholder="Adınız Soyadınız" />
            <Input label="Telefon veya E-posta" placeholder="0532 123 45 67 veya eposta@example.com" />
            <Textarea
              label="Mesajınız / Proje Detayı"
              rows={4}
              placeholder="Mobilya türü, istediğiniz ağaç cinsi veya merak ettiklerinizi buraya yazabilirsiniz..."
            />
            <Button variant="primary" type="button" className="w-full py-3.5 text-base">
              Mesajı İlet
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
