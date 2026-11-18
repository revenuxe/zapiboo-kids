import type { MetadataRoute } from "next";
import { serviceAreas, absoluteUrl } from "@/lib/seo";
import { familyServices } from "@/lib/family-service-catalog";
export const revalidate = 3600;
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/areas",
    "/marketplace",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    ...serviceAreas.map((a) => `/areas/${a.slug}`),
  ]
    .map((path) => ({ url: absoluteUrl(path) }))
    .concat(
      familyServices.map((service) => ({
        url: absoluteUrl(`/services/${service.id}`),
        images: [absoluteUrl(service.image_url)],
      })),
    );
}
