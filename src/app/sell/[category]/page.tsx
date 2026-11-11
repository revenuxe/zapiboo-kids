import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import { LandingHero } from "@/components/LandingHero";
import {
  LandingBreadcrumbs,
  SellerCta,
  CategoryAdvice,
  SellerFaqs,
  CategoryAreaLinks,
} from "@/components/SellerLandingContent";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getSellingCategory, categoryImage, sellingCategories } from "@/lib/selling-categories";
import { getSellerGuide } from "@/lib/seller-guides";
import { servicesPaused } from "@/lib/launch-status";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, breadcrumbSchema, serviceSchema, itemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import {
  CategoryListingHelp,
  SellerBenefits,
  SellerQuestionBanner,
} from "@/components/SellerLandingSections";

type Props = { params: Promise<{ category: string }> };
export async function generateStaticParams() {
  return (await getPublicSellingCategories()).map(({ id }) => ({ category: id }));
}
export async function generateMetadata({ params }: Props) {
  const category = getSellingCategory((await params).category, await getPublicSellingCategories());
  if (!category) notFound();
  const guide = getSellerGuide(category);
  const metadata = pageMetadata(`/sell/${category.id}`, guide.title, guide.description);
  if (sellingCategories.some(({ id }) => id === category.id)) {
    const image = absoluteUrl(`/category-images/${category.id}`);
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: image, width: 420, height: 420, alt: category.name }],
    };
    metadata.twitter = { ...metadata.twitter, images: [image] };
  }
  return metadata;
}
export default async function Page({ params }: Props) {
  const category = getSellingCategory((await params).category, await getPublicSellingCategories());
  if (!category) notFound();
  const guide = getSellerGuide(category);
  const path = `/sell/${category.id}`;
  const pickupHref = `/pickup?category=${category.id}`;
  const questions = [
    ...guide.questions,
    {
      question: `How do I sell ${category.name.toLowerCase()} through Zapiboo?`,
      answer:
        "Choose the category, select the condition and add optional notes or a photo. Sign in to save your request. Pickup, sale and payment arrangements are confirmed by our team before handover when services are available.",
    },
    {
      question: "How much will I receive for my items?",
      answer:
        "There is no fixed online price or guaranteed payout. Item condition, completeness and review determine the next steps. Confirm the sale and payment terms with our team before deciding to hand over anything.",
    },
    {
      question: "Is doorstep pickup available now?",
      answer: servicesPaused
        ? "The Bangalore pickup service is opening soon. You can explore the selling flow and save your progress, but no collection is scheduled while bookings are paused."
        : "Share your exact address and preferred slot. Our team checks item eligibility and confirms pickup availability before collection.",
    },
  ];
  return (
    <>
      <JsonLd
        data={[
          serviceSchema(path, undefined, `Sell used ${category.name.toLowerCase()} in Bangalore`),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `Sell ${category.name.toLowerCase()}`, path },
          ]),
          itemListSchema(
            `${category.name} you can share for review`,
            category.types.map((name) => ({ name })),
          ),
        ]}
      />
      <LandingHero
        eyebrow="PRE-LOVED. READY FOR A NEW CHAPTER."
        title={
          <>
            Sell used <span>{category.name.toLowerCase()}</span> in Bangalore.
          </>
        }
        description={guide.intro}
        href={pickupHref}
        action="Start selling"
        image={
          sellingCategories.some(({ id }) => id === category.id)
            ? `/category-images/${category.id}`
            : category.image_url || categoryImage(category.id)
        }
        imageAlt={category.name}
      />
      <LandingBreadcrumbs
        items={[{ name: "Home", href: "/" }, { name: `Sell ${category.name.toLowerCase()}` }]}
      />
      <section className="home-shell seller-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">WHAT YOU CAN SHARE FOR REVIEW</span>
            <h2>
              From one favourite
              <br />
              to a whole collection.
            </h2>
          </div>
          <p>
            {category.description}
            <br />
            Acceptance is confirmed after item review.
          </p>
        </div>
        <div className="seller-item-types">
          {category.types.map((type) => (
            <Link key={type} href={pickupHref}>
              <Check size={16} />
              <span>{type}</span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
        <p className="seller-small-note">
          Something not listed? <Link href="/contact">Ask us about your item</Link> before making
          pickup plans.
        </p>
      </section>
      <SellerCta
        title={`Ready to pass on your ${category.name.toLowerCase()}?`}
        description="Start with the condition and a few useful details. No need to write a perfect listing."
        href={pickupHref}
        action="Share my items"
      />
      <CategoryAdvice category={category} />
      <CategoryListingHelp category={category} />
      <SellerBenefits href={pickupHref} />
      <section className="home-shell seller-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">KNOW WHAT HAPPENS NEXT</span>
            <h2>
              Clear steps.
              <br />
              Your decision.
            </h2>
          </div>
        </div>
        <div className="seller-advice-grid">
          {[
            {
              title: "Share the details",
              text: "Choose the condition and describe wear, missing parts or accessories. A photo is helpful but optional.",
            },
            {
              title: "Review the arrangements",
              text: "Our team reviews the request and explains eligibility, pickup availability and the proposed sale and payment details.",
            },
            {
              title: "Confirm before handover",
              text: "Ask questions and decide whether to proceed. A submission or preferred slot does not guarantee acceptance, pickup or a payment amount.",
            },
          ].map((step, index) => (
            <article key={step.title}>
              <span className="seller-advice-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
      <SellerFaqs
        title={`Questions about selling ${category.name.toLowerCase()}`}
        questions={questions}
      />
      <SellerQuestionBanner href={pickupHref} subject={category.name.toLowerCase()} />
      <CategoryAreaLinks category={category.name} />
      <SellerCta
        title="Keep the memories. Make some room."
        description={`Give your pre-loved ${category.name.toLowerCase()} a chance at a new chapter. Share the details and let our team guide the next steps.`}
        href={pickupHref}
        action={`Sell my ${category.name.toLowerCase()}`}
      />
    </>
  );
}
