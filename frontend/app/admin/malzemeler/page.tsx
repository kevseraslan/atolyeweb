"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAdminMaterials, createAdminMaterial, updateAdminMaterial } from "@/features/admin/api";
import { Material } from "@/features/products/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Edit state
  const [editingMat, setEditingMat] = useState<Material | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadMaterials = useCallback(async () => {
    try {
      const data = await getAdminMaterials();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to load materials:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAdminMaterials()
      .then((data) => {
        if (active) setMaterials(data);
      })
      .catch((err) => console.error("Failed to load materials:", err))
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
      await createAdminMaterial({ name: name.trim(), description: description.trim() || undefined });
      setName("");
      setDescription("");
      setMessage("Malzeme eklendi.");
      await loadMaterials();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Malzeme eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMat) return;
    setSavingEdit(true);
    setMessage(null);

    try {
      await updateAdminMaterial(editingMat.id, {
        name: editingMat.name.trim(),
        description: editingMat.description?.trim() || undefined,
        is_active: editingMat.is_active,
      });
      setMessage("Malzeme güncellendi.");
      setEditingMat(null);
      await loadMaterials();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Malzeme güncellenemedi.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Ahşap & Malzeme Yönetimi</h1>
        <p className="text-sm text-[#504441] mt-1">Masif ahşap ve malzeme türlerini yönetin, düzenleyin ve yeni malzeme ekleyin.</p>
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
                  <th className="p-4">Malzeme Adı</th>
                  <th className="p-4">Açıklama</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-4 font-semibold text-[#442a22]">{m.name}</td>
                    <td className="p-4 text-xs text-[#6e605d]">{m.description || "-"}</td>
                    <td className="p-4">
                      <Badge variant={m.is_active !== false ? "primary" : "secondary"}>
                        {m.is_active !== false ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMat({ ...m })}
                      >
                        Düzenle
                      </Button>
                      <button
                        type="button"
                        className={`px-2 py-1 text-xs font-semibold ${
                          m.is_active !== false ? "text-red-600 hover:text-red-800" : "text-emerald-600 hover:text-emerald-800"
                        }`}
                        onClick={async () => {
                          try {
                            await updateAdminMaterial(m.id, { is_active: !m.is_active });
                            setMessage(`Malzeme ${m.is_active ? "pasife" : "aktife"} alındı.`);
                            await loadMaterials();
                          } catch (err) {
                            setMessage(err instanceof Error ? err.message : "İşlem başarısız.");
                          }
                        }}
                      >
                        {m.is_active !== false ? "Pasife Al" : "Aktife Al"}
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
            {editingMat ? `Malzeme Düzenle: ${editingMat.name}` : "Yeni Malzeme Ekle"}
          </h2>
          {editingMat ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Malzeme Adı *
                </label>
                <input
                  type="text"
                  value={editingMat.name}
                  onChange={(e) => setEditingMat({ ...editingMat, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Açıklama
                </label>
                <textarea
                  rows={3}
                  value={editingMat.description || ""}
                  onChange={(e) => setEditingMat({ ...editingMat, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md" disabled={savingEdit}>
                  {savingEdit ? "Kaydediliyor..." : "Güncelle"}
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setEditingMat(null)}>
                  Vazgeç
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Malzeme Adı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Masif Meşe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Açıklama
                </label>
                <textarea
                  rows={3}
                  placeholder="Ahşap özelliği, fırınlanma durumu vb..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                />
              </div>
              <Button type="submit" variant="primary" size="md" disabled={adding}>
                {adding ? "Kaydediliyor..." : "Malzeme Kaydet"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
