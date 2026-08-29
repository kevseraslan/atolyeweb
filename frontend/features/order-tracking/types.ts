export interface OrderTrackingRequest {
  tracking_number: string;
  phone: string;
}

export interface OrderTrackingHistoryItem {
  status: string;
  created_at: string;
}

export interface OrderTrackingResponse {
  tracking_number: string;
  status: string;
  product_name: string;
  quantity: number;
  requested_width?: number | null;
  requested_height?: number | null;
  requested_depth?: number | null;
  color_name?: string | null;
  material_name?: string | null;
  created_at: string;
  updated_at: string;
  history: OrderTrackingHistoryItem[];
}
