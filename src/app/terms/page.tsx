import Terms from '@/views/terms';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
export const metadata = pageMetadata('/terms', 'Terms of service | Zapiboo', "The terms for Zapiboo's pre-loved kids item selling services.");
export default function Page() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Terms of service', path: '/terms' }])} /><Terms /></>;
}
