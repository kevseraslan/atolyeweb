"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export default function CustomOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "Masa",
    productName: "",
    quantity: "1",
    width: "",
    height: "",
    depth: "",
    dimensionNotes: "",
    material: "Masif Ahşap",
    color: "Ceviz",
    notes: "",
    fullName: "",
    phone: "",
    email: "",
    city: "",
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <main className="flex-grow pt-12 pb-24 px-5 md:px-16 max-w-[1280px] mx-auto w-full relative">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-6xl text-[#442a22] font-bold mb-4">
          Özel Sipariş
        </h1>
        <p className="text-base md:text-lg text-[#504441] max-w-2xl mx-auto leading-relaxed">
          Hayalinizdeki mobilyayı usta ellerde gerçeğe dönüştürün. İhtiyaçlarınızı
          bize detaylıca iletin, size özel bir tasarım ve teklif sunalım.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-[#fcf9f8]/90 glass-effect rounded-xl shadow-lg p-6 md:p-12 relative overflow-hidden border border-white/50">
        {submitted ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-[#233600]">
              check_circle
            </span>
            <h2 className="font-serif text-3xl text-[#442a22] font-semibold">
              Sipariş Talebiniz Başarıyla Alındı
            </h2>
            <p className="text-base text-[#504441] max-w-md">
              Talebiniz atölye ekibimize iletilmiştir. En kısa sürede telefon veya
              e-posta üzerinden sizinle iletişime geçeceğiz.
            </p>
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Yeni Talep Oluştur
            </Button>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-[#e5e2e1] -z-10" />
              {[1, 2, 3, 4, 5].map((step) => {
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;

                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-xs transition-colors ${
                        isCompleted
                          ? "bg-[#ffdbd0] text-[#2c160e] border-[#ffdbd0]"
                          : isActive
                          ? "bg-[#442a22] text-white border-[#442a22]"
                          : "bg-transparent text-[#504441] border-[#827470]"
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest hidden md:block text-[#504441]">
                      {step === 1 && "Ürün"}
                      {step === 2 && "Ölçü"}
                      {step === 3 && "Malzeme"}
                      {step === 4 && "Tasarım"}
                      {step === 5 && "İletişim"}
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Ürün Bilgileri */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    Ürün Bilgileri
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Mobilya Türü"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      options={[
                        { value: "Masa", label: "Masa" },
                        { value: "Sandalye", label: "Sandalye" },
                        { value: "Kitaplık", label: "Kitaplık" },
                        { value: "Konsol", label: "Konsol" },
                        { value: "Sehpa", label: "Sehpa" },
                        { value: "Diğer", label: "Diğer" },
                      ]}
                    />
                    <Input
                      label="Ürün Adı (Opsiyonel)"
                      placeholder="Örn: Yemek Odası Masası"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Adet"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Ölçüler */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    Ölçüler (cm)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Genişlik"
                      placeholder="Örn: 200"
                      value={formData.width}
                      onChange={(e) =>
                        setFormData({ ...formData, width: e.target.value })
                      }
                    />
                    <Input
                      label="Yükseklik"
                      placeholder="Örn: 75"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                    <Input
                      label="Derinlik"
                      placeholder="Örn: 90"
                      value={formData.depth}
                      onChange={(e) =>
                        setFormData({ ...formData, depth: e.target.value })
                      }
                    />
                  </div>
                  <Textarea
                    label="Ölçü Notları"
                    placeholder="Özel durumlar veya esneklik payı..."
                    rows={3}
                    value={formData.dimensionNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensionNotes: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Step 3: Malzeme & Renk */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    Malzeme ve Renk Tercihi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Malzeme"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                      options={[
                        { value: "Masif Ahşap", label: "Masif Ahşap" },
                        {
                          value: "MDF Üzeri Kaplama",
                          label: "MDF Üzeri Kaplama",
                        },
                      ]}
                    />
                    <Select
                      label="Renk / Cila"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      options={[
                        { value: "Ceviz", label: "Ceviz" },
                        { value: "Meşe", label: "Meşe" },
                        { value: "Siyah", label: "Siyah" },
                        { value: "Beyaz", label: "Beyaz" },
                        { value: "Antrasit", label: "Antrasit" },
                        { value: "Naturel", label: "Naturel" },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Tasarım Notları */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    Tasarım Notları ve İstekler
                  </h2>
                  <Textarea
                    label="Açıklama / Detaylar"
                    placeholder="Mobilyanız ile ilgili özel istekleriniz, ayak tipi, kenar formu vb..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Step 5: İletişim Bilgileri */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-2">
                    İletişim Bilgileri
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Ad Soyad *"
                      placeholder="Ahmet Yılmaz"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                    <Input
                      label="Telefon (Zorunlu) *"
                      placeholder="+90 5XX XXX XX XX"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Input
                      label="E-posta (Opsiyonel)"
                      placeholder="ahmet@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <Input
                      label="Şehir"
                      placeholder="İstanbul"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12 pt-6 border-t border-[#e5e2e1]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className={currentStep === 1 ? "invisible" : ""}
                >
                  Geri
                </Button>
                <Button type="button" variant="primary" onClick={handleNext}>
                  {currentStep === totalSteps ? "Gönder" : "İleri"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
