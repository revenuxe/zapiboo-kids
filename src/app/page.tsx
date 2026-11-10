import Home from '@/views/index';
import { pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, serviceSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata = pageMetadata('/', 'Sell Used Kids Toys, Books & Baby Gear in Bangalore | Zapiboo', 'Sell pre-loved kids toys, books, clothing and baby gear in Bangalore. Share item details, get selling support and arrange doorstep pickup when available.');
export default function Page() {
  return <><JsonLd data={[serviceSchema('/'), breadcrumbSchema([{ name: 'Home', path: '/' }])]} /><Home /></>;
}
