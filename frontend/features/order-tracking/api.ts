import { fetchClientApi } from "@/lib/api/client";
import { OrderTrackingRequest, OrderTrackingResponse } from "./types";

export async function trackOrder(
  data: OrderTrackingRequest
): Promise<OrderTrackingResponse> {
  return await fetchClientApi<OrderTrackingResponse>("/orders/track", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
