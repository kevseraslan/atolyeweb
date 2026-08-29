import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getProducts } from "@/features/products/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
    },
    {
      url: `${siteUrl}/urunler`,
    },
    {
      url: `${siteUrl}/ozel-siparis`,
    },
    {
      url: `${siteUrl}/hakkimizda`,
    },
    {
      url: `${siteUrl}/iletisim`,
    },
    {
      url: `${siteUrl}/kvkk`,
    },
    {
      url: `${siteUrl}/gizlilik`,
    },
  ];

  try {
    const productsData = await getProducts({ pageSize: 100 });
    const productRoutes: MetadataRoute.Sitemap = productsData.items.map((product) => ({
      url: `${siteUrl}/urunler/${product.slug}`,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    // Graceful fallback if backend API is unreachable during static prerender build
    return staticRoutes;
  }
}
