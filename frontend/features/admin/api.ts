import { fetchClientApi } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import {
  AdminUser,
  AdminDashboardSummary,
  AdminOrderDetail,
  SiteSettingsData,
  AdminProductCreateInput,
  AdminProductUpdateInput,
  AdminCategoryCreateUpdateInput,
  AdminColorCreateUpdateInput,
  AdminMaterialCreateUpdateInput,
} from "./types";
import { ProductListItem, ProductDetail, Color, Material, Category } from "@/features/products/types";
let activeCsrfToken: string | null = null;
const CSRF_STORAGE_KEY = "admin_csrf_token";

export function setCsrfToken(token: string | null): void {
  activeCsrfToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
    }
  }
}

export async function getCsrfToken(): Promise<string | null> {
  if (activeCsrfToken) return activeCsrfToken;

  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (cached) {
      activeCsrfToken = cached;
      return cached;
    }
  }

  try {
    const user = await fetchClientApi<AdminUser>("/admin/auth/me");
    if (user?.csrf_token) {
      setCsrfToken(user.csrf_token);
      return user.csrf_token;
    }
  } catch {
    // Ignored if unauthenticated
  }

  return null;
}


export async function fetchAdminApi<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const isMutation = ["POST", "PATCH", "PUT", "DELETE"].includes(method);
  const isLoginEndpoint = endpoint.includes("/admin/auth/login");

  const headers = new Headers(options.headers || {});

  if (isMutation && !isLoginEndpoint) {
    const token = await getCsrfToken();
    if (token) {
      headers.set("X-CSRF-Token", token);
    }
  }

  try {
    return await fetchClientApi<T>(endpoint, {
      ...options,
      headers,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      // 1. Handle CSRF Token Expiry / Mismatch -> Refresh and retry ONCE
      if (err.status === 403 && isMutation && !isRetry && !isLoginEndpoint) {
        setCsrfToken(null);
        try {
          const freshUser = await fetchClientApi<AdminUser>("/admin/auth/me");
          if (freshUser?.csrf_token) {
            setCsrfToken(freshUser.csrf_token);
            return await fetchAdminApi<T>(endpoint, options, true);
          }
        } catch {
          // Fall through to throw original error
        }
      }

      // 2. Handle 401 Unauthorized -> Clear CSRF and redirect if in browser
      if (err.status === 401 && !isLoginEndpoint) {
        setCsrfToken(null);
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }
    throw err;
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const user = await fetchClientApi<AdminUser>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (user.csrf_token) {
    setCsrfToken(user.csrf_token);
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetchAdminApi("/admin/auth/logout", {
      method: "POST",
    });
  } finally {
    setCsrfToken(null);
  }
}

export async function getAdminMe(): Promise<AdminUser> {
  const user = await fetchClientApi<AdminUser>(
    "/admin/auth/me"
  );

  if (user.csrf_token) {
    setCsrfToken(user.csrf_token);
  }

  return user;
}

export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
  return await fetchAdminApi<AdminDashboardSummary>("/admin/dashboard");
}

export async function getAdminProducts(): Promise<ProductListItem[]> {
  return await fetchAdminApi<ProductListItem[]>("/admin/products");
}

export async function createAdminProduct(data: AdminProductCreateInput): Promise<ProductDetail> {
  return await fetchAdminApi<ProductDetail>("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminProduct(productId: number, data: AdminProductUpdateInput): Promise<ProductDetail> {
  return await fetchAdminApi<ProductDetail>(`/admin/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deactivateAdminProduct(productId: number): Promise<void> {
  await fetchAdminApi(`/admin/products/${productId}`, {
    method: "DELETE",
  });
}

export async function uploadProductImage(productId: number, formData: FormData): Promise<void> {
  await fetchAdminApi(`/admin/products/${productId}/images`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
  await fetchAdminApi(`/admin/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}

const DEFAULT_FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Masalar", slug: "masalar", description: "Doğal masif yemek ve çalışma masaları", sort_order: 1, is_active: true },
  { id: 2, name: "Sandalyeler & Banklar", slug: "sandalyeler-banklar", description: "Ergonomik ve dayanıklı masif ahşap oturma elemanları", sort_order: 2, is_active: true },
  { id: 3, name: "Konsol & Büfeler", slug: "konsol-bufeler", description: "Şık depolama çözümleri ve estetik konsollar", sort_order: 3, is_active: true },
  { id: 4, name: "Kitaplıklar & Raflar", slug: "kitapliklar-raflar", description: "Modüler ve dayanıklı masif ahşap kitaplık sistemleri", sort_order: 4, is_active: true },
  { id: 5, name: "Sehpalar", slug: "sehpalar", description: "Orta ve yan masif ahşap sehpalar", sort_order: 5, is_active: true },
];

export async function getAdminCategories(): Promise<Category[]> {
  try {
    const cats = await fetchAdminApi<Category[]>("/admin/categories");
    if (Array.isArray(cats) && cats.length > 0) return cats;
  } catch (err) {
    console.warn("getAdminCategories admin endpoint failed, falling back to public categories", err);
  }
  try {
    const publicCats = await fetchClientApi<Category[]>("/categories");
    if (Array.isArray(publicCats) && publicCats.length > 0) return publicCats;
  } catch {
    // Fallback below
  }
  return DEFAULT_FALLBACK_CATEGORIES;
}

export async function createAdminCategory(data: AdminCategoryCreateUpdateInput): Promise<Category> {
  return await fetchAdminApi<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminCategory(categoryId: number, data: Partial<AdminCategoryCreateUpdateInput>): Promise<Category> {
  return await fetchAdminApi<Category>(`/admin/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAdminColors(): Promise<Color[]> {
  try {
    const cols = await fetchAdminApi<Color[]>("/admin/colors");
    if (Array.isArray(cols) && cols.length > 0) return cols;
  } catch (err) {
    console.warn("getAdminColors admin endpoint failed, falling back to public colors", err);
  }
  try {
    return await fetchClientApi<Color[]>("/colors");
  } catch {
    return [];
  }
}

export async function createAdminColor(data: AdminColorCreateUpdateInput): Promise<Color> {
  return await fetchAdminApi<Color>("/admin/colors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminColor(colorId: number, data: Partial<AdminColorCreateUpdateInput>): Promise<Color> {
  return await fetchAdminApi<Color>(`/admin/colors/${colorId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAdminMaterials(): Promise<Material[]> {
  try {
    const mats = await fetchAdminApi<Material[]>("/admin/materials");
    if (Array.isArray(mats) && mats.length > 0) return mats;
  } catch (err) {
    console.warn("getAdminMaterials admin endpoint failed, falling back to public materials", err);
  }
  try {
    return await fetchClientApi<Material[]>("/materials");
  } catch {
    return [];
  }
}

export async function createAdminMaterial(data: AdminMaterialCreateUpdateInput): Promise<Material> {
  return await fetchAdminApi<Material>("/admin/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminMaterial(materialId: number, data: Partial<AdminMaterialCreateUpdateInput>): Promise<Material> {
  return await fetchAdminApi<Material>(`/admin/materials/${materialId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAdminOrders(params?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}): Promise<AdminOrderDetail[]> {
  const query = new URLSearchParams();

  if (params?.status) {
    query.set("status", params.status);
  }

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  if (params?.offset) {
    query.set("offset", String(params.offset));
  }

  const endpoint = `/admin/orders${query.toString() ? `?${query.toString()}` : ""}`;
  return await fetchAdminApi<AdminOrderDetail[]>(endpoint, {
    signal: params?.signal,
  });
}

export async function getAdminOrderDetail(orderId: number): Promise<AdminOrderDetail> {
  return await fetchAdminApi<AdminOrderDetail>(`/admin/orders/${orderId}`);
}

export async function updateAdminOrderStatus(orderId: number, newStatus: string, note?: string): Promise<void> {
  await fetchAdminApi(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ new_status: newStatus, note }),
  });
}

export async function updateAdminOrderPrice(orderId: number, quotedPrice?: number, approvedPrice?: number): Promise<void> {
  await fetchAdminApi(`/admin/orders/${orderId}/price`, {
    method: "PATCH",
    body: JSON.stringify({ quoted_price: quotedPrice, approved_price: approvedPrice }),
  });
}

export async function addAdminOrderNote(orderId: number, note: string): Promise<void> {
  await fetchAdminApi(`/admin/orders/${orderId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export async function getAdminSiteSettings(): Promise<SiteSettingsData> {
  return await fetchAdminApi<SiteSettingsData>("/admin/settings");
}

export async function updateAdminSiteSettings(data: Partial<SiteSettingsData>): Promise<SiteSettingsData>
{
  return await fetchAdminApi<SiteSettingsData>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getPublicSiteSettings(): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>(
    "/site-settings"
  );
}
