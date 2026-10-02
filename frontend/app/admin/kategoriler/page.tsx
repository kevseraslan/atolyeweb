"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAdminCategories, createAdminCategory, updateAdminCategory } from "@/features/admin/api";
import { Category } from "@/features/products/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Edit state
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAdminCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err) => console.error("Failed to load categories:", err))
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
      await createAdminCategory({ name: name.trim(), description: description.trim() || undefined });
      setName("");
      setDescription("");
      setMessage("Kategori eklendi.");
      await loadCategories();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kategori eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setSavingEdit(true);
    setMessage(null);

    try {
      await updateAdminCategory(editingCat.id, {
        name: editingCat.name.trim(),
        description: editingCat.description?.trim() || undefined,
        is_active: editingCat.is_active,
      });
      setMessage("Kategori güncellendi.");
      setEditingCat(null);
      await loadCategories();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kategori güncellenemedi.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Kategori Yönetimi</h1>
        <p className="text-sm text-[#504441] mt-1">Ürün kategorilerini listeleyin, yeni kategori ekleyin ve düzenleyin.</p>
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
                  <th className="p-4">Kategori Adı</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-4 font-semibold text-[#442a22]">{c.name}</td>
                    <td className="p-4 font-mono text-xs text-[#827470]">{c.slug}</td>
                    <td className="p-4">
                      <Badge variant={c.is_active !== false ? "primary" : "secondary"}>
                        {c.is_active !== false ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCat({ ...c })}
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
                            await updateAdminCategory(c.id, { is_active: c.is_active === false });
                            setMessage(`Kategori ${c.is_active !== false ? "pasife" : "aktife"} alındı.`);
                            await loadCategories();
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
            {editingCat ? `Kategori Düzenle: ${editingCat.name}` : "Yeni Kategori Ekle"}
          </h2>
          {editingCat ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
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
                  value={editingCat.description || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md" disabled={savingEdit}>
                  {savingEdit ? "Kaydediliyor..." : "Güncelle"}
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setEditingCat(null)}>
                  Vazgeç
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Masalar"
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
                  placeholder="Kategori hakkında kısa bilgi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#d4c3be] rounded text-sm"
                />
              </div>
              <Button type="submit" variant="primary" size="md" disabled={adding}>
                {adding ? "Kaydediliyor..." : "Kategori Kaydet"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
