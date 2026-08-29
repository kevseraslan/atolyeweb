export function getSiteName(): string {
  const envName = process.env.NEXT_PUBLIC_SITE_NAME;
  if (envName && envName.trim()) {
    return envName.trim();
  }
  return "Özel Mobilya Atölyesi";
}
