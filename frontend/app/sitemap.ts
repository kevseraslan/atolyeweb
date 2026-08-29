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
    // Filter strictly for active products belonging to active categories
    const activeProducts = productsData.items.filter(
      (product) => product.is_active && (!product.category || product.category.is_active !== false)
    );

    const productRoutes: MetadataRoute.Sitemap = activeProducts.map((product) => ({
      url: `${siteUrl}/urunler/${product.slug}`,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch (err) {
    console.error("[SITEMAP ERROR] Backend product fetch failed during sitemap generation:", err);
    return staticRoutes;
  }
}
