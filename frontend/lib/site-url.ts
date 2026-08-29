export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    if (process.env.NODE_ENV === "production" && trimmed.includes("localhost")) {
      console.warn("[DEPLOYMENT WARNING] NEXT_PUBLIC_SITE_URL is using localhost in production build!");
    }
    return trimmed;
  }

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[CRITICAL DEPLOYMENT ERROR] NEXT_PUBLIC_SITE_URL must be explicitly configured with a valid production domain (e.g. https://www.example.com) in production environment!"
    );
  }

  return "http://localhost:3000";
}

export function isSiteIndexable(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
}
