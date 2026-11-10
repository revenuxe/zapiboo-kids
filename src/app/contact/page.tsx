import Contact from '@/views/contact';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo';
export const metadata = pageMetadata('/contact', 'Contact Zapiboo - Talk to Our Team', 'Questions about selling pre-loved kids items, pickup or payment? Contact the Zapiboo team - we usually reply within one business day.');
export default function Page() {
  return <><JsonLd data={[localBusinessSchema('/contact'), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]} /><Contact /></>;
}
