export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (process.env.NODE_ENV === "production") {
    if (!envUrl || !envUrl.trim() || envUrl.includes("localhost")) {
      throw new Error(
        "[CRITICAL DEPLOYMENT ERROR] NEXT_PUBLIC_SITE_URL must be explicitly configured with a valid production domain (e.g. https://www.example.com) in production environment!"
      );
    }
    return envUrl.trim().replace(/\/+$/, "");
  }

  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export function isSiteIndexable(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
}
