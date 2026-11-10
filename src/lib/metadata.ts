import type { Metadata } from 'next';
import { absoluteUrl } from './seo';

export function pageMetadata(path: string, title: string, description: string, noindex = false): Metadata {
  const image = absoluteUrl('/opengraph-image');
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: { type: 'website', siteName: 'Zapiboo', locale: 'en_IN', url: absoluteUrl(path), title, description, images: [{ url: image, width: 1200, height: 630, alt: 'Zapiboo — Pre-Loved Kids Marketplace in Bangalore' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
