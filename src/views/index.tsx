import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import { HomePickupGuide } from "@/components/HomePickupGuide";
import {
  HomeMoments,
  HomePreparation,
  HomeCollectionSupport,
  HomeFinalCta,
  HomeQuickStart,
} from "@/components/HomeSections";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Recycle,
  Sparkles,
} from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { steps } from "@/lib/site-data";
import { featuredServiceAreas, serviceAreas } from "@/lib/seo";
import { servicesPaused } from "@/lib/launch-status";
import pickupImage from "@/assets/kids-doorstep-pickup.webp";

const faqs = [
  [
    "What can I sell?",
    "Toys, books, kids clothing, baby gear, cycles, ride-ons and kids electronics. Items should be clean, safe to use and honestly described.",
  ],
  [
    "Can I sell a bundle?",
    "Yes. Choose the closest category and use Anything else to describe what is included.",
  ],
  [
    "What happens after I share my details?",
    "When bookings are available, our team reviews your items and confirms pickup availability, sale details and payment arrangements before handover.",
  ],
  [
    "Are pickups available now?",
    servicesPaused
      ? "We are preparing our pickup service. You can explore categories and create an account; an opening-soon message will appear while bookings are paused."
      : "Share your address and WhatsApp number in the pickup form. Our team will confirm a convenient collection time with you.",
  ],
];

export default async function Home() {
  const categories = await getPublicSellingCategories();
  const areas = serviceAreas.filter((area) => featuredServiceAreas.includes(area.slug));
  return (
    <div className="modern-home">
      <HomeHero categories={categories} />
      <section id="sell-categories" className="home-section home-shell">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">MAKE ROOM FOR WHAT’S NEXT</span>
            <h2>
              Little things.
              <br className="sm:hidden" /> Lots of potential.
            </h2>
          </div>
          <p>
            What have they outgrown?
            <br />
            Pick a category. We’ll take it from here.
          </p>
        </div>
        <div className="home-category-grid">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/pickup?category=${category.id}`}
              className="home-category-card"
              style={{ backgroundColor: category.accent_color }}
            >
              <div className="home-category-top">
                <span>0{i + 1}</span>
                <span className="home-category-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="home-category-image">
                <Image
                  src={category.image_url || `/sell-categories/${category.id}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 46vw"
                />
              </div>
              <div className="home-category-caption">
                <h3>Sell {category.name.toLowerCase()}</h3>
                <p>{category.tagline || category.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="home-category-foot">
          <Heart size={16} />
          <p>A little used. A lot left to give.</p>
          <span>Clean, safe, and ready for a new home.</span>
        </div>
      </section>

      <HomePickupGuide />

      <HomeMoments categories={categories} />

      <HomeQuickStart categories={categories} />

      <section id="how-it-works" className="home-process">
        <div className="home-shell home-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">LESS TO DO. MORE TO LOOK FORWARD TO.</span>
              <h2>
                Small steps.
                <br />A fresh start.
              </h2>
            </div>
            <Link href="/pickup" className="home-text-link">
              Let’s get started <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="home-step-grid">
            {steps.map((step, i) => (
              <article key={step.title} className="home-step">
                <div className="home-step-top">
                  <span className="home-step-number">0{i + 1}</span>
                  <step.icon size={25} strokeWidth={1.5} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-shell home-section">
        <div className="home-pickup-grid">
          <div className="home-pickup-photo">
            <Image
              src={pickupImage}
              alt="Zapiboo doorstep pickup of pre-loved kids items"
              fill
              sizes="(min-width: 1024px) 550px, 90vw"
              className="object-cover"
            />
            <span className="home-photo-label">
              <MapPin size={15} /> From your home. To a new story.
            </span>
          </div>
          <div className="home-pickup-copy">
            <span className="home-eyebrow">YOUR SOFA IS A GREAT STARTING POINT</span>
            <h2>
              You stay home.
              <br />
              We’ll come over.
            </h2>
            <p>
              No packing the car. No running around. Share what you’d like to sell, and our team
              will help arrange the next steps.
            </p>
            <ul>
              {[
                "Pickup timing confirmed with you",
                "A little guidance on getting items ready",
                "Sale & payment details agreed before handover",
              ].map((text) => (
                <li key={text}>
                  <Check size={17} />
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/pickup" className="home-button">
              Arrange a pickup <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <HomePreparation />

      <section className="home-shell">
        <div className="home-purpose">
          <div className="home-purpose-icon">
            <Recycle size={38} strokeWidth={1.4} />
          </div>
          <div>
            <span className="home-eyebrow">GROWING UP SHOULDN’T MEAN THROWING AWAY</span>
            <h2>
              Good things deserve
              <br />a second childhood.
            </h2>
            <p>
              More room in your home. More life in their favourite things.
              <br />
              That’s a little change worth making.
            </p>
            <Link href="/pickup" className="home-text-link home-purpose-cta">
              Give your items a second chapter
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <Sparkles className="home-purpose-sparkle" size={62} strokeWidth={1} />
        </div>
      </section>

      <section className="home-shell home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">
              <MapPin size={14} /> IN YOUR NEIGHBOURHOOD
            </span>
            <h2>Hey, Bangalore.</h2>
          </div>
          <p>
            We’re keeping it local.
            <br />
            Contact us to confirm pickup in your area.
          </p>
        </div>
        <div className="home-area-list">
          {areas.map((area) => (
            <Link key={area.slug} href={`/areas/${area.slug}`}>
              {area.name}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
        <Link href="/areas" className="home-text-link home-all-areas">
          Explore all service areas <ArrowRight size={17} />
        </Link>
      </section>

      <HomeCollectionSupport />

      <section className="home-faq-section">
        <div className="home-shell home-faq-grid">
          <div>
            <span className="home-eyebrow">GOOD QUESTIONS</span>
            <h2>
              A little clarity.
              <br />A lot less guesswork.
            </h2>
            <p>
              Need a hand?{" "}
              <Link href="/contact">
                Let’s talk <ArrowUpRight size={14} />
              </Link>
            </p>
          </div>
          <div className="home-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={19} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <HomeFinalCta />
    </div>
  );
}
