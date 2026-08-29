"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber && phone) {
      setSearched(true);
    }
  };

  return (
    <main className="flex-grow pt-12 pb-24 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-6xl text-[#442a22] font-bold mb-4">
          Sipariş Takibi
        </h1>
        <p className="text-base md:text-lg text-[#504441] max-w-2xl mx-auto leading-relaxed">
          Özel üretim mobilyanızın atölyemizdeki yolculuğunu referans numaranız
          ve kayıtlı telefon numaranız ile adım adım takip edin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tracking Search Form */}
        <div className="lg:col-span-5 bg-[#fcf9f8] rounded-xl p-8 shadow-ambient flex flex-col justify-center border border-[#e5e2e1]">
          <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-6">
            Sipariş Sorgula
          </h2>
          <form onSubmit={handleSearch} className="space-y-6">
            <Input
              label="Referans / Takip Numarası *"
              placeholder="Örn: ART-2026-892"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Input
              label="Telefon Numarası *"
              placeholder="+90 (5XX) XXX XX XX"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button variant="primary" type="submit" className="w-full py-4 flex items-center justify-center gap-2">
              Durumu Sorgula
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </Button>
          </form>
        </div>

        {/* Timeline Result Display */}
        <div className="lg:col-span-7 bg-[#fcf9f8] rounded-xl p-8 shadow-ambient border border-[#e5e2e1]">
          <h3 className="font-serif text-2xl text-[#442a22] font-semibold mb-6 border-b border-[#e5e2e1] pb-4">
            Üretim Süreç Durumu
          </h3>

          {searched ? (
            <div className="flex flex-col gap-6">
              <div className="bg-[#f0eded] p-4 rounded flex justify-between items-center text-sm text-[#1b1c1c]">
                <div>
                  <span className="text-xs text-[#504441] block">
                    Referans No:
                  </span>
                  <span className="font-bold">{trackingNumber.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-xs text-[#504441] block">Durum:</span>
                  <span className="font-semibold text-[#233600]">
                    2. Teklif & Çizim Hazırlanıyor
                  </span>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="relative wrap overflow-hidden py-4">
                <div className="border-r-2 absolute border-[#442a22]/20 h-full left-5 top-0" />

                {/* Step 1 */}
                <div className="mb-8 flex items-center w-full">
                  <div className="z-20 flex items-center bg-[#442a22] text-white shadow-md w-10 h-10 rounded-full justify-center">
                    <span className="material-symbols-outlined text-lg">
                      receipt_long
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-bold text-[#442a22] uppercase tracking-widest">
                      1. Sipariş Alındı
                    </h4>
                    <span className="text-xs text-[#504441]">
                      Sipariş talebiniz sistemde kayıtlı.
                    </span>
                  </div>
                </div>

                {/* Step 2 (Active) */}
                <div className="mb-8 flex items-center w-full">
                  <div className="z-20 flex items-center bg-[#ffdbd0] text-[#2c160e] shadow-md w-10 h-10 rounded-full justify-center ring-2 ring-[#442a22]">
                    <span className="material-symbols-outlined text-lg">
                      design_services
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-bold text-[#442a22] uppercase tracking-widest">
                      2. Teklif & Çizim Hazırlanıyor
                    </h4>
                    <span className="text-xs text-[#504441]">
                      Mimarımız ölçülerinizi ve detayları inceliyor.
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="mb-8 flex items-center w-full opacity-40">
                  <div className="z-20 flex items-center bg-[#e5e2e1] text-[#504441] shadow-md w-10 h-10 rounded-full justify-center">
                    <span className="material-symbols-outlined text-lg">
                      handyman
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-semibold text-[#504441] uppercase tracking-widest">
                      3. Üretimde (Bekliyor)
                    </h4>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center w-full opacity-40">
                  <div className="z-20 flex items-center bg-[#e5e2e1] text-[#504441] shadow-md w-10 h-10 rounded-full justify-center">
                    <span className="material-symbols-outlined text-lg">
                      format_paint
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-semibold text-[#504441] uppercase tracking-widest">
                      4. Boyama / Cila (Bekliyor)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#504441] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-[#827470]">
                search
              </span>
              <p className="text-sm">
                Siparişinizin güncel aşamasını görmek için sol taraftaki formu
                doldurarak sorgulama yapın.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
