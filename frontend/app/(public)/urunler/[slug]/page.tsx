"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  // Unwrap params asynchronously for Next.js 15+
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [selectedColor, setSelectedColor] = useState("Ceviz");
  const [selectedMaterial, setSelectedMaterial] = useState("Masif Ahşap");
  const [width, setWidth] = useState("180");
  const [depth, setDepth] = useState("90");
  const [height] = useState("75");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("desc");

  const colors = [
    { name: "Ceviz", hex: "#5C4033" },
    { name: "Meşe", hex: "#A08159" },
    { name: "Siyah", hex: "#1A1A1A" },
    { name: "Beyaz", hex: "#F5F5F5" },
    { name: "Antrasit", hex: "#383E42" },
    { name: "Naturel", hex: "#D4C3BE" },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=600&q=80",
  ];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  return (
    <main className="flex-grow pt-8 pb-24 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-[#f0eded] relative overflow-hidden rounded">
            <img
              src={activeImage}
              alt="Masif Ahşap Yemek Masası"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square bg-[#f0eded] cursor-pointer overflow-hidden rounded transition-opacity ${
                  activeImage === img
                    ? "border-2 border-[#442a22] opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Detay ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details & Configurator */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <Badge variant="tertiary" className="mb-4">
              Yemek Odası
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1b1c1c] font-semibold mb-4">
              Masif Ahşap Yemek Masası
            </h1>
            <p className="text-sm md:text-base text-[#504441] leading-relaxed mb-6">
              Doğal ahşabın sıcaklığını ve zamansız zarafetini yaşam alanınıza
              taşıyan, tamamen el işçiliği ile üretilmiş premium yemek masası. Her
              bir parça eşsiz ahşap damarlarına sahiptir.
            </p>
          </div>

          {/* Configurators */}
          <div className="flex flex-col gap-8 mb-8 border-t border-[#e5e2e1] pt-8">
            {/* Color Swatch */}
            <div>
              <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-4">
                Renk / Cila ({selectedColor})
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-10 h-10 rounded-full border border-[#d4c3be] transition-all relative ${
                      selectedColor === c.name
                        ? "ring-2 ring-offset-2 ring-[#442a22]"
                        : "hover:scale-105"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-4">
                Malzeme (Tabla)
              </label>
              <div className="flex gap-3">
                {["Masif Ahşap", "MDF Üzeri Kaplama"].map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-5 py-3 border text-sm font-medium rounded transition-colors ${
                      selectedMaterial === mat
                        ? "border-[#442a22] text-[#442a22] bg-[#fcf9f8]"
                        : "border-[#d4c3be] text-[#504441] hover:border-[#827470]"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-[#504441] uppercase tracking-widest mb-4">
                Ölçüler (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#504441] mb-1 block">
                    Genişlik
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full border-b border-[#d4c3be] bg-transparent py-2 focus:ring-0 focus:border-[#442a22] text-sm text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#504441] mb-1 block">
                    Derinlik
                  </label>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full border-b border-[#d4c3be] bg-transparent py-2 focus:ring-0 focus:border-[#442a22] text-sm text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#504441] mb-1 block">
                    Yükseklik
                  </label>
                  <input
                    type="number"
                    value={height}
                    readOnly
                    className="w-full border-b border-[#d4c3be] bg-transparent py-2 focus:ring-0 text-sm text-[#504441]"
                  />
                </div>
              </div>
            </div>

            {/* Actions & Price Indicator */}
            <div className="pt-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center border border-[#d4c3be] rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-[#504441] hover:text-[#442a22]"
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-[#504441] hover:text-[#442a22]"
                  >
                    +
                  </button>
                </div>

                <div className="text-right flex-grow">
                  <span className="block text-xs text-[#504441] mb-1">
                    Tahmini Üretim: 4-6 Hafta
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#442a22]">
                    ₺24.500
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/ozel-siparis">
                  <Button variant="primary" size="lg" className="w-full">
                    Bu Ürün İçin Sipariş Oluştur
                  </Button>
                </Link>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/905551234567?text=Merhaba,%20${encodeURIComponent(
                      slug
                    )}%20hakkinda%20bilgi%20almak%20istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 border border-[#442a22] text-[#442a22] py-4 text-xs font-semibold tracking-widest uppercase rounded hover:bg-[#f0eded] transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      chat
                    </span>{" "}
                    WhatsApp'tan Bilgi Al
                  </a>
                  <Link
                    href="/ozel-siparis"
                    className="w-1/2 border border-[#d4c3be] text-[#504441] py-4 text-xs font-semibold tracking-widest uppercase rounded hover:border-[#442a22] hover:text-[#442a22] transition-colors text-center"
                  >
                    Özel Ölçü Talep Et
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Details */}
      <div className="mt-20 max-w-[800px] mx-auto border-t border-[#e5e2e1]">
        <div className="border-b border-[#e5e2e1]">
          <button
            onClick={() =>
              setOpenAccordion(openAccordion === "desc" ? null : "desc")
            }
            className="w-full flex justify-between items-center py-6 text-left"
          >
            <span className="font-serif text-xl font-semibold text-[#1b1c1c]">
              Ürün Açıklaması
            </span>
            <span className="material-symbols-outlined text-[#827470]">
              {openAccordion === "desc" ? "expand_less" : "expand_more"}
            </span>
          </button>
          {openAccordion === "desc" && (
            <div className="pb-6 text-sm text-[#504441] leading-relaxed">
              <p>
                Modern yaşam alanları için tasarlanmış bu masif ahşap yemek
                masası, yalın çizgileri ve doğal dokusuyla dikkat çekiyor. Her bir
                masa, sürdürülebilir ormanlardan elde edilen birinci sınıf
                keresteler kullanılarak ustalarımız tarafından özenle
                üretilmektedir.
              </p>
            </div>
          )}
        </div>

        <div className="border-b border-[#e5e2e1]">
          <button
            onClick={() =>
              setOpenAccordion(openAccordion === "mat" ? null : "mat")
            }
            className="w-full flex justify-between items-center py-6 text-left"
          >
            <span className="font-serif text-xl font-semibold text-[#504441]">
              Malzeme ve Bakım
            </span>
            <span className="material-symbols-outlined text-[#827470]">
              {openAccordion === "mat" ? "expand_less" : "expand_more"}
            </span>
          </button>
          {openAccordion === "mat" && (
            <div className="pb-6 text-sm text-[#504441] leading-relaxed">
              <p>
                Birinci sınıf masif ahşap kullanılmıştır. Nemli bez ile temizlenmesi
                ve doğrudan güneş ışığı ile uzun süreli temastan kaçınılması
                önerilir.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
