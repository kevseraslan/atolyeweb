"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function ContactPage() {
  return (
    <PageContainer className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="font-serif text-4xl md:text-5xl text-[#442a22] font-bold">
            Bize Ulaşın
          </h1>
          <p className="text-base text-[#504441] leading-relaxed">
            Atölyemizi ziyaret etmek veya projelerinizi konuşmak için bizimle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#504441]">
            <p className="font-semibold text-[#442a22]">Artisan Woodworks Atölyesi</p>
            <p>İstanbul, Türkiye</p>
          </div>
        </div>

        <div className="bg-[#fcf9f8] p-8 rounded-xl border border-[#e5e2e1] shadow-sm">
          <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-6">
            Mesaj Gönderin
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Ad Soyad" placeholder="Adınız Soyadınız" />
            <Input label="E-posta" type="email" placeholder="eposta@example.com" />
            <Textarea label="Mesajınız" rows={4} placeholder="Mesajınızı buraya yazabilirsiniz..." />
            <Button variant="primary" type="button" className="w-full py-3">
              Gönder
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
