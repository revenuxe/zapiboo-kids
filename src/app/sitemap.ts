import type { MetadataRoute } from 'next';
import { serviceAreas, absoluteUrl } from '@/lib/seo';
import { sellingCategories, categoryImage } from '@/lib/selling-categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/areas', '/pickup', '/about', '/contact', '/privacy', '/terms'];
  return [
    ...pages.map(path => ({ url: absoluteUrl(path) })),
    ...sellingCategories.map(category => ({ url: absoluteUrl(`/sell/${category.id}`), images: [absoluteUrl(categoryImage(category.id))] })),
    ...serviceAreas.map(area => ({ url: absoluteUrl(`/areas/${area.slug}`), images: [absoluteUrl('/sell-categories/toys.webp')] })),
  ];
}
