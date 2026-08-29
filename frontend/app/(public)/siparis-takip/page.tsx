"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { trackOrder } from "@/features/order-tracking/api";
import { OrderTrackingResponse } from "@/features/order-tracking/types";
import { getStatusConfig } from "@/features/order-tracking/status";

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderTrackingResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!trackingNumber.trim() || !phone.trim()) {
      setErrorMessage("Lütfen takip numarası ve telefon numaranızı giriniz.");
      return;
    }

    setLoading(true);

    try {
      const res = await trackOrder({
        tracking_number: trackingNumber.trim(),
        phone: phone.trim(),
      });
      setOrderData(res);
    } catch {
      setOrderData(null);
      setErrorMessage(
        "Sipariş bilgileri doğrulanamadı. Lütfen takip numaranızı ve telefon numaranızı kontrol edip tekrar deneyiniz."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrderData(null);
    setErrorMessage(null);
    setTrackingNumber("");
    setPhone("");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const currentStatusConfig = orderData ? getStatusConfig(orderData.status) : null;

  return (
    <div className="w-full py-16">
      <PageContainer className="max-w-3xl">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">Sipariş & Teklif Durumu</Badge>
          <h1 className="font-serif text-3xl md:text-5xl text-[#442a22] font-bold mb-4">
            Sipariş Takibi
          </h1>
          <p className="text-base text-[#504441] max-w-xl mx-auto leading-relaxed">
            Siparişinizin veya özel teklif talebinizin güncel durumunu sorgulamak için takip numaranızı ve telefon numaranızı giriniz.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-[#fcf9f8] border border-[#e5e2e1] rounded-lg p-6 md:p-8 shadow-sm mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#504441] mb-2">
                  Takip Numarası *
                </label>
                <input
                  type="text"
                  placeholder="Örn: ATL-2026-A7K39P"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#442a22]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#504441] mb-2">
                  Telefon Numarası *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 0532 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded text-center">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 font-semibold"
                disabled={loading}
              >
                {loading ? "Sorgulanıyor..." : "Siparişi Sorgula"}
              </Button>
              {orderData && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                >
                  Yeni Sorgulama
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Tracking Result View */}
        {orderData && currentStatusConfig && (
          <div className="bg-[#fcf9f8] border border-[#e5e2e1] rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-8">
            {/* Header Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e5e2e1] pb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-[#827470] tracking-wider block mb-1">
                  Sipariş Takip Numarası
                </span>
                <span className="font-mono text-2xl font-bold text-[#442a22]">
                  {orderData.tracking_number}
                </span>
              </div>
              <Badge variant={currentStatusConfig.variant}>
                {currentStatusConfig.label}
              </Badge>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white p-5 border border-[#e5e2e1] rounded-md">
              <div>
                <span className="text-xs text-[#827470] block uppercase font-medium">Ürün</span>
                <span className="text-sm font-semibold text-[#442a22]">{orderData.product_name}</span>
              </div>
              <div>
                <span className="text-xs text-[#827470] block uppercase font-medium">Adet</span>
                <span className="text-sm font-semibold text-[#442a22]">{orderData.quantity} Adet</span>
              </div>
              <div>
                <span className="text-xs text-[#827470] block uppercase font-medium">Talep Tarihi</span>
                <span className="text-sm font-semibold text-[#442a22]">{formatDate(orderData.created_at)}</span>
              </div>
              {(orderData.requested_width || orderData.requested_height || orderData.requested_depth) && (
                <div>
                  <span className="text-xs text-[#827470] block uppercase font-medium">Ölçüler (En x Boy x Derinlik)</span>
                  <span className="text-sm font-semibold text-[#442a22]">
                    {orderData.requested_width || "-"} x {orderData.requested_height || "-"} x {orderData.requested_depth || "-"} cm
                  </span>
                </div>
              )}
              {orderData.color_name && (
                <div>
                  <span className="text-xs text-[#827470] block uppercase font-medium">Renk / Cila</span>
                  <span className="text-sm font-semibold text-[#442a22]">{orderData.color_name}</span>
                </div>
              )}
              {orderData.material_name && (
                <div>
                  <span className="text-xs text-[#827470] block uppercase font-medium">Ahşap Türü</span>
                  <span className="text-sm font-semibold text-[#442a22]">{orderData.material_name}</span>
                </div>
              )}
            </div>

            {/* Status Description Box */}
            <div className="p-4 bg-[#f6f3f2] border-l-4 border-[#442a22] text-sm text-[#442a22] rounded-r">
              <span className="font-semibold block mb-1">Mevcut Durum: {currentStatusConfig.label}</span>
              <p className="text-[#504441]">{currentStatusConfig.description}</p>
            </div>

            {/* Dynamic Status History Timeline */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#442a22] mb-6">
                Sipariş Durum Geçmişi
              </h3>

              <div className="relative pl-6 border-l-2 border-[#d4c3be] flex flex-col gap-6">
                {orderData.history.map((hist, idx) => {
                  const itemConfig = getStatusConfig(hist.status);
                  const isLatest = idx === orderData.history.length - 1;

                  return (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                          isLatest ? "bg-[#442a22] ring-4 ring-[#e8dedb]" : "bg-[#a69792]"
                        }`}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-semibold text-sm text-[#442a22]">
                          {itemConfig.label}
                        </span>
                        <span className="text-xs text-[#827470]">
                          {formatDate(hist.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-[#6e605d] mt-1">{itemConfig.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
