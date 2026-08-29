"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getProducts } from "@/features/products/api";
import { ProductListItem, Color, Material } from "@/features/products/types";
import { createOrder, getActiveColors, getActiveMaterials } from "@/features/orders/api";
import { OrderCreatedResponse } from "@/features/orders/types";

export function SpecialOrderClient() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [selectionType, setSelectionType] = useState<"catalog" | "custom">("catalog");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [customProductName, setCustomProductName] = useState("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [customNote, setCustomNote] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // Status & Response
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderCreatedResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, colData, matData] = await Promise.all([
          getProducts({ pageSize: 100 }),
          getActiveColors(),
          getActiveMaterials(),
        ]);
        setProducts(prodData.items);
        setColors(colData);
        setMaterials(matData);
        if (prodData.items.length > 0) {
          setSelectedProductId(prodData.items[0].id);
        }
      } catch (err) {
        console.error("Failed to load order form options:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const availableColors = selectedProduct && selectedProduct.colors.length > 0
    ? selectedProduct.colors
    : colors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectionType === "catalog" && !selectedProductId) {
      setErrorMessage("Lütfen bir katalog ürünü seçiniz.");
      return;
    }
    if (selectionType === "custom" && !customProductName.trim()) {
      setErrorMessage("Lütfen özel ürün adını giriniz.");
      return;
    }
    if (!customerName.trim() || !phone.trim() || !city.trim()) {
      setErrorMessage("Lütfen Ad Soyad, Telefon ve Şehir alanlarını doldurunuz.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createOrder({
        product_id: selectionType === "catalog" ? selectedProductId : null,
        custom_product_name: selectionType === "custom" ? customProductName.trim() : null,
        color_id: selectedColorId,
        material_id: selectedMaterialId,
        requested_width: width ? parseFloat(width) : null,
        requested_height: height ? parseFloat(height) : null,
        requested_depth: depth ? parseFloat(depth) : null,
        quantity: quantity || 1,
        custom_note: customNote.trim() || null,
        customer_name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        city: city.trim(),
      });
      setOrderResult(res);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Talebiniz gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingNumber = () => {
    if (orderResult) {
      navigator.clipboard.writeText(orderResult.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (orderResult) {
    return (
      <div className="w-full py-16">
        <PageContainer className="max-w-2xl">
          <div className="bg-[#fcf9f8] border border-[#e5e2e1] rounded-lg p-8 md:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#442a22] text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Badge variant="primary" className="mb-4">Talebiniz Alındı</Badge>
            <h1 className="font-serif text-3xl font-bold text-[#442a22] mb-4">
              Sipariş Talebiniz Başarıyla Oluşturuldu
            </h1>
            <p className="text-sm md:text-base text-[#504441] leading-relaxed mb-8">
              Atölye ekibimiz talebinizi inceleyecek ve belirtmiş olduğunuz iletişim numarası üzerinden en kısa sürede sizinle iletişime geçecektir.
            </p>

            {/* Tracking Number Box */}
            <div className="bg-[#f6f3f2] border border-[#d4c3be] p-6 rounded-md mb-8">
              <span className="text-xs uppercase font-semibold text-[#827470] tracking-widest block mb-2">
                Sipariş Takip Numarası
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-[#442a22]">
                  {orderResult.tracking_number}
                </span>
                <button
                  type="button"
                  onClick={copyTrackingNumber}
                  className="px-3 py-1 bg-[#442a22] text-white text-xs font-semibold rounded hover:bg-[#2c1b16] transition-colors"
                >
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </button>
              </div>
              <p className="text-xs text-[#827470] mt-3">
                Siparişinizin durumunu sorgulamak için bu takip numarasını saklayınız.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/siparis-takip">
                <Button variant="primary" className="w-full sm:w-auto">
                  Sipariş Durumu Sorgula
                </Button>
              </Link>
              <Link href="/urunler">
                <Button variant="outline" className="w-full sm:w-auto">
                  Kataloğa Dön
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="w-full py-16">
      <PageContainer className="max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3">Özel Üretim & Teklif Talebi</Badge>
          <h1 className="font-serif text-3xl md:text-5xl text-[#442a22] font-bold mb-4">
            Evinize Özel Mobilya Siparişi
          </h1>
          <p className="text-base text-[#504441] max-w-2xl mx-auto leading-relaxed">
            Hayalinizdeki mobilyayı istediğiniz ölçü, ahşap ve cila seçeneği ile üretiyoruz. Formu doldurarak ücretsiz fiyat teklifi alabilirsiniz.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#fcf9f8] border border-[#e5e2e1] rounded-lg p-6 md:p-10 shadow-sm flex flex-col gap-8">
          {/* Section 1: Product Choice */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#442a22] mb-4 border-b border-[#e5e2e1] pb-2">
              1. Ürün Seçimi
            </h3>
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-[#442a22] cursor-pointer">
                <input
                  type="radio"
                  name="selectionType"
                  value="catalog"
                  checked={selectionType === "catalog"}
                  onChange={() => setSelectionType("catalog")}
                  className="accent-[#442a22]"
                />
                Katalog Ürünlerinden Seç
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-[#442a22] cursor-pointer">
                <input
                  type="radio"
                  name="selectionType"
                  value="custom"
                  checked={selectionType === "custom"}
                  onChange={() => setSelectionType("custom")}
                  className="accent-[#442a22]"
                />
                Özel Tasarım / Fikir
              </label>
            </div>

            {selectionType === "catalog" ? (
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] tracking-wider mb-2">
                  Katalog Ürünü
                </label>
                {loadingInitial ? (
                  <p className="text-sm text-[#827470]">Yükleniyor...</p>
                ) : (
                  <select
                    value={selectedProductId || ""}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category.name})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] tracking-wider mb-2">
                  Özel Ürün Adı / Açıklaması *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 8 Kişilik Masif Meşe Oval Yemek Masası"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
                />
              </div>
            )}
          </div>

          {/* Section 2: Dimensions & Quantity */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#442a22] mb-4 border-b border-[#e5e2e1] pb-2">
              2. İstenen Ölçüler (cm) & Adet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Genişlik (cm)</label>
                <input
                  type="number"
                  placeholder="180"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Yükseklik (cm)</label>
                <input
                  type="number"
                  placeholder="75"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Derinlik (cm)</label>
                <input
                  type="number"
                  placeholder="90"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Adet *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Color & Material Options */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#442a22] mb-4 border-b border-[#e5e2e1] pb-2">
              3. Renk, Cila & Malzeme Seçimi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-2">Renk / Cila Seçeneği</label>
                <select
                  value={selectedColorId || ""}
                  onChange={(e) => setSelectedColorId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                >
                  <option value="">Seçim Yapılmadı (Atölye Önerisi)</option>
                  {availableColors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-2">Ahşap / Malzeme Türü</label>
                <select
                  value={selectedMaterialId || ""}
                  onChange={(e) => setSelectedMaterialId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                >
                  <option value="">Seçim Yapılmadı (Masif Ahşap)</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Details & Note */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#442a22] mb-4 border-b border-[#e5e2e1] pb-2">
              4. Detaylar & Özel İstekler
            </h3>
            <textarea
              rows={4}
              placeholder="Mobilyada istediğiniz özel detaylar, bacak modeli, kenar pahtı veya özel notlarınız..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
            />
          </div>

          {/* Section 5: Contact Information */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#442a22] mb-4 border-b border-[#e5e2e1] pb-2">
              5. İletişim Bilgileriniz
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Telefon *</label>
                <input
                  type="text"
                  placeholder="0532 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">E-Posta (Opsiyonel)</label>
                <input
                  type="email"
                  placeholder="ahmet@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#827470] mb-1">Şehir *</label>
                <input
                  type="text"
                  placeholder="İstanbul"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#e5e2e1]">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-4 text-base font-semibold"
              disabled={submitting}
            >
              {submitting ? "Sipariş Talebi Gönderiliyor..." : "Ücretsiz Teklif Talebini Gönder"}
            </Button>
            <p className="text-xs text-center text-[#827470] mt-3 leading-relaxed">
              Talebinizi göndermeden önce kişisel verilerinizin işlenmesine ilişkin{" "}
              <Link href="/kvkk" target="_blank" className="underline font-medium text-[#442a22]">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni inceleyebilirsiniz. Hiçbir şekilde online ödeme bilgisi istenmez.
            </p>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
