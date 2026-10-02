"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deactivateAdminProduct,
  getAdminCategories,
  getAdminColors,
  getAdminMaterials,
} from "@/features/admin/api";
import { ProductListItem, Category, Color, Material } from "@/features/products/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states for New Product
  const [formCategoryId, setFormCategoryId] = useState<number>(0);
  const [formName, setFormName] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formWidth, setFormWidth] = useState("");
  const [formHeight, setFormHeight] = useState("");
  const [formDepth, setFormDepth] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formColorIds, setFormColorIds] = useState<number[]>([]);
  const [formMaterialIds, setFormMaterialIds] = useState<number[]>([]);

  const loadAll = useCallback(async () => {
    try {
      const [prodsRes, catsRes, colsRes, matsRes] = await Promise.allSettled([
        getAdminProducts(),
        getAdminCategories(),
        getAdminColors(),
        getAdminMaterials(),
      ]);

      const prods = prodsRes.status === "fulfilled" ? prodsRes.value : [];
      const cats = (catsRes.status === "fulfilled" && catsRes.value.length > 0)
        ? catsRes.value
        : [
            { id: 1, name: "Masalar", slug: "masalar", description: "Doğal masif yemek ve çalışma masaları", sort_order: 1, is_active: true },
            { id: 2, name: "Sandalyeler & Banklar", slug: "sandalyeler-banklar", description: "Ergonomik ve dayanıklı masif ahşap oturma elemanları", sort_order: 2, is_active: true },
            { id: 3, name: "Konsol & Büfeler", slug: "konsol-bufeler", description: "Şık depolama çözümleri ve estetik konsollar", sort_order: 3, is_active: true },
            { id: 4, name: "Kitaplıklar & Raflar", slug: "kitapliklar-raflar", description: "Modüler ve dayanıklı masif ahşap kitaplık sistemleri", sort_order: 4, is_active: true },
            { id: 5, name: "Sehpalar", slug: "sehpalar", description: "Orta ve yan masif ahşap sehpalar", sort_order: 5, is_active: true },
          ];
      const cols = colsRes.status === "fulfilled" ? colsRes.value : [];
      const mats = matsRes.status === "fulfilled" ? matsRes.value : [];

      setProducts(prods);
      setCategories(cats);
      setColors(cols);
      setMaterials(mats);
      if (cats.length > 0) {
        setFormCategoryId((prev) => (prev > 0 ? prev : cats[0].id));
      }
    } catch (err) {
      console.error("Failed to load products data:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getAdminProducts(),
      getAdminCategories(),
      getAdminColors(),
      getAdminMaterials(),
    ])
      .then(([prodsRes, catsRes, colsRes, matsRes]) => {
        if (!active) return;
        const prods = prodsRes.status === "fulfilled" ? prodsRes.value : [];
        const cats =
          catsRes.status === "fulfilled" && catsRes.value.length > 0
            ? catsRes.value
            : [
                { id: 1, name: "Masalar", slug: "masalar", description: "Doğal masif yemek ve çalışma masaları", sort_order: 1, is_active: true },
                { id: 2, name: "Sandalyeler & Banklar", slug: "sandalyeler-banklar", description: "Ergonomik ve dayanıklı masif ahşap oturma elemanları", sort_order: 2, is_active: true },
                { id: 3, name: "Konsol & Büfeler", slug: "konsol-bufeler", description: "Şık depolama çözümleri ve estetik konsollar", sort_order: 3, is_active: true },
                { id: 4, name: "Kitaplıklar & Raflar", slug: "kitapliklar-raflar", description: "Modüler ve dayanıklı masif ahşap kitaplık sistemleri", sort_order: 4, is_active: true },
                { id: 5, name: "Sehpalar", slug: "sehpalar", description: "Orta ve yan masif ahşap sehpalar", sort_order: 5, is_active: true },
              ];
        const cols = colsRes.status === "fulfilled" ? colsRes.value : [];
        const mats = matsRes.status === "fulfilled" ? matsRes.value : [];

        setProducts(prods);
        setCategories(cats);
        setColors(cols);
        setMaterials(mats);
        if (cats.length > 0) {
          setFormCategoryId((prev) => (prev > 0 ? prev : cats[0].id));
        }
      })
      .catch((err) => {
        console.error("Failed to load products data:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDeactivate = async (id: number) => {
    if (!confirm("Bu ürünü pasife almak istediğinizden emin misiniz?")) return;
    try {
      await deactivateAdminProduct(id);
      setMessage("Ürün başarıyla pasife alındı.");
      await loadAll();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ürün pasife alınamadı.");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCategoryId = formCategoryId || (categories.length > 0 ? categories[0].id : 0);
    if (!formName.trim() || !targetCategoryId) {
      setMessage("Lütfen ürün adı ve kategori seçiniz.");
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      await createAdminProduct({
        category_id: targetCategoryId,
        name: formName.trim(),
        short_description: formShortDesc.trim() || undefined,
        description: formDesc.trim() || undefined,
        default_width: formWidth ? parseFloat(formWidth) : undefined,
        default_height: formHeight ? parseFloat(formHeight) : undefined,
        default_depth: formDepth ? parseFloat(formDepth) : undefined,
        is_customizable: true,
        is_featured: formIsFeatured,
        is_active: formIsActive,
        color_ids: formColorIds,
        material_ids: formMaterialIds,
      });

      setMessage("Yeni ürün başarıyla oluşturuldu.");
      setShowAddModal(false);
      setFormName("");
      setFormShortDesc("");
      setFormDesc("");
      setFormWidth("");
      setFormHeight("");
      setFormDepth("");
      setFormColorIds([]);
      setFormMaterialIds([]);
      await loadAll();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ürün oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    setMessage(null);

    try {
      await updateAdminProduct(editingProduct.id, {
        name: editingProduct.name,
        category_id: editingProduct.category.id,
        short_description: editingProduct.short_description || undefined,
        default_width: editingProduct.default_width ? Number(editingProduct.default_width) : undefined,
        default_height: editingProduct.default_height ? Number(editingProduct.default_height) : undefined,
        default_depth: editingProduct.default_depth ? Number(editingProduct.default_depth) : undefined,
        is_featured: editingProduct.is_featured,
        is_active: editingProduct.is_active,
      });

      setMessage("Ürün başarıyla güncellendi.");
      setEditingProduct(null);
      await loadAll();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ürün güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#442a22]">Ürün Kataloğu Yönetimi</h1>
          <p className="text-sm text-[#504441] mt-1">Ürünleri listeleyin, yeni ürün ekleyin ve durumlarını yönetin.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            if (categories.length > 0 && formCategoryId === 0) {
              setFormCategoryId(categories[0].id);
            }
            setShowAddModal(true);
          }}
        >
          + Yeni Ürün Ekle
        </Button>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
          {message}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-[#e5e2e1] rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#827470]">Yükleniyor...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-[#827470]">Ürün bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f6f3f2] text-xs uppercase font-semibold text-[#827470] border-b border-[#e5e2e1]">
                <tr>
                  <th className="p-4">Ürün Adı</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Ölçüler (G x Y x D)</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">Öne Çıkan</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-4 font-semibold text-[#442a22]">{p.name}</td>
                    <td className="p-4 text-[#504441]">{p.category?.name || "-"}</td>
                    <td className="p-4 text-xs text-[#827470]">
                      {p.default_width || "-"} x {p.default_height || "-"} x {p.default_depth || "-"} cm
                    </td>
                    <td className="p-4">
                      <Badge variant={p.is_active !== false ? "primary" : "secondary"}>
                        {p.is_active !== false ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-[#827470]">
                      {p.is_featured ? "Evet" : "Hayır"}
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct({ ...p })}
                      >
                        Düzenle
                      </Button>
                      {p.is_active !== false ? (
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs text-red-600 hover:text-red-800 font-semibold"
                          onClick={() => handleDeactivate(p.id)}
                        >
                          Pasife Al
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
                          onClick={async () => {
                            try {
                              await updateAdminProduct(p.id, { is_active: true });
                              setMessage("Ürün aktife alındı.");
                              await loadAll();
                            } catch (err) {
                              setMessage(err instanceof Error ? err.message : "İşlem başarısız.");
                            }
                          }}
                        >
                          Aktife Al
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Yeni Ürün Ekle */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4 border-b border-[#e5e2e1] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#442a22]">Yeni Ürün Ekle</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Ürün Adı *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Örn: Masif Meşe Yemek Masası"
                    className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Kategori *</label>
                  <select
                    value={formCategoryId || (categories.length > 0 ? categories[0].id : "")}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#d4c3be] rounded text-sm bg-white"
                    required
                  >
                    {categories.length === 0 ? (
                      <option value="" disabled>Kategori bulunamadı</option>
                    ) : (
                      <>
                        <option value="" disabled>-- Kategori Seçiniz --</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Kısa Açıklama</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Katalog listelerinde gösterilecek özet bilgi..."
                  className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Detaylı Açıklama</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ağaç cinsi, zanaat detayları ve işçilik..."
                  className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Genişlik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formWidth}
                    onChange={(e) => setFormWidth(e.target.value)}
                    placeholder="200"
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Yükseklik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    placeholder="76"
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Derinlik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formDepth}
                    onChange={(e) => setFormDepth(e.target.value)}
                    placeholder="90"
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
              </div>

              {colors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Renk Seçenekleri</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <label key={c.id} className="flex items-center gap-1.5 text-xs bg-[#f6f3f2] p-1.5 rounded cursor-pointer border border-[#e5e2e1]">
                        <input
                          type="checkbox"
                          checked={formColorIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) setFormColorIds([...formColorIds, c.id]);
                            else setFormColorIds(formColorIds.filter((id) => id !== c.id));
                          }}
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {materials.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Malzeme Seçenekleri</label>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m) => (
                      <label key={m.id} className="flex items-center gap-1.5 text-xs bg-[#f6f3f2] p-1.5 rounded cursor-pointer border border-[#e5e2e1]">
                        <input
                          type="checkbox"
                          checked={formMaterialIds.includes(m.id)}
                          onChange={(e) => {
                            if (e.target.checked) setFormMaterialIds([...formMaterialIds, m.id]);
                            else setFormMaterialIds(formMaterialIds.filter((id) => id !== m.id));
                          }}
                        />
                        {m.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-6 items-center border-t border-[#e5e2e1] pt-3">
                <label className="flex items-center gap-2 text-sm text-[#442a22] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#442a22]"
                  />
                  Ana Sayfada Öne Çıkar
                </label>
                <label className="flex items-center gap-2 text-sm text-[#442a22] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-[#442a22]"
                  />
                  Yayında (Aktif)
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-[#e5e2e1] pt-4">
                <Button variant="outline" size="md" type="button" onClick={() => setShowAddModal(false)}>
                  Vazgeç
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ürün Düzenle */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4 border-b border-[#e5e2e1] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#442a22]">Ürün Düzenle: {editingProduct.name}</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Ürün Adı *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Kategori *</label>
                  <select
                    value={editingProduct.category?.id || categories[0]?.id || 0}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.id === Number(e.target.value));
                      if (selectedCat) {
                        setEditingProduct({ ...editingProduct, category: selectedCat });
                      }
                    }}
                    className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Kısa Açıklama</label>
                <input
                  type="text"
                  value={editingProduct.short_description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full p-2.5 border border-[#d4c3be] rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Genişlik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.default_width || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        default_width: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Yükseklik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.default_height || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        default_height: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">Derinlik (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.default_depth || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        default_depth: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full p-2 border border-[#d4c3be] rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-6 items-center border-t border-[#e5e2e1] pt-3">
                <label className="flex items-center gap-2 text-sm text-[#442a22] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-[#442a22]"
                  />
                  Ana Sayfada Öne Çıkar
                </label>
                <label className="flex items-center gap-2 text-sm text-[#442a22] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded text-[#442a22]"
                  />
                  Yayında (Aktif)
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-[#e5e2e1] pt-4">
                <Button variant="outline" size="md" type="button" onClick={() => setEditingProduct(null)}>
                  Vazgeç
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
