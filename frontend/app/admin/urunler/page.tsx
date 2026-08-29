"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAdminProducts, deactivateAdminProduct } from "@/features/admin/api";
import { ProductListItem } from "@/features/products/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAdminProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
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

  const handleDeactivate = async (id: number) => {
    if (!confirm("Bu ürünü pasife almak istediğinizden emin misiniz?")) return;
    try {
      await deactivateAdminProduct(id);
      setMessage("Ürün başarıyla pasife alındı.");
      await loadProducts();
    } catch {
      setMessage("Ürün pasife alınamadı.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#442a22]">Ürün Kataloğu Yönetimi</h1>
          <p className="text-sm text-[#504441] mt-1">Ürünleri listeleyin ve aktif/pasif durumlarını yönetin.</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded">
          {message}
        </div>
      )}

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
                  <th className="p-4">Durum</th>
                  <th className="p-4">Öne Çıkan</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-4 font-semibold text-[#442a22]">{p.name}</td>
                    <td className="p-4 text-[#504441]">{p.category.name}</td>
                    <td className="p-4">
                      <Badge variant={p.is_active !== false ? "primary" : "secondary"}>
                        {p.is_active !== false ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-[#827470]">
                      {p.is_featured ? "Evet" : "Hayır"}
                    </td>
                    <td className="p-4">
                      {p.is_active !== false && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivate(p.id)}
                        >
                          Pasife Al
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
