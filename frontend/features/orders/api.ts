import { fetchClientApi } from "@/lib/api/client";
import { OrderCreateRequest, OrderCreatedResponse } from "./types";
import { Color, Material, Category, ProductListItem } from "@/features/products/types";

export async function createOrder(
  data: OrderCreateRequest
): Promise<OrderCreatedResponse> {
  return await fetchClientApi<OrderCreatedResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getActiveColors(): Promise<Color[]> {
  try {
    return await fetchClientApi<Color[]>("/colors");
  } catch (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }
}

const DEFAULT_ORDER_CATEGORIES: Category[] = [
  { id: 1, name: "Masalar", slug: "masalar", description: "Doğal masif yemek ve çalışma masaları", sort_order: 1, is_active: true },
  { id: 2, name: "Sandalyeler & Banklar", slug: "sandalyeler-banklar", description: "Ergonomik ve dayanıklı masif ahşap oturma elemanları", sort_order: 2, is_active: true },
  { id: 3, name: "Konsol & Büfeler", slug: "konsol-bufeler", description: "Şık depolama çözümleri ve estetik konsollar", sort_order: 3, is_active: true },
  { id: 4, name: "Kitaplıklar & Raflar", slug: "kitapliklar-raflar", description: "Modüler ve dayanıklı masif ahşap kitaplık sistemleri", sort_order: 4, is_active: true },
  { id: 5, name: "Sehpalar", slug: "sehpalar", description: "Orta ve yan masif ahşap sehpalar", sort_order: 5, is_active: true },
];

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const cats = await fetchClientApi<Category[]>("/categories");
    if (Array.isArray(cats) && cats.length > 0) return cats;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  return DEFAULT_ORDER_CATEGORIES;
}

export async function getActiveMaterials(): Promise<Material[]> {
  try {
    return await fetchServerOrClientMaterials();
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return [];
  }
}

export async function getActiveProducts(categoryId?: number): Promise<ProductListItem[]> {
  try {
    const endpoint = categoryId ? `/products?category_id=${categoryId}&page_size=100` : `/products?page_size=100`;
    const res = await fetchClientApi<{ items: ProductListItem[] }>(endpoint);
    return res.items || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function fetchServerOrClientMaterials(): Promise<Material[]> {
  return await fetchClientApi<Material[]>("/materials");
}
