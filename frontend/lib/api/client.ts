const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = "API_ERROR", status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function fetchApi<T>(
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
      next: options.next || { revalidate: 60 },
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
