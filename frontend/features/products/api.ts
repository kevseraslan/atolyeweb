import { cache } from "react";
import { fetchServerApi } from "@/lib/api/server";
import {
  Category,
  ProductListItem,
  ProductDetail,
  PaginatedResponse,
} from "./types";

export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchServerApi<Category[]>("/categories");
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<ProductListItem>> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined)
    query.set("featured", String(params.featured));
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("page_size", String(params.pageSize));

  const endpoint = `/products${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  try {
    return await fetchServerApi<PaginatedResponse<ProductListItem>>(endpoint);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 12,
      total_pages: 0,
    };
  }
}

// React cache() memoizes getProductBySlug per request lifecycle.
// Guarantees generateMetadata() and ProductDetailPage share 1 single backend fetch!
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    try {
      return await fetchServerApi<ProductDetail>(`/products/${slug}`);
    } catch (error) {
      console.error(`Failed to fetch product with slug '${slug}':`, error);
      return null;
    }
  }
);
