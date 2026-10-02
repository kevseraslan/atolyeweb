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

export async function getActiveCategories(): Promise<Category[]> {
  try {
    return await fetchClientApi<Category[]>("/categories");
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
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
