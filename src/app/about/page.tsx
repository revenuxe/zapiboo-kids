import About from '@/views/about';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = pageMetadata('/about', 'About Zapiboo | Sell Pre-Loved Kids Items in Bangalore', 'Learn how Zapiboo helps parents in Bangalore sell outgrown toys, books, clothing and baby gear with doorstep pickup support.');

export default function Page() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} /><About /></>;
}
