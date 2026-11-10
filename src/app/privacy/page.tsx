import Privacy from '@/views/privacy';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
export const metadata = pageMetadata('/privacy', 'Privacy policy | Zapiboo', 'How Zapiboo handles your information when you sell pre-loved kids items.');
export default function Page() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/privacy' }])} /><Privacy /></>;
}
