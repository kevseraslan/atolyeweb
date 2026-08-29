"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminOrderPrice,
  addAdminOrderNote,
} from "@/features/admin/api";
import { AdminOrderDetail } from "@/features/admin/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);

  // Status Modal State
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Price Modal State
  const [quotedPrice, setQuotedPrice] = useState<string>("");
  const [approvedPrice, setApprovedPrice] = useState<string>("");
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // Note Modal State
  const [adminNoteText, setAdminNoteText] = useState<string>("");
  const [addingNote, setAddingNote] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders(selectedStatus || undefined);
      setOrders(data);
      if (selectedOrder) {
        const updated = data.find((o) => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedOrder]);

  useEffect(() => {
    let isMounted = true;
    getAdminOrders(selectedStatus || undefined)
      .then((data) => {
        if (isMounted) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedStatus]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;
    setUpdatingStatus(true);
    setMessage(null);

    try {
      await updateAdminOrderStatus(selectedOrder.id, newStatus, statusNote);
      setMessage("Sipariş durumu başarıyla güncellendi.");
      setStatusNote("");
      await loadOrders();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Durum güncellenemedi.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingPrice(true);
    setMessage(null);

    try {
      const qp = quotedPrice ? parseFloat(quotedPrice) : undefined;
      const ap = approvedPrice ? parseFloat(approvedPrice) : undefined;
      await updateAdminOrderPrice(selectedOrder.id, qp, ap);
      setMessage("Fiyat teklif bilgileri güncellendi.");
      await loadOrders();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Fiyat güncellenemedi.");
    } finally {
      setUpdatingPrice(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !adminNoteText.trim()) return;
    setAddingNote(true);
    setMessage(null);

    try {
      await addAdminOrderNote(selectedOrder.id, adminNoteText.trim());
      setAdminNoteText("");
      setMessage("Dahili admin notu eklendi.");
      await loadOrders();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Not eklenemedi.");
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#442a22]">Siparişler & Teklifler</h1>
          <p className="text-sm text-[#504441] mt-1">Müşteri taleplerini inceleyin, durum ve teklif fiyatlarını yönetin.</p>
        </div>

        {/* Filter Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2.5 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c]"
        >
          <option value="">Tüm Durumlar</option>
          <option value="RECEIVED">Talebiniz Alındı</option>
          <option value="UNDER_REVIEW">İnceleniyor</option>
          <option value="CONTACTED">İletişime Geçildi</option>
          <option value="QUOTED">Teklif Hazırlandı</option>
          <option value="APPROVED">Onaylandı</option>
          <option value="IN_PRODUCTION">Üretimde</option>
          <option value="FINISHING">Son İşlemler</option>
          <option value="READY">Teslimata Hazır</option>
          <option value="DELIVERED">Teslim Edildi</option>
          <option value="CANCELLED">İptal Edildi</option>
        </select>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
          {message}
        </div>
      )}

      {/* Orders Table & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-7 bg-white border border-[#e5e2e1] rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#827470]">Yükleniyor...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-[#827470]">Sipariş talebi bulunamadı.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f6f3f2] text-xs uppercase font-semibold text-[#827470] border-b border-[#e5e2e1]">
                  <tr>
                    <th className="p-4">Takip No</th>
                    <th className="p-4">Müşteri</th>
                    <th className="p-4">Ürün</th>
                    <th className="p-4">Durum</th>
                    <th className="p-4">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e2e1]">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className={`hover:bg-[#fcf9f8] cursor-pointer ${
                        selectedOrder?.id === o.id ? "bg-[#f6f3f2]" : ""
                      }`}
                      onClick={() => {
                        setSelectedOrder(o);
                        setNewStatus(o.status);
                        setQuotedPrice(o.quoted_price ? o.quoted_price.toString() : "");
                        setApprovedPrice(o.approved_price ? o.approved_price.toString() : "");
                      }}
                    >
                      <td className="p-4 font-mono font-semibold text-[#442a22]">{o.tracking_number}</td>
                      <td className="p-4">
                        <span className="font-semibold block text-[#1b1c1c]">{o.customer_name}</span>
                        <span className="text-xs text-[#827470]">{o.phone} ({o.city})</span>
                      </td>
                      <td className="p-4 text-[#442a22] font-medium">{o.product_name}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{o.status}</Badge>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          className="px-3 py-1 bg-[#442a22] text-white text-xs font-semibold rounded"
                        >
                          İncele
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Order Detail Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {selectedOrder ? (
            <div className="bg-white border border-[#e5e2e1] rounded-lg p-6 shadow-sm flex flex-col gap-6">
              <div>
                <span className="text-xs uppercase font-semibold text-[#827470]">Sipariş Detayı</span>
                <h2 className="font-mono text-2xl font-bold text-[#442a22]">{selectedOrder.tracking_number}</h2>
              </div>

              {/* Müşteri Bilgileri */}
              <div className="bg-[#f6f3f2] p-4 rounded text-xs flex flex-col gap-1">
                <span className="font-semibold text-sm text-[#442a22]">{selectedOrder.customer_name}</span>
                <span>Telefon: {selectedOrder.phone}</span>
                {selectedOrder.email && <span>E-posta: {selectedOrder.email}</span>}
                <span>Şehir: {selectedOrder.city}</span>
              </div>

              {/* Ürün & Ölçüler */}
              <div className="text-xs flex flex-col gap-2">
                <div><strong className="text-[#442a22]">Ürün:</strong> {selectedOrder.product_name}</div>
                <div><strong className="text-[#442a22]">Adet:</strong> {selectedOrder.quantity}</div>
                {(selectedOrder.requested_width || selectedOrder.requested_height || selectedOrder.requested_depth) && (
                  <div>
                    <strong className="text-[#442a22]">Ölçüler:</strong> {selectedOrder.requested_width || "-"} x {selectedOrder.requested_height || "-"} x {selectedOrder.requested_depth || "-"} cm
                  </div>
                )}
                {selectedOrder.color_name && <div><strong className="text-[#442a22]">Renk/Cila:</strong> {selectedOrder.color_name}</div>}
                {selectedOrder.material_name && <div><strong className="text-[#442a22]">Ahşap:</strong> {selectedOrder.material_name}</div>}
                {selectedOrder.custom_note && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded">
                    <strong>Müşteri Notu:</strong> {selectedOrder.custom_note}
                  </div>
                )}
              </div>

              {/* Durum Güncelleme Formu */}
              <form onSubmit={handleStatusUpdate} className="border-t border-[#e5e2e1] pt-4 flex flex-col gap-3">
                <label className="block text-xs font-semibold uppercase text-[#827470]">Durum Güncelle</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 bg-white border border-[#d4c3be] rounded text-xs font-semibold"
                >
                  <option value="RECEIVED">Talebiniz Alındı (RECEIVED)</option>
                  <option value="UNDER_REVIEW">İnceleniyor (UNDER_REVIEW)</option>
                  <option value="CONTACTED">İletişime Geçildi (CONTACTED)</option>
                  <option value="QUOTED">Teklif Hazırlandı (QUOTED)</option>
                  <option value="APPROVED">Onaylandı (APPROVED)</option>
                  <option value="IN_PRODUCTION">Üretimde (IN_PRODUCTION)</option>
                  <option value="FINISHING">Son İşlemler (FINISHING)</option>
                  <option value="READY">Teslimata Hazır (READY)</option>
                  <option value="DELIVERED">Teslim Edildi (DELIVERED)</option>
                  <option value="CANCELLED">İptal Edildi (CANCELLED)</option>
                </select>
                <input
                  type="text"
                  placeholder="İsteğe bağlı durum değişiklik notu..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2 border border-[#d4c3be] rounded text-xs"
                />
                <Button type="submit" variant="primary" size="sm" disabled={updatingStatus}>
                  Durumu Güncelle
                </Button>
              </form>

              {/* Fiyat Teklifi Formu */}
              <form onSubmit={handlePriceUpdate} className="border-t border-[#e5e2e1] pt-4 flex flex-col gap-3">
                <label className="block text-xs font-semibold uppercase text-[#827470]">Teklif Fiyatları (TL)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#827470] block">Hazırlanan Teklif</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="15000.00"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      className="w-full p-2 border border-[#d4c3be] rounded text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#827470] block">Onaylanan Fiyat</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="14500.00"
                      value={approvedPrice}
                      onChange={(e) => setApprovedPrice(e.target.value)}
                      className="w-full p-2 border border-[#d4c3be] rounded text-xs"
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" size="sm" disabled={updatingPrice}>
                  Fiyatları Kaydet
                </Button>
              </form>

              {/* Dahili Admin Notları */}
              <div className="border-t border-[#e5e2e1] pt-4 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase text-[#827470]">Dahili Admin Notları</span>
                <span className="text-[10px] text-gray-500 italic">* Yalnızca yöneticiler görür (Müşteriye kapalıdır)</span>
                
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {selectedOrder.notes.length === 0 ? (
                    <span className="text-xs text-[#827470]">Not yok.</span>
                  ) : (
                    selectedOrder.notes.map((n) => (
                      <div key={n.id} className="p-2 bg-[#f6f3f2] rounded text-xs">
                        <span className="font-semibold block text-[#442a22]">{n.admin_name}</span>
                        <p className="text-[#504441]">{n.note}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Admin dahili not yaz..."
                    value={adminNoteText}
                    onChange={(e) => setAdminNoteText(e.target.value)}
                    className="flex-1 p-2 border border-[#d4c3be] rounded text-xs"
                  />
                  <Button type="submit" variant="outline" size="sm" disabled={addingNote}>
                    Ekle
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e5e2e1] rounded-lg p-8 text-center text-[#827470] text-sm">
              Detayları ve durum güncellemesini görmek için soldan bir sipariş seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
