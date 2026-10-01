import { ApiError } from "./errors";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchClientApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
  ...options,
  headers,
  credentials: "include",
});
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = "HTTP_ERROR";

      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error.message || errorMessage;
          errorCode = errorData.error.code || errorCode;
        }
      } catch {
        // Fallback to default message
      }

      throw new ApiError(errorMessage, errorCode, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      "NETWORK_ERROR",
      500
    );
  }
}
