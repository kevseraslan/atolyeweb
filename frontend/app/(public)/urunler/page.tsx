"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceText: string;
  imageUrl: string;
  badge?: string;
  isLarge?: boolean;
  colors: string[];
}

const mockProducts: Product[] = [
  {
    id: "1",
    slug: "ceviz-dogal-kenar-yemek-masasi",
    name: "Ceviz Doğal Kenar Yemek Masası",
    category: "Masa",
    description:
      "Tek parça ceviz kütüğünden özenle işlenmiş, doğal kenar formunu koruyan büyük boy yemek masası. Her bir parça eşsiz damar yapısına sahiptir.",
    priceText: "Fiyat için iletişime geçin",
    imageUrl:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
    badge: "El Yapımı",
    isLarge: true,
    colors: ["#5d4037", "#e7bdb1", "#303030"],
  },
  {
    id: "2",
    slug: "mese-orta-sehpa",
    name: "Meşe Orta Sehpa",
    category: "Sehpa",
    description:
      "İnce ve zarif hatlarıyla modern mekanlara uyum sağlayan, masif meşe ağacından üretilmiş minimalist orta sehpa.",
    priceText: "Fiyat için iletişime geçin",
    imageUrl:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    colors: ["#d4c3be", "#2c160e"],
  },
  {
    id: "3",
    slug: "slatted-ahsap-konsol",
    name: "Slatted Ahşap Konsol",
    category: "Konsol",
    description:
      "Mid-century modern tarzından ilham alan, sürgülü latalı kapaklarıyla hem şık hem fonksiyonel depolama ünitesi.",
    priceText: "Fiyat için iletişime geçin",
    imageUrl:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    colors: ["#442a22"],
  },
  {
    id: "4",
    slug: "acik-raf-kitaplik",
    name: "Açık Raf Kitaplık",
    category: "Kitaplık",
    description:
      "Görünmez bağlantı detaylarıyla tasarlanmış, mekanda ferahlık hissi yaratan açık raflı masif kitaplık ünitesi.",
    priceText: "Fiyat için iletişime geçin",
    imageUrl:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80",
    colors: ["#f3f0ef", "#827470"],
  },
  {
    id: "5",
    slug: "modern-calisma-masasi",
    name: "Modern Çalışma Masası",
    category: "Çalışma Masası",
    description:
      "Odaklanmanızı artıracak yalın tasarım, gizli kablo kanalları ve entegre çekmeceleriyle fonksiyonel çalışma masası.",
    priceText: "Fiyat için iletişime geçin",
    imageUrl:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    isLarge: true,
    colors: ["#77574d", "#1b1c1c"],
  },
];

const categories = [
  "Tümü",
  "Masa",
  "Sehpa",
  "TV Ünitesi",
  "Konsol",
  "Dolap",
  "Kitaplık",
  "Çalışma Masası",
  "Diğer",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filteredProducts =
    activeCategory === "Tümü"
      ? mockProducts
      : mockProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-[#442a22] font-bold mb-6">
          Ürünlerimiz
        </h1>
        <p className="text-base md:text-lg text-[#504441] max-w-2xl mx-auto leading-relaxed">
          Her bir parça, ustalarımızın ellerinden çıkan benzersiz bir sanat
          eseridir. Minimalist çizgiler, doğal dokular ve zamansız tasarım
          anlayışımızla yaşam alanlarınıza değer katıyoruz. Özel ölçü ve tasarım
          talepleriniz için lütfen iletişime geçin.
        </p>
      </section>

      {/* Filter & Sort Bar (Sticky) */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-8 sticky top-20 z-40 bg-[#fcf9f8]/95 glass-effect py-4 border-b border-[#e5e2e1]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  activeCategory === cat
                    ? "bg-[#442a22] text-white"
                    : "border border-[#d4c3be] text-[#504441] hover:border-[#442a22] hover:text-[#442a22]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#504441]">
              sort
            </span>
            <select className="bg-transparent border-none text-[#442a22] font-semibold text-xs uppercase tracking-widest focus:ring-0 cursor-pointer pl-0">
              <option value="newest">En Yeni</option>
              <option value="popular">Popüler</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 py-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`hover-lift group flex flex-col ${
                product.isLarge ? "lg:col-span-2" : ""
              }`}
            >
              <div className="relative w-full aspect-[4/3] bg-[#f6f3f2] mb-6 overflow-hidden rounded">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="tertiary">{product.badge}</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#504441] max-w-md mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    {product.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full inline-block border border-[#d4c3be]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                  <span className="text-xs font-semibold text-[#5d5f5b] uppercase tracking-widest block mb-1">
                    {product.priceText}
                  </span>
                  <Link href={`/urunler/${product.slug}`}>
                    <Button variant="primary" className="w-full">
                      İncele
                    </Button>
                  </Link>
                  <Link href="/ozel-siparis">
                    <Button variant="outline" className="w-full">
                      Sipariş Oluştur
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
