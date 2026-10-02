"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAdminColors, createAdminColor, updateAdminColor } from "@/features/admin/api";
import { Color } from "@/features/products/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("#8d6e63");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Edit state
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadColors = useCallback(async () => {
    try {
      const data = await getAdminColors();
      setColors(data);
    } catch (err) {
      console.error("Failed to load colors:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAdminColors()
      .then((data) => {
        if (active) setColors(data);
      })
      .catch((err) => console.error("Failed to load colors:", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    setMessage(null);

    try {
      await createAdminColor({ name: name.trim(), hex_code: hexCode.trim() });
      setName("");
      setMessage("Renk eklendi.");
      await loadColors();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Renk eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColor) return;
    setSavingEdit(true);
    setMessage(null);

    try {
      await updateAdminColor(editingColor.id, {
        name: editingColor.name.trim(),
        hex_code: editingColor.hex_code?.trim() || undefined,
        is_active: editingColor.is_active,
      });
      setMessage("Renk güncellendi.");
      setEditingColor(null);
      await loadColors();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Renk güncellenemedi.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Renk & Cila Yönetimi</h1>
        <p className="text-sm text-[#504441] mt-1">Cila renklerini ve ahşap dokularını yönetin, düzenleyin ve yeni renk ekleyin.</p>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#e5e2e1] rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#827470]">Yükleniyor...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f6f3f2] text-xs uppercase font-semibold text-[#827470] border-b border-[#e5e2e1]">
                <tr>
                  <th className="p-4">Renk</th>
                  <th className="p-4">Renk Adı</th>
                  <th className="p-4">Hex Kodu</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {colors.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-4">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-inner"
                        style={{ backgroundColor: c.hex_code || "#ccc" }}
                      />
                    </td>
                    <td className="p-4 font-semibold text-[#442a22]">{c.name}</td>
                    <td className="p-4 font-mono text-xs text-[#827470]">{c.hex_code || "-"}</td>
                    <td className="p-4">
                      <Badge variant={c.is_active !== false ? "primary" : "secondary"}>
                        {c.is_active !== false ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingColor({ ...c })}
                      >
                        Düzenle
                      </Button>
                      <button
                        type="button"
                        className={`px-2 py-1 text-xs font-semibold ${
                          c.is_active !== false ? "text-red-600 hover:text-red-800" : "text-emerald-600 hover:text-emerald-800"
                        }`}
                        onClick={async () => {
                          try {
                            await updateAdminColor(c.id, { is_active: !c.is_active });
                            setMessage(`Renk ${c.is_active ? "pasife" : "aktife"} alındı.`);
                            await loadColors();
                          } catch (err) {
                            setMessage(err instanceof Error ? err.message : "İşlem başarısız.");
                          }
                        }}
                      >
                        {c.is_active !== false ? "Pasife Al" : "Aktife Al"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-[#e5e2e1] rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-serif text-xl font-bold text-[#442a22]">
            {editingColor ? `Renk Düzenle: ${editingColor.name}` : "Yeni Renk / Cila Ekle"}
          </h2>
          {editingColor ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Renk Adı *
                </label>
                <input
                  type="text"
                  value={editingColor.name}
                  onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Hex Kodu
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={editingColor.hex_code || "#8d6e63"}
                    onChange={(e) => setEditingColor({ ...editingColor, hex_code: e.target.value })}
                    className="w-10 h-10 border border-[#d4c3be] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingColor.hex_code || ""}
                    onChange={(e) => setEditingColor({ ...editingColor, hex_code: e.target.value })}
                    className="flex-1 p-2.5 bg-white border border-[#d4c3be] rounded text-sm font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md" disabled={savingEdit}>
                  {savingEdit ? "Kaydediliyor..." : "Güncelle"}
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setEditingColor(null)}>
                  Vazgeç
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Renk Adı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Açık Ceviz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Hex Kodu
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    className="w-10 h-10 border border-[#d4c3be] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-[#d4c3be] rounded text-sm font-mono"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="md" disabled={adding}>
                {adding ? "Kaydediliyor..." : "Renk Kaydet"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
