export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    // Fail-safe check: Production deployments MUST configure NEXT_PUBLIC_SITE_URL
    console.error("[CRITICAL CONFIG ERROR] NEXT_PUBLIC_SITE_URL is required in production deployment!");
  }

  return "http://localhost:3000";
}

export function isSiteIndexable(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
}
