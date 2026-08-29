export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  last_login_at?: string | null;
}

export interface AdminDashboardSummary {
  total_products: number;
  total_orders: number;
  new_requests: number;
  under_review: number;
  in_production: number;
  ready: number;
  status_counts: Record<string, number>;
}

export interface AdminOrderNote {
  id: number;
  note: string;
  admin_name: string;
  created_at: string;
}

export interface AdminOrderDetail {
  id: number;
  tracking_number: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  city: string;
  product_name: string;
  custom_product_name?: string | null;
  color_name?: string | null;
  material_name?: string | null;
  requested_width?: number | null;
  requested_height?: number | null;
  requested_depth?: number | null;
  quantity: number;
  custom_note?: string | null;
  status: string;
  quoted_price?: number | null;
  approved_price?: number | null;
  quoted_at?: string | null;
  created_at: string;
  updated_at: string;
  notes: AdminOrderNote[];
}

export interface SiteSettingsData {
  workshop_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  working_hours?: string | null;
  google_maps_url?: string | null;
  instagram_url?: string | null;
  hero_title?: string | null;
  about_text?: string | null;
}
