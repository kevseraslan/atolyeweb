import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailShell({ params }: ProductDetailProps) {
  const resolvedParams = React.use(params);

  return (
    <PageContainer className="py-16">
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
        <span className="text-xs uppercase tracking-widest text-[#827470] font-semibold">
          Ürün Detayı Shell ({resolvedParams.slug})
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">
          Ürün Detayı
        </h1>
        <p className="text-base text-[#504441] leading-relaxed">
          Ürün görsel galerisi, renk/cila seçenekleri ve ölçü konfigüratörü Aşama 8 (Product System) kapsamında veritabanı entegrasyonu ile aktifleşecektir.
        </p>
      </div>
    </PageContainer>
  );
}
