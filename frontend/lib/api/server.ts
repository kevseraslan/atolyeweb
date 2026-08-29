import { ApiError } from "./errors";

const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export async function fetchServerApi<T>(
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

  // Enforce 5-second timeout for server-side fetches to avoid hanging renders
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  // If cache: "no-store" is requested, do not attach next revalidate option
  const fetchNextOption = options.cache === "no-store" ? undefined : (options.next || { revalidate: 60 });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
      ...(fetchNextOption ? { next: fetchNextOption } : {}),
    });

    clearTimeout(timeoutId);

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
        // Fallback
      }

      throw new ApiError(errorMessage, errorCode, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Server-side fetch timed out after 5s", "TIMEOUT_ERROR", 504);
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Server fetch error",
      "SERVER_FETCH_ERROR",
      500
    );
  }
}
