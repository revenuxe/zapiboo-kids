import { familyServices, familySteps, familyFaqs } from "@/lib/family-service-catalog";
import { HomeServiceGuide } from "@/components/HomeServiceGuide";
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
  Sprout,
  Sparkles,
} from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { CalendarClock } from "lucide-react";
import { serviceAreas } from "@/lib/seo";

export default async function Home() {
  const categories = familyServices;
  const areas = serviceAreas;
  return (
    <div className="modern-home">
      <HomeHero categories={categories} />
      <section id="sell-categories" className="home-section home-shell">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">FOR EVERY STAGE OF CHILDHOOD</span>
            <h2>
              Care, learning & play.
              <br className="sm:hidden" /> For every stage.
            </h2>
          </div>
          <p>
            From preschool to after-school activities.
            <br />
            Explore six services for families in Bangalore.
          </p>
        </div>
        <div className="home-category-grid">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/services/${category.id}`}
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
                  src={category.image_url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 46vw"
                />
              </div>
              <div className="home-category-caption">
                <h3>{category.name}</h3>
                <p>{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="home-category-foot">
          <Heart size={16} />
          <p>Learning, care and happy memories.</p>
          <span>Thoughtful choices for your family.</span>
        </div>
      </section>

      <HomeServiceGuide />

      <HomeMoments categories={categories} />

      <HomeQuickStart categories={categories} />

      <section id="how-it-works" className="home-process">
        <div className="home-shell home-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">LESS TO DO. MORE TO LOOK FORWARD TO.</span>
              <h2>
                Your next step.
                <br />
                Made simpler.
              </h2>
            </div>
            <Link href="/contact" className="home-text-link">
              Let’s get started <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="home-step-grid">
            {familySteps.map((step, i) => (
              <article key={step.title} className="home-step">
                <div className="home-step-top">
                  <span className="home-step-number">0{i + 1}</span>
                  <CalendarClock size={25} strokeWidth={1.5} />
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
              src="/services/babysitting-nannies.webp"
              alt="A caring nanny reading with young children"
              fill
              sizes="(min-width: 1024px) 550px, 90vw"
              className="object-contain"
            />
            <span className="home-photo-label">
              <MapPin size={15} /> Local choices. Personal conversations.
            </span>
          </div>
          <div className="home-pickup-copy">
            <span className="home-eyebrow">FIND WHAT FITS YOUR FAMILY</span>
            <h2>
              Your routine.
              <br />
              Their next adventure.
            </h2>
            <p>
              From weekday care to weekend plans, start with your child’s age, interests and your
              neighbourhood. Ask the questions that matter before choosing a service.
            </p>
            <ul>
              {[
                "Age, timing and location that work for you",
                "Useful questions for visits and trial sessions",
                "Fees and availability confirmed before booking",
              ].map((text) => (
                <li key={text}>
                  <Check size={17} />
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="home-button">
              Share your requirements <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <HomePreparation />

      <section className="home-shell">
        <div className="home-purpose">
          <div className="home-purpose-icon">
            <Sprout size={38} strokeWidth={1.4} />
          </div>
          <div>
            <span className="home-eyebrow">A LITTLE SUPPORT GOES A LONG WAY</span>
            <h2>
              Every child deserves
              <br />
              room to flourish.
            </h2>
            <p>
              New interests. Caring support. Moments to remember.
              <br />
              Find the next step that feels right for your family.
            </p>
            <Link href="/contact" className="home-text-link home-purpose-cta">
              Find support for your family
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
            <h2>Kids services in your Bangalore neighbourhood.</h2>
          </div>
          <p>
            We’re keeping it local.
            <br />
            Ask about services near your home.
          </p>
        </div>
        <div className="home-area-list home-area-list-full">
          {areas.map((area) => (
            <Link key={area.slug} href={`/areas/${area.slug}`}>
              {area.name}
              <ArrowUpRight size={15} />
            </Link>
          ))}
          <Link href="/areas" className="home-area-explore">
            Explore all service areas <ArrowRight size={17} />
          </Link>
        </div>
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
            {familyFaqs.map(([question, answer]) => (
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
