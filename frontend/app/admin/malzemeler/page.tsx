"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAdminMaterials, createAdminMaterial } from "@/features/admin/api";
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

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminMaterials();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAdminMaterials()
      .then((data) => {
        if (isMounted) {
          setMaterials(data);
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
    } catch {
      setMessage("Malzeme eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#442a22]">Ahşap & Malzeme Yönetimi</h1>
        <p className="text-sm text-[#504441] mt-1">Masif ahşap ve malzeme türlerini yönetin.</p>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-[#e5e2e1] rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-serif text-xl font-bold text-[#442a22]">Yeni Malzeme Ekle</h2>
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
              Malzeme Kaydet
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
