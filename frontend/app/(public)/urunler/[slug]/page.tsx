/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/products/api";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80";

  const primaryImg = product.images.find((img) => img.is_primary) || product.images[0];
  const mainImageUrl = primaryImg?.secure_url || fallbackImage;

  return (
    <main className="flex-grow pt-8 pb-24">
      <PageContainer>
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Product Images Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] bg-[#f0eded] relative overflow-hidden rounded shadow-sm">
              <img
                src={mainImageUrl}
                alt={primaryImg?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square bg-[#f0eded] rounded overflow-hidden shadow-sm"
                  >
                    <img
                      src={img.secure_url}
                      alt={img.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Product Specification */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="tertiary">{product.category.name}</Badge>
                {product.is_featured && <Badge variant="primary">Öne Çıkan</Badge>}
                {product.is_customizable && (
                  <Badge variant="secondary">Özel Ölçüye Uygun</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-[#1b1c1c] font-semibold mb-4">
                {product.name}
              </h1>

              <p className="text-sm md:text-base text-[#504441] leading-relaxed mb-6">
                {product.description || product.short_description || "Özel üretim masif ahşap mobilya."}
              </p>

              {/* Default Dimensions */}
              {(product.default_width || product.default_height || product.default_depth) && (
                <div className="border-t border-[#e5e2e1] pt-6 mb-6">
                  <h4 className="text-xs font-semibold text-[#504441] uppercase tracking-widest mb-3">
                    Varsayılan Ölçüler (cm)
                  </h4>
                  <div className="grid grid-cols-3 gap-4 bg-[#f6f3f2] p-4 rounded text-center">
                    <div>
                      <span className="text-[10px] uppercase text-[#827470] block">Genişlik</span>
                      <span className="font-semibold text-sm text-[#442a22]">
                        {product.default_width ? `${product.default_width} cm` : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#827470] block">Derinlik</span>
                      <span className="font-semibold text-sm text-[#442a22]">
                        {product.default_depth ? `${product.default_depth} cm` : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#827470] block">Yükseklik</span>
                      <span className="font-semibold text-sm text-[#442a22]">
                        {product.default_height ? `${product.default_height} cm` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="border-t border-[#e5e2e1] pt-6 mb-6">
                  <h4 className="text-xs font-semibold text-[#504441] uppercase tracking-widest mb-3">
                    Mevcut Renk & Cila Seçenekleri
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f6f3f2] rounded text-xs font-medium text-[#1b1c1c] border border-[#d4c3be]"
                      >
                        {c.hex_code && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-[#d4c3be]"
                            style={{ backgroundColor: c.hex_code }}
                          />
                        )}
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="border-t border-[#e5e2e1] pt-6 mb-6">
                  <h4 className="text-xs font-semibold text-[#504441] uppercase tracking-widest mb-3">
                    Malzeme Seçenekleri
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((m) => (
                      <span
                        key={m.id}
                        className="px-3 py-1.5 bg-[#f0eded] rounded text-xs font-medium text-[#442a22]"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Order CTA */}
            <div className="pt-6 border-t border-[#e5e2e1] flex flex-col gap-3">
              <Link href="/ozel-siparis" className="w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Bu Ürün İçin Sipariş Oluştur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
