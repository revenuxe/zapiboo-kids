import { servicesPaused, openingSoonHref } from "@/lib/launch-status";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Car,
  Check,
  ChevronDown,
  ClipboardCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { modelSellingContent } from "@/lib/model-selling-content";
import { modelPath, sellingModels, type ModelSlug } from "@/lib/selling-models";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, breadcrumbSchema, businessContact, faqSchema, siteUrl } from "@/lib/seo";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const copy = "text-base leading-relaxed text-muted-foreground";
const button =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const suvSlugs: ModelSlug[] = ["hyundai-creta", "maruti-brezza", "tata-nexon"];

function getModel(slug: ModelSlug) {
  return sellingModels.find((model) => model.slug === slug)!;
}

export function modelSellingMetadata(slug: ModelSlug) {
  const model = getModel(slug);
  return pageMetadata(
    modelPath(model),
    `Sell Used ${model.shortName} in Bangalore | Zapiboo`,
    modelSellingContent[slug].description,
  );
}

export default function ModelSelling({ slug }: { slug: ModelSlug }) {
  const model = getModel(slug);
  const content = modelSellingContent[slug];
  const path = modelPath(model);
  const isSuv = suvSlugs.includes(slug);
  const categoryName = isSuv ? "SUV" : model.category;
  const categoryPath = `/sell-used-${isSuv ? "suv" : model.category}-bangalore`;
  const categoryLabel = `${isSuv ? "SUV" : model.category === "car" ? "Car" : model.category === "bike" ? "Bike" : "Scooter"} selling in Bangalore`;
  const bookingHref = `/pickup?vehicle=${model.category}`;
  const cta = `Book a ${model.shortName} inspection`;
  const whatsappHref = `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Zapiboo, I want to sell my ${model.name} in Bangalore. Please help me arrange an inspection.`)}`;
  const Icon = model.category === "car" ? Car : Bike;
  const related = sellingModels
    .filter((item) => item.category === model.category && item.slug !== slug)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: categoryLabel, path: categoryPath },
            { name: model.name, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(path)}#service`,
            name: `Sell your ${model.name} in Bangalore`,
            description: content.description,
            url: absoluteUrl(path),
            serviceType: `Used ${model.name} inspection and selling assistance`,
            areaServed: { "@type": "City", name: "Bangalore" },
            provider: { "@id": `${siteUrl}/#organization` },
          },
          faqSchema(content.faqs),
        ]}
      />
      <section className="relative overflow-hidden bg-navy py-10 text-white sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(31,89,104,0.4),transparent_65%)]"
        />
        <div className={`relative ${container}`}>
          <nav aria-label="Breadcrumb" className="mb-9 text-sm text-white/70">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={categoryPath} className="hover:text-white">
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{model.shortName}</li>
            </ol>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-sky">
                A closer look at your {categoryName}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl xl:text-6xl">
                Sell your {model.shortName} in Bangalore
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {content.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={bookingHref} className={button}>
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </Link>
                <a
                  href={servicesPaused ? openingSoonHref : whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10"
                >
                  <WhatsAppIcon className="size-5 text-[#00C875]" />
                  Discuss this model
                </a>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {isSuv
                  ? "Start under Car, choose SUV, then enter your brand, model and year."
                  : `The ${model.category} category opens first. Choose the type and brand, then enter your model and year.`}
              </p>
            </div>
            <aside
              aria-label="Your model inspection"
              className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <Icon aria-hidden="true" className="size-12 text-brand-sky" />
                <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold">
                  Bangalore
                </span>
              </div>
              <p className="mt-7 text-sm text-white/65">Your model, in focus</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{model.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-white/80">{content.focus}</p>
              <ul className="mt-7 space-y-4 border-t border-white/15 pt-6">
                {[
                  "Free doorstep inspection",
                  "Offer after the vehicle is reviewed",
                  "You decide whether to proceed",
                ].map((text) => (
                  <li key={text} className="flex gap-3 text-sm leading-relaxed">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-sky" />
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-white/60">
                Confirm eligibility for your version and appointment availability with the team.
              </p>
            </aside>
          </div>
        </div>
      </section>
      <nav aria-label="Model page sections" className="border-b border-border bg-secondary/40">
        <div className={`${container} flex flex-wrap gap-x-6 gap-y-3 py-5 text-sm font-semibold`}>
          <a href="#model-details" className="hover:text-primary">
            Identify your version
          </a>
          <a href="#model-value" className="hover:text-primary">
            Valuation factors
          </a>
          <a href="#inspection" className="hover:text-primary">
            Prepare for inspection
          </a>
          <a href="#model-faqs" className="hover:text-primary">
            Model FAQs
          </a>
        </div>
      </nav>
      <section id="model-details" className={`${container} scroll-mt-24 py-14 sm:py-20`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            {content.identity.title}
          </h2>
          <p className={copy}>{content.identity.text}</p>
        </div>
        <div id="model-value" className="scroll-mt-24 pt-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Understand the assessment
          </p>
          <h2 className="mt-3 max-w-3xl text-balance text-3xl font-bold">
            What matters when valuing your {model.shortName}?
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {content.valuation.map((topic, index) => (
              <article key={topic.title} className="rounded-2xl border border-border bg-card p-6">
                <span aria-hidden="true" className="text-sm font-extrabold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{topic.title}</h3>
                <p className={`mt-4 ${copy}`}>{topic.text}</p>
              </article>
            ))}
          </div>
          <p className={`mt-6 max-w-4xl ${copy}`}>
            An advertised asking price for another {model.shortName} is a reference point, not a
            confirmed sale value. Your version, ownership history, condition and market demand need
            to be considered together. A booking starts an inspection request; it does not calculate
            an instant price.
          </p>
        </div>
      </section>
      <section
        id="inspection"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={`${container} grid gap-10 lg:grid-cols-2`}>
          <div>
            <ClipboardCheck aria-hidden="true" className="size-7 text-primary" />
            <h2 className="mt-4 text-balance text-3xl font-bold">
              Get your {model.shortName} ready for the visit
            </h2>
            <ul className="mt-7 space-y-4">
              {content.checklist.map((item) => (
                <li key={item} className={`flex gap-3 ${copy}`}>
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-2xl font-bold">Keep the paperwork alongside the vehicle history</h3>
            <p className={`mt-4 ${copy}`}>
              Have your registration certificate, insurance information and available service
              records ready. Mention active finance, a missing document or a different registered
              owner early. Confirm the checklist for your transaction with the team and any lender
              involved before agreeing to handover.
            </p>
            <p className={`mt-4 ${copy}`}>
              List the keys and equipment included, ask about payment and RC transfer support, and
              keep copies of the agreed terms and handover record.
            </p>
            <a
              href={businessContact.phoneHref}
              className="mt-6 inline-flex min-h-12 items-center gap-2 font-bold text-primary"
            >
              <Phone aria-hidden="true" className="size-4" />
              Talk through your sale
            </a>
          </div>
        </div>
      </section>
      <section className={`${container} py-14 sm:py-20`}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <MapPin aria-hidden="true" className="size-7 text-primary" />
            <h2 className="mt-4 text-balance text-3xl font-bold">Plan your Bangalore inspection</h2>
          </div>
          <div>
            <p className={copy}>{content.visit}</p>
            <p className={`mt-4 ${copy}`}>
              Enter the inspection address and pincode, choose an available appointment and confirm
              access arrangements. After the visit, review the offer and ask the team to explain
              payment, paperwork and handover before you decide.
            </p>
            <Link href={bookingHref} className={`mt-6 ${button}`}>
              Check inspection availability
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <section
        id="model-faqs"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={container}>
          <h2 className="text-balance text-3xl font-bold">
            Questions about selling a {model.shortName}
          </h2>
          <div className="mt-8 grid gap-4">
            {content.faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className={`max-w-4xl px-5 pb-5 ${copy}`}>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className={`${container} py-14 sm:py-20`}>
        <div className="rounded-3xl bg-navy px-6 py-10 text-center text-white sm:p-12">
          <h2 className="text-balance text-3xl font-bold">Ready to take the next step?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">
            Share your {model.shortName}'s details, arrange a free inspection and make your decision
            after reviewing the offer.
          </p>
          <Link href={bookingHref} className={`mt-7 ${button}`}>
            {cta}
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
        <nav aria-label="Related model guides" className="mt-10">
          <h2 className="text-lg font-bold">Compare selling advice for other models</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={modelPath(item)}
                  className="flex h-full min-h-12 items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm font-semibold hover:border-primary hover:text-primary"
                >
                  {item.shortName}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={categoryPath}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"
          >
            Explore the {categoryName} selling guide
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      </section>
    </>
  );
}
