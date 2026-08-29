import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductListItem } from "../types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: ProductListItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23f0eded'/><text x='50%' y='50%' font-family='serif' font-size='24' fill='%23442a22' text-anchor='middle' dy='.3em'>Özel Mobilya Atölyesi</text></svg>";

  const imageUrl = product.primary_image?.secure_url || fallbackImage;
  const isDataUri = imageUrl.startsWith("data:");

  return (
    <article className="hover-lift group flex flex-col bg-[#fcf9f8] rounded border border-[#e5e2e1] overflow-hidden">
      <div className="relative w-full aspect-[4/3] bg-[#f6f3f2] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.primary_image?.alt_text || product.name}
          fill
          unoptimized={isDataUri}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge variant="tertiary">{product.category.name}</Badge>
          {product.is_featured && <Badge variant="primary">Öne Çıkan</Badge>}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-[#442a22] font-semibold mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-[#504441] leading-relaxed line-clamp-2 mb-4">
            {product.short_description || "Özel üretim masif ahşap mobilya."}
          </p>

          {/* Color Swatch Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase font-semibold text-[#827470]">
                Renkler:
              </span>
              {product.colors.map((color) => (
                <span
                  key={color.id}
                  title={color.name}
                  className="w-3.5 h-3.5 rounded-full inline-block border border-[#d4c3be]"
                  style={{
                    backgroundColor: color.hex_code || "#5d4037",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-[#e5e2e1]">
          <Link href={`/urunler/${product.slug}`} className="w-full">
            <Button variant="primary" className="w-full">
              İncele
            </Button>
          </Link>
          <Link href="/ozel-siparis" className="w-full">
            <Button variant="outline" className="w-full">
              Özel Sipariş Oluştur
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};
