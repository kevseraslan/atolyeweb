import { fetchClientApi } from "@/lib/api/client";
import {
  AdminUser,
  AdminDashboardSummary,
  AdminOrderDetail,
  SiteSettingsData,
} from "./types";
import { ProductListItem, Color, Material, Category } from "@/features/products/types";

// Auth
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  return await fetchClientApi<AdminUser>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin(): Promise<void> {
  await fetchClientApi("/admin/auth/logout", { method: "POST" });
}

export async function getAdminMe(): Promise<AdminUser> {
  return await fetchClientApi<AdminUser>("/admin/auth/me");
}

// Dashboard
export async function getAdminDashboard(): Promise<AdminDashboardSummary> {
  return await fetchClientApi<AdminDashboardSummary>("/admin/dashboard");
}

// Products
export async function getAdminProducts(): Promise<ProductListItem[]> {
  return await fetchClientApi<ProductListItem[]>("/admin/products");
}

export async function deactivateAdminProduct(productId: number): Promise<void> {
  await fetchClientApi(`/admin/products/${productId}`, { method: "DELETE" });
}

// Categories
export async function getAdminCategories(): Promise<Category[]> {
  return await fetchClientApi<Category[]>("/admin/categories");
}

export async function createAdminCategory(data: Partial<Category>): Promise<Category> {
  return await fetchClientApi<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Colors
export async function getAdminColors(): Promise<Color[]> {
  return await fetchClientApi<Color[]>("/admin/colors");
}

export async function createAdminColor(data: Partial<Color>): Promise<Color> {
  return await fetchClientApi<Color>("/admin/colors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Materials
export async function getAdminMaterials(): Promise<Material[]> {
  return await fetchClientApi<Material[]>("/admin/materials");
}

export async function createAdminMaterial(data: Partial<Material>): Promise<Material> {
  return await fetchClientApi<Material>("/admin/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Orders
export async function getAdminOrders(statusFilter?: string): Promise<AdminOrderDetail[]> {
  const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
  return await fetchClientApi<AdminOrderDetail[]>(`/admin/orders${query}`);
}

export async function updateAdminOrderStatus(orderId: number, newStatus: string, note?: string): Promise<void> {
  await fetchClientApi(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ new_status: newStatus, note }),
  });
}

export async function updateAdminOrderPrice(orderId: number, quotedPrice?: number, approvedPrice?: number): Promise<void> {
  await fetchClientApi(`/admin/orders/${orderId}/price`, {
    method: "PATCH",
    body: JSON.stringify({ quoted_price: quotedPrice, approved_price: approvedPrice }),
  });
}

export async function addAdminOrderNote(orderId: number, note: string): Promise<void> {
  await fetchClientApi(`/admin/orders/${orderId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

// Settings
export async function getAdminSiteSettings(): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>("/admin/settings");
}

export async function updateAdminSiteSettings(data: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getPublicSiteSettings(): Promise<SiteSettingsData> {
  return await fetchClientApi<SiteSettingsData>("/site-settings");
}
