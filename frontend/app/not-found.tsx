import React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <PageContainer className="max-w-xl text-center">
        <div className="bg-[#fcf9f8] border border-[#e5e2e1] rounded-lg p-8 md:p-12 shadow-sm">
          <span className="font-mono text-6xl font-bold text-[#442a22] block mb-4">404</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#442a22] mb-4">
            Aradığınız Sayfa Bulunamadı
          </h1>
          <p className="text-sm text-[#504441] leading-relaxed mb-8">
            Ulaşmaya çalıştığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" className="w-full sm:w-auto">
                Ana Sayfaya Dön
              </Button>
            </Link>
            <Link href="/urunler">
              <Button variant="outline" className="w-full sm:w-auto">
                Ürün Kataloğuna Git
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
