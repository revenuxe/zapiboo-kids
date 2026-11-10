import { LandingBreadcrumbs, AreaSellerAdvice, SellerCta } from '@/components/SellerLandingContent';
import { LandingHero } from '@/components/LandingHero';
import { SellingCategoryCards } from '@/components/SellingCategoryCards';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, PackageCheck } from 'lucide-react';
import { getAreaBySlug, serviceAreas, serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { servicesPaused } from '@/lib/launch-status';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';

type Props = { params: Promise<{ area: string }> };
export function generateStaticParams() { return serviceAreas.map(({ slug }) => ({ area: slug })); }
export async function generateMetadata({ params }: Props) {
  const area = getAreaBySlug((await params).area);
  if (!area) notFound();
  return pageMetadata(`/areas/${area.slug}`, `Sell Used Kids Items in ${area.name}, Bangalore | Zapiboo`, `Sell outgrown toys, books, clothing, baby gear and kids cycles in ${area.name}. Find local pickup information, item preparation tips and the next steps with Zapiboo.`);
}

export default async function AreaPage({ params }: Props) {
  const area = getAreaBySlug((await params).area);
  if (!area) notFound();
  const path = `/areas/${area.slug}`;
  const pickupHref = `/pickup?pincode=${area.pincode}`;
  const nearby = area.nearby.map(name => serviceAreas.find(candidate => candidate.name === name)).filter((candidate): candidate is (typeof serviceAreas)[number] => Boolean(candidate));
  const faqs = [
    { question: `What can I sell in ${area.name}?`, answer: 'You can share toys, books, kids clothing, baby gear, cycles, ride-ons and kids electronics. Select a category and condition, then add optional notes and a photo. Items should be clean, safe to use and honestly described.' },
    { question: `Can I arrange pickup in ${area.name} now?`, answer: servicesPaused ? `We are preparing our pickup service for Bangalore, including ${area.name}. You can explore the selling flow and create an account, but no pickup is booked while the opening-soon notice is active.` : `Enter your exact ${area.name} address and choose a preferred slot in the booking form. Our team will review your items and confirm availability before collection.` },
    { question: 'Will my pincode be filled in?', answer: `Yes. Links from this page carry ${area.pincode} into the pickup form. This is a reference pincode for ${area.name}; confirm or update it to match your exact address when you reach the address step.` },
    { question: 'How do I prepare a bundle?', answer: 'Keep related items together and describe what is included in Anything else. Mention missing pieces, damage, clothing sizes or included accessories. A clear photo is helpful, but optional.' },
  ];
  return <>
    <JsonLd data={[serviceSchema(path, area), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Service areas', path: '/areas' }, { name: area.name, path }]), faqSchema(faqs)]} />
    <LandingHero eyebrow="LITTLE THINGS. LOCAL BEGINNINGS." title={<>Sell pre-loved kids items in <span>{area.name}.</span></>} description={`Sell pre-loved kids items in ${area.name}. Pass on the toys, books, clothes and baby gear your family has outgrown, with local selling and pickup support.`} href={pickupHref} action={`Start selling in ${area.name}`} image="/sell-categories/toys.webp" imageAlt="Little toys. Big new adventures." />
    <LandingBreadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bangalore areas", href: "/areas" }, { name: area.name }]} />

    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">What would you like to sell in {area.name}?</h2><p className="mt-4 max-w-2xl text-muted-foreground">Choose a category to begin with your local pincode already carried into the form.</p><SellingCategoryCards pincode={area.pincode} /></section>
    <SellerCta title={`A little less clutter in ${area.name}.`} description="Share one item or a collection. Start with the condition and a few details; our team helps with the next steps." href={pickupHref} action="Share my items" />
    <AreaSellerAdvice area={area} />
    <section className="bg-secondary/50 py-14"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Selling from your {area.name} home</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{[['Share the condition', 'Select the category and condition. Use optional notes or a photo to show wear, missing parts or what is included in a bundle.'], ['Confirm your address', `The form starts with ${area.pincode}. Check the pincode, add your full ${area.name} address and include any apartment access instructions when bookings are available.`], ['Review before handover', 'Our team confirms item eligibility, pickup availability and the sale and payment details before you decide to proceed.']].map(([title, text], index) => <article key={title} className="rounded-2xl border border-border bg-card p-6"><p className="text-sm font-bold text-primary">0{index + 1}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"><div className="rounded-3xl border border-border bg-accent/40 p-6 sm:p-8"><PackageCheck className="size-8 text-primary" /><h2 className="mt-4 text-2xl font-bold">Ready for a careful handover</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Clean and dry your items, group accessories together and note any damage or missing parts. For larger items, let our team know about lift access or stairs at your {area.name} address before collection. Please keep personal documents and unrelated belongings out of boxes and photos.</p></div><div className="mt-12 max-w-3xl"><h2 className="text-3xl font-bold">Questions from {area.name} sellers</h2><div className="mt-6 divide-y divide-border">{faqs.map(faq => <details key={faq.question} className="py-5"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}</div></div>{nearby.length > 0 && <nav aria-label="Nearby areas" className="mt-10"><h2 className="text-xl font-bold">Nearby neighbourhoods</h2><div className="mt-4 flex flex-wrap gap-3">{nearby.map(other => <Link key={other.slug} href={`/areas/${other.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold hover:text-primary">{other.name}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>)}</div></nav>}<Link href="/areas" className="mt-8 inline-flex items-center gap-2 font-bold text-primary">See all Bangalore areas<ArrowRight aria-hidden="true" className="size-4" /></Link></section>
    <SellerCta title={`Ready for a fresh start in ${area.name}?`} description="Keep the memories and tell us about the things your family has outgrown. Confirm all arrangements before handover." href={pickupHref} action={`Start selling in ${area.name}`} />
  </>;
}
