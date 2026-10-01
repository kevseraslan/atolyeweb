import { fetchClientApi } from "@/lib/api/client";
import {
  AdminUser,
  AdminDashboardSummary,
  AdminOrderDetail,
  SiteSettingsData,
} from "./types";
import {
  ProductListItem,
  Color,
  Material,
  Category,
} from "@/features/products/types";

let activeCsrfToken: string | null = null;

/**
 * State-changing admin istekleri için CSRF header'ını hazırlar.
 * Token bellekte yoksa mevcut admin oturumundan yeniden alınır.
 */
async function getCsrfHeaders(
  options?: RequestInit
): Promise<HeadersInit> {
  const headers = new Headers(options?.headers || {});

  const method = options?.method?.toUpperCase();

  const isStateChanging =
    method !== undefined &&
    ["POST", "PATCH", "DELETE", "PUT"].includes(method);

  if (isStateChanging && !activeCsrfToken) {
    const user = await getAdminMe();
    activeCsrfToken = user.csrf_token || null;
  }

  if (isStateChanging && activeCsrfToken) {
    headers.set("X-CSRF-Token", activeCsrfToken);
  }

  return headers;
}

// ==============================
// Auth
// ==============================

export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminUser> {
  const user = await fetchClientApi<AdminUser>(
    "/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (user.csrf_token) {
    activeCsrfToken = user.csrf_token;
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  await fetchClientApi("/admin/auth/logout", {
    method: "POST",
    headers: await getCsrfHeaders({
      method: "POST",
    }),
  });

  activeCsrfToken = null;
}

export async function getAdminMe(): Promise<AdminUser> {
  const user = await fetchClientApi<AdminUser>(
    "/admin/auth/me"
  );

  if (user.csrf_token) {
    activeCsrfToken = user.csrf_token;
  }

  return user;
}

// ==============================
// Dashboard
// ==============================

export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
  return await fetchClientApi<AdminDashboardSummary>(
    "/admin/dashboard"
  );
}

// ==============================
// Products
// ==============================

export async function getAdminProducts(): Promise<ProductListItem[]> {
  return await fetchClientApi<ProductListItem[]>(
    "/admin/products"
  );
}

export async function deactivateAdminProduct(
  productId: number
): Promise<void> {
  await fetchClientApi(`/admin/products/${productId}`, {
    method: "DELETE",
    headers: await getCsrfHeaders({
      method: "DELETE",
    }),
  });
}

// ==============================
// Categories
// ==============================

export async function getAdminCategories(): Promise<Category[]> {
  return await fetchClientApi<Category[]>(
    "/admin/categories"
  );
}

export async function createAdminCategory(
  data: Partial<Category>
): Promise<Category> {
  return await fetchClientApi<Category>(
    "/admin/categories",
    {
      method: "POST",
      headers: await getCsrfHeaders({
        method: "POST",
      }),
      body: JSON.stringify(data),
    }
  );
}

// ==============================
// Colors
// ==============================

export async function getAdminColors(): Promise<Color[]> {
  return await fetchClientApi<Color[]>(
    "/admin/colors"
  );
}

export async function createAdminColor(
  data: Partial<Color>
): Promise<Color> {
  return await fetchClientApi<Color>(
    "/admin/colors",
    {
      method: "POST",
      headers: await getCsrfHeaders({
        method: "POST",
      }),
      body: JSON.stringify(data),
    }
  );
}

// ==============================
// Materials
// ==============================

export async function getAdminMaterials(): Promise<Material[]> {
  return await fetchClientApi<Material[]>(
    "/admin/materials"
  );
}

export async function createAdminMaterial(
  data: Partial<Material>
): Promise<Material> {
  return await fetchClientApi<Material>(
    "/admin/materials",
    {
      method: "POST",
      headers: await getCsrfHeaders({
        method: "POST",
      }),
      body: JSON.stringify(data),
    }
  );
}

// ==============================
// Orders
// ==============================

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

  const endpoint = `/admin/orders${
    query.toString()
      ? `?${query.toString()}`
      : ""
  }`;

  return await fetchClientApi<AdminOrderDetail[]>(
    endpoint,
    {
      signal: params?.signal,
    }
  );
}

export async function updateAdminOrderStatus(
  orderId: number,
  newStatus: string,
  note?: string
): Promise<void> {
  await fetchClientApi(
    `/admin/orders/${orderId}/status`,
    {
      method: "PATCH",

      headers: await getCsrfHeaders({
        method: "PATCH",
      }),

      body: JSON.stringify({
        new_status: newStatus,
        note,
      }),
    }
  );
}

export async function updateAdminOrderPrice(
  orderId: number,
  quotedPrice?: number,
  approvedPrice?: number
): Promise<void> {
  await fetchClientApi(
    `/admin/orders/${orderId}/price`,
    {
      method: "PATCH",

      headers: await getCsrfHeaders({
        method: "PATCH",
      }),

      body: JSON.stringify({
        quoted_price: quotedPrice,
        approved_price: approvedPrice,
      }),
    }
  );
}

export async function addAdminOrderNote(
  orderId: number,
  note: string
): Promise<void> {
  await fetchClientApi(
    `/admin/orders/${orderId}/notes`,
    {
      method: "POST",

      headers: await getCsrfHeaders({
        method: "POST",
      }),

      body: JSON.stringify({
        note,
      }),
    }
  );
}

// ==============================
// Settings
// ==============================

export async function getAdminSiteSettings(): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>(
    "/admin/settings"
  );
}

export async function updateAdminSiteSettings(
  data: Partial<SiteSettingsData>
): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>(
    "/admin/settings",
    {
      method: "PATCH",

      headers: await getCsrfHeaders({
        method: "PATCH",
      }),

      body: JSON.stringify(data),
    }
  );
}

// ==============================
// Public Settings
// ==============================

export async function getPublicSiteSettings(): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>(
    "/site-settings"
  );
}
