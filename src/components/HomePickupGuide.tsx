import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, ChevronDown, CircleHelp, PackageCheck, ShieldCheck } from 'lucide-react';
import { sellingCategories, categoryImage } from '@/lib/selling-categories';
import { servicesPaused } from '@/lib/launch-status';

export function HomePickupGuide() {
  return <section id="what-we-pick-up" className="home-pickup-guide" aria-labelledby="pickup-guide-title"><div className="home-shell home-section">
    <div className="home-section-heading"><div><span className="home-eyebrow">FROM THE TOY BOX TO THE BOOKSHELF</span><h2 id="pickup-guide-title">What we pick up.<br /><span>And what to keep in mind.</span></h2></div><div className="home-guide-heading-action"><p>From everyday favourites to the bigger things.<br />Explore the examples below, then share yours for review.</p><Link href="/pickup" className="home-button">Start my collection<ArrowUpRight size={18} /></Link></div></div>
    <div className="home-guide-grid">{sellingCategories.map(category => <article key={category.id} className="home-guide-card" data-category={category.id}>
      <div className="home-guide-card-heading"><span className="home-guide-thumbnail"><Image src={categoryImage(category.id)} alt="" width={85} height={75} sizes="75px" /></span><div><h3>{category.name}</h3><Link href={`/sell/${category.id}`}>View category<ArrowUpRight size={13} /></Link></div></div>
      <p className="home-guide-count">{category.types.length} types to explore</p><ul className="home-guide-types">{category.types.map(type => <li key={type}><Check size={13} />{type}</li>)}</ul>
      <details className="home-guide-preparation"><summary>Before you share<ChevronDown size={15} /></summary><p>{category.preparation}</p></details>
      <Link href={`/pickup?category=${category.id}`} className="home-guide-sell">Sell my {category.name.toLowerCase()}<ArrowUpRight size={16} /></Link>
    </article>)}</div>
    <div className="home-guide-standards"><div className="home-guide-standard"><span className="home-guide-standard-icon"><PackageCheck size={23} strokeWidth={1.5} /></span><h3>A good fit for a new home</h3><p>Clean, safe items with useful life left in them. Single items, matching sets and bundles are all welcome to share for review.</p></div><div className="home-guide-standard"><span className="home-guide-standard-icon"><ShieldCheck size={23} strokeWidth={1.5} /></span><h3>Some things need a closer look</h3><p>Tell us about wear, damage, missing parts and included accessories. Our team confirms eligibility and sale details before handover.</p></div><div className="home-guide-standard"><span className="home-guide-standard-icon"><CircleHelp size={23} strokeWidth={1.5} /></span><h3>What should stay out?</h3><p>Unsafe, recalled or expired items, counterfeit goods, and anything you don&apos;t own or aren&apos;t authorised to sell. Remove personal data from electronics.</p></div></div>
    <div className="home-guide-bottom"><div><strong>Something a little different?</strong><p>Tell us what you have. Our team can help you work out the next step.</p></div><div className="home-guide-bottom-actions"><Link href="/pickup" className="home-button">Share your items<ArrowUpRight size={18} /></Link><Link href="/contact" className="home-text-link">Ask about your item<ArrowUpRight size={17} /></Link></div></div>
    <p className="home-guide-availability">{servicesPaused ? 'Pickup service is opening soon. You can explore categories and save your details now; collections are not yet scheduled.' : 'Item acceptance, pickup availability and payment arrangements are confirmed by our team before collection.'}</p>
  </div></section>;
}
