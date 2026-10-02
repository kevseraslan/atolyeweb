"use client";

import React, { useEffect, useState } from "react";
import { getAdminSiteSettings, updateAdminSiteSettings } from "@/features/admin/api";
import { SiteSettingsData } from "@/features/admin/types";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [settingsData, setSettingsData] = useState<SiteSettingsData>({
    workshop_name: "Artisan Woodworks",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    working_hours: "",
    google_maps_url: "",
    instagram_url: "",
    hero_title: "",
    about_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getAdminSiteSettings();
        setSettingsData(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updated = await updateAdminSiteSettings(settingsData);
      setSettingsData(updated);
      setMessage("Site ayarları başarıyla kaydedildi.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Site ayarları kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#442a22] font-semibold">Site ayarları yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Site İletişim & Genel Ayarlar</h1>
        <p className="text-sm text-[#504441] mt-1">
          Müşteri iletişim bilgileri, çalışma saatleri ve sosyal medya bağlantılarını yönetin.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e2e1] rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              Atölye Ticari Unvanı *
            </label>
            <input
              type="text"
              value={settingsData.workshop_name || ""}
              onChange={(e) => setSettingsData({ ...settingsData, workshop_name: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              Telefon Numarası
            </label>
            <input
              type="text"
              placeholder="0216 123 45 67"
              value={settingsData.phone || ""}
              onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              WhatsApp Numarası
            </label>
            <input
              type="text"
              placeholder="+905321234567"
              value={settingsData.whatsapp || ""}
              onChange={(e) => setSettingsData({ ...settingsData, whatsapp: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              E-Posta Adresi
            </label>
            <input
              type="email"
              placeholder="iletisim@atolyeniz.com"
              value={settingsData.email || ""}
              onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              Çalışma Saatleri
            </label>
            <input
              type="text"
              placeholder="Hafta İçi: 09:00 - 18:00"
              value={settingsData.working_hours || ""}
              onChange={(e) => setSettingsData({ ...settingsData, working_hours: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              Instagram Bağlantısı
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/..."
              value={settingsData.instagram_url || ""}
              onChange={(e) => setSettingsData({ ...settingsData, instagram_url: e.target.value })}
              className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
            Atölye Açık Adresi
          </label>
          <textarea
            rows={3}
            placeholder="Moda Cad. No:123 Kadıköy / İstanbul"
            value={settingsData.address || ""}
            onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
            className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </form>
    </div>
  );
}
