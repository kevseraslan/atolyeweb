import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { getCategories, getProducts } from "@/features/products/api";
import { CategoryFilterBar } from "@/features/products/components/CategoryFilterBar";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Özel Mobilya Modelleri & Ahşap Koleksiyonu",
  description:
    "Masif meşe, ceviz ve kestane ağacından üretilmiş yemek masası, konsol, sehpa ve sandalye koleksiyonunu inceleyin.",
  alternates: {
    canonical: `${siteUrl}/urunler`,
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || "";
  const page = parseInt(resolvedParams.page || "1", 10);

  const [categories, productsData] = await Promise.all([
    getCategories(),
    getProducts({ category: categorySlug, page, pageSize: 12 }),
  ]);

  return (
    <div className="w-full">
      {/* Page Header */}
      <PageContainer className="py-16 text-center">
        <span className="text-xs font-semibold text-[#8d5b4c] tracking-widest uppercase mb-2 block">
          El Yapımı Koleksiyon
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#442a22] font-bold mb-6">
          Ürünlerimiz
        </h1>
        <p className="text-base md:text-lg text-[#504441] max-w-2xl mx-auto leading-relaxed">
          Her bir parça, ustalarımızın ellerinden çıkan benzersiz bir zanaat
          eseridir. Doğal ağaç dokuları, özel ölçü seçenekleri ve zamansız tasarım
          anlayışımızla yaşam alanlarınıza değer katıyoruz.
        </p>
      </PageContainer>

      {/* Category Filter Bar */}
      <Suspense fallback={null}>
        <CategoryFilterBar categories={categories} />
      </Suspense>

      {/* Products Grid */}
      <PageContainer className="pb-24">
        {productsData.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[#fcf9f8] rounded-2xl border border-[#e5e2e1] max-w-lg mx-auto">
            <div className="w-48 h-36 relative mb-4">
              <Image
                src="/visuals/illustrations/empty-products.svg"
                alt="Henüz ürün bulunmuyor"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-serif text-xl text-[#442a22] font-semibold mb-2">
              Bu Kategoride Henüz Ürün Yok
            </h3>
            <p className="text-[#504441] text-sm leading-relaxed mb-6">
              Aradığınız model katalogda henüz listelenmemiş olabilir. Atölyemizde size özel ölçü ve modelde üretim yapabiliriz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/urunler">
                <Button variant="outline" size="sm">
                  Tüm Ürünleri Gör
                </Button>
              </Link>
              <Link href="/ozel-siparis">
                <Button variant="primary" size="sm">
                  Özel Sipariş Oluştur
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsData.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
