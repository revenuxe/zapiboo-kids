import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHero } from "@/components/LandingHero";
import { HomeCollectionSupport } from "@/components/HomeSections";
import { JsonLd } from "@/components/JsonLd";
import { familyServices } from "@/lib/family-service-catalog";
import { getAreaBySlug, serviceAreas, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";
import { areaSearchContent } from "@/lib/service-search-content";
import { faqSchema } from "@/lib/seo";
import { ServiceFaqs } from "@/components/ServiceFaqs";
type Props = { params: Promise<{ area: string }> };
export function generateStaticParams() {
  return serviceAreas.map(({ slug }) => ({ area: slug }));
}
export async function generateMetadata({ params }: Props) {
  const area = getAreaBySlug((await params).area);
  if (!area) notFound();
  return pageMetadata(
    `/areas/${area.slug}`,
    areaSearchContent(area).title,
    areaSearchContent(area).description,
  );
}
export default async function AreaPage({ params }: Props) {
  const area = getAreaBySlug((await params).area);
  if (!area) notFound();
  const content = areaSearchContent(area);
  return (
    <>
      <JsonLd
        data={[
          serviceSchema(`/areas/${area.slug}`, area),
          faqSchema(content.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service areas", path: "/areas" },
            { name: area.name, path: `/areas/${area.slug}` },
          ]),
        ]}
      />
      <LandingHero
        eyebrow="IN YOUR NEIGHBOURHOOD"
        title={
          <>
            Vehicle selling services in <span>{area.name}.</span>
          </>
        }
        description={content.intro}
        image="/vehicles/used-cars-cutout.webp"
        imageAlt="Sell your used car in Bangalore"
        href={`/contact?area=${area.slug}`}
        action="Start selling"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Explore vehicle selling services in {area.name}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {familyServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}?area=${area.slug}`}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="mt-3 text-muted-foreground">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Plan around your {area.name} routine</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.guidance.map(({ title, text }, i) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-bold text-primary">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-sm text-muted-foreground">
            This page introduces service categories to enquire about; it does not confirm a provider
            or availability in your area.
          </p>
        </div>
      </section>
      <ServiceFaqs
        title={`Questions about vehicle selling services in ${area.name}`}
        items={content.faqs}
      />
      <HomeCollectionSupport />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Explore nearby neighbourhoods</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {area.nearby.map((name) => {
            const other = serviceAreas.find((a) => a.name === name);
            return other ? (
              <Link
                className="rounded-full border border-border px-4 py-3"
                key={other.slug}
                href={`/areas/${other.slug}`}
              >
                {other.name}
              </Link>
            ) : null;
          })}
        </div>
        <Link href="/areas" className="mt-7 inline-block font-bold text-primary">
          See all Bangalore areas
        </Link>
      </section>
    </>
  );
}
