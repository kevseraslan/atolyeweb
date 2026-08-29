export interface OrderCreateRequest {
  product_id?: number | null;
  color_id?: number | null;
  material_id?: number | null;
  custom_product_name?: string | null;
  requested_width?: number | null;
  requested_height?: number | null;
  requested_depth?: number | null;
  custom_note?: string | null;
  quantity: number;
  customer_name: string;
  phone: string;
  email?: string | null;
  city: string;
}

export interface OrderCreatedResponse {
  tracking_number: string;
  status: string;
  created_at: string;
  message: string;
}
