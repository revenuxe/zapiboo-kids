import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { familyServices, serviceEnquiryHref } from "@/lib/family-service-catalog";
import { LandingHero } from "@/components/LandingHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";
import { serviceSearchContent, serviceHeadings } from "@/lib/service-search-content";
import { ServiceFaqs } from "@/components/ServiceFaqs";
import { faqSchema, getAreaBySlug, itemListSchema } from "@/lib/seo";

type Props = { params: Promise<{ service: string }>; searchParams?: Promise<{ area?: string }> };
export function generateStaticParams() {
  return familyServices.map(({ id }) => ({ service: id }));
}
async function resolveService(params: Props["params"]) {
  const { service } = await params;
  const category = familyServices.find((item) => item.id === service);
  if (!category) notFound();
  return category;
}
export async function generateMetadata({ params }: Props) {
  const category = await resolveService(params);
  return pageMetadata(
    `/services/${category.id}`,
    serviceSearchContent[category.id].title,
    serviceSearchContent[category.id].description,
  );
}
export default async function ServicePage({ params, searchParams }: Props) {
  const category = await resolveService(params);
  const content = serviceSearchContent[category.id];
  const area = getAreaBySlug((await searchParams)?.area ?? "");
  const href = serviceEnquiryHref(category.id, area?.slug);
  const path = `/services/${category.id}`;
  return (
    <>
      <JsonLd
        data={[
          serviceSchema(path, undefined, `${category.name} enquiries in Bangalore`),
          faqSchema(content.faqs),
          itemListSchema(
            `${category.name} options`,
            category.types.map((name) => ({ name })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: category.name, path },
          ]),
        ]}
      />
      <LandingHero
        eyebrow="SELL YOUR VEHICLE IN BANGALORE"
        title={
          <>
            {serviceHeadings[category.id].lead} <span>{serviceHeadings[category.id].accent}</span>
          </>
        }
        description={content.intro}
        image={category.image_url}
        imageAlt={`${category.name} illustration`}
        href={href}
        action="Sell your vehicle"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Find your starting point</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {category.types.map((type, index) => (
            <article key={type} className="rounded-2xl border border-border bg-card p-6">
              <Check className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">{type}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{content.options[index]}</p>
              <Link
                href={href}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
              >
                Start selling <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Before you choose</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
            {category.preparation}
          </p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
            Share your area, vehicle model, year, kilometres driven and condition. An enquiry does
            not confirm an offer or sale. Confirm inspection, payment and ownership transfer
            arrangements before proceeding.
          </p>
        </div>
      </section>
      <ServiceFaqs title={`${category.name}: your questions answered`} items={content.faqs} />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Let&apos;s talk about your vehicle</h2>
        <p className="mt-4 text-muted-foreground">
          {area
            ? `Tell us what you want to sell in ${area.name}. Your area will be included in the enquiry.`
            : "Share your Bangalore neighbourhood, vehicle model and year and preferred schedule. Ask about fees and availability before booking."}
        </p>
        <Link href={href} className="home-button mt-7">
          Start selling <ArrowUpRight size={19} />
        </Link>
      </section>
    </>
  );
}
