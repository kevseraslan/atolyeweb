import { fetchClientApi } from "@/lib/api/client";
import { OrderCreateRequest, OrderCreatedResponse } from "./types";
import { Color, Material } from "@/features/products/types";

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

export async function getActiveMaterials(): Promise<Material[]> {
  try {
    return await fetchServerOrClientMaterials();
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return [];
  }
}

async function fetchServerOrClientMaterials(): Promise<Material[]> {
  return await fetchClientApi<Material[]>("/materials");
}
