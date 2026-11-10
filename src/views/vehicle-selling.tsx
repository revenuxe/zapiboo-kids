import { servicesPaused, openingSoonHref } from "@/lib/launch-status";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { absoluteUrl, breadcrumbSchema, businessContact, faqSchema, siteUrl } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";
import { vehicleSellingContent } from "@/lib/vehicle-selling-content";
import { vehicleSellingLinks, type SellingVehicle } from "@/lib/vehicle-selling-links";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const copy = "text-base leading-relaxed text-muted-foreground";
const button =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

function routeFor(vehicle: SellingVehicle) {
  return vehicleSellingLinks.find((link) => link.key === vehicle)!;
}

export function sellingMetadata(vehicle: SellingVehicle) {
  const content = vehicleSellingContent[vehicle];
  return pageMetadata(routeFor(vehicle).path, content.title, content.description);
}

export default function VehicleSelling({ vehicle }: { vehicle: SellingVehicle }) {
  const content = vehicleSellingContent[vehicle];
  const route = routeFor(vehicle);
  const bookingHref = `/pickup?category=${content.booking}`;
  const whatsappHref = `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Zapiboo, I would like to ${route.label.toLowerCase()}. Can you help?`)}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: route.label, path: route.path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(route.path)}#service`,
            name: content.heading,
            description: content.description,
            url: absoluteUrl(route.path),
            serviceType: `Pre-loved kids ${vehicle} marketplace`,
            areaServed: { "@type": "City", name: "Bangalore" },
            provider: { "@id": `${siteUrl}/#organization` },
          },
          faqSchema(content.faqs),
        ]}
      />
      <section className="relative overflow-hidden bg-navy py-10 text-white sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(31,89,104,0.4),transparent_65%)]"
        />
        <div className={`relative ${container}`}>
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/70">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{route.label}</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-sky">
              {content.kicker}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl xl:text-6xl">
              {content.heading}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {content.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={bookingHref} className={button}>
                {content.cta}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </Link>
              <a
                href={servicesPaused ? openingSoonHref : whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10"
              >
                <WhatsAppIcon className="size-5 text-[#00C875]" />
                Chat on WhatsApp
              </a>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">
              {content.bookingHint}
            </p>
          </div>
        </div>
      </section>
      <nav aria-label="On this page" className="border-b border-border bg-secondary/40">
        <div className={`${container} flex flex-wrap gap-x-6 gap-y-3 py-5 text-sm font-semibold`}>
          <a href="#prepare" className="hover:text-primary">
            Preparation checklist
          </a>
          <a href="#selling-process" className="hover:text-primary">
            How it works
          </a>
          <a href="#faqs" className="hover:text-primary">
            Questions & answers
          </a>
        </div>
      </nav>
      <section className={`${container} py-14 sm:py-20`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            {content.overview.title}
          </h2>
          <p className={copy}>{content.overview.text}</p>
        </div>
      </section>
      <section
        id="prepare"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={`${container} grid gap-10 lg:grid-cols-2`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Before listing
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold">{content.preparationTitle}</h2>
            <ul className="mt-7 space-y-4">
              {content.preparation.map((item) => (
                <li key={item} className={`flex gap-3 ${copy}`}>
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-2xl font-bold">{content.documents.title}</h3>
            <p className={`mt-4 ${copy}`}>{content.documents.text}</p>
            <a
              href={businessContact.phoneHref}
              className="mt-6 inline-flex min-h-12 items-center gap-2 font-bold text-primary"
            >
              <Phone aria-hidden="true" className="size-4" />
              Need help? Call us
            </a>
          </div>
        </div>
      </section>
      <section id="selling-process" className={`${container} scroll-mt-24 py-14 sm:py-20`}>
        <h2 className="text-3xl font-bold">How selling works on Zapiboo</h2>
        <ol className="mt-8 grid gap-7 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className={`mt-3 ${copy}`}>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8">
          <h2 className="max-w-3xl text-balance text-2xl font-bold">{content.local.title}</h2>
          <p className={`mt-4 max-w-4xl ${copy}`}>{content.local.text}</p>
          <Link href={bookingHref} className={`mt-6 ${button}`}>
            List your item now
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
      <section
        id="faqs"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={container}>
          <h2 className="text-3xl font-bold">Common questions</h2>
          <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
            {content.faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className={`px-5 pb-5 ${copy}`}>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className={`${container} py-14 sm:py-20`}>
        <div className="rounded-3xl bg-navy px-6 py-10 text-center text-white sm:p-12">
          <h2 className="text-balance text-3xl font-bold">
            Ready to sell your pre-loved {vehicle}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/75">
            List for free, connect with local parents and give your items a second life.
            It takes less than a minute to get started.
          </p>
          <Link href={bookingHref} className={`mt-7 ${button}`}>
            {content.cta}
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
        <nav aria-label="Other categories" className="mt-10">
          <h2 className="text-lg font-bold">Selling something else?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vehicleSellingLinks
              .filter((link) => link.key !== vehicle)
              .map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.path}
                    className="flex h-full min-h-12 items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm font-semibold hover:border-primary hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </section>
    </>
  );
}
