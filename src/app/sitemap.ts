import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import type { MetadataRoute } from "next";
import { serviceAreas, absoluteUrl } from "@/lib/seo";
import { categoryImage } from "@/lib/selling-categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sellingCategories = await getPublicSellingCategories();
  const pages = ["/", "/areas", "/pickup", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...sellingCategories.map((category) => ({
      url: absoluteUrl(`/sell/${category.id}`),
      images: [
        category.image_url?.startsWith("https://")
          ? category.image_url
          : absoluteUrl(category.image_url || categoryImage(category.id)),
      ],
    })),
    ...serviceAreas.map((area) => ({
      url: absoluteUrl(`/areas/${area.slug}`),
      images: [absoluteUrl("/sell-categories/toys.webp")],
    })),
  ];
}
