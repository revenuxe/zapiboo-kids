import { familyServices, familySteps, familyFaqs } from "@/lib/family-service-catalog";
import { HomeHero } from "@/components/HomeHero";
import { HomeServiceGuide } from "@/components/HomeServiceGuide";
import { HomePreparation, HomeFinalCta } from "@/components/HomeSections";
import { serviceAreas } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Car, Check } from "lucide-react";
export default function Home() {
  return (
    <div className="modern-home">
      <HomeHero />
      <section id="sell-categories" className="home-shell home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">WHAT ARE YOU SELLING?</span>
            <h2>
              Every vehicle.
              <br />A new possibility.
            </h2>
          </div>
          <p>
            From your first bike to the family car.
            <br />
            Choose your vehicle to get started.
          </p>
        </div>
        <div className="home-category-grid">
          {familyServices.map((c, i) => (
            <Link
              key={c.id}
              href={"/marketplace?category=" + c.id}
              className="home-category-card"
              style={{ backgroundColor: c.accent_color }}
            >
              <div className="home-category-top">
                <span>0{i + 1}</span>
                <span className="home-category-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="home-category-image">
                <Image src={c.image_url} alt={c.name} fill sizes="(min-width:1024px) 350px, 46vw" />
              </div>
              <div className="home-category-caption">
                <h3>{c.name}</h3>
                <p>{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="home-category-foot">
          <Car size={16} />
          <p>One place for your next move.</p>
          <span>Cars, bikes, scooters and more.</span>
        </div>
      </section>
      <HomeServiceGuide />
      <section id="how-it-works" className="home-process">
        <div className="home-shell home-section">
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">THREE SIMPLE STEPS</span>
              <h2>
                Your vehicle sale.
                <br />
                Made clearer.
              </h2>
            </div>
            <Link href="/marketplace/sell" className="home-text-link">
              Get started <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="home-step-grid">
            {familySteps.map((s, i) => (
              <article key={s.title} className="home-step">
                <div className="home-step-top">
                  <span className="home-step-number">0{i + 1}</span>
                  <Car size={25} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="home-shell home-section">
        <div className="home-pickup-grid">
          <div className="home-pickup-photo">
            <Image
              src="/vehicles/used-suvs-light.webp"
              alt="Used SUV ready for its next owner"
              fill
              sizes="(min-width:1024px) 550px, 90vw"
              className="object-contain"
            />
          </div>
          <div className="home-pickup-copy">
            <span className="home-eyebrow">MOVE ON WITH CONFIDENCE</span>
            <h2>
              Your old vehicle.
              <br />
              Your next opportunity.
            </h2>
            <p>
              Upgrading, changing your commute or making room for something new? Start with your
              vehicle details and get a clear understanding of the selling process.
            </p>
            <ul>
              {[
                "Share the make, model, year and kilometres driven",
                "Discuss condition, service history and inspection",
                "Confirm the offer, payment and ownership transfer",
              ].map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/marketplace/sell" className="home-button">
              Tell us about your vehicle <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
      <HomePreparation />
      <section className="home-shell home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">IN YOUR NEIGHBOURHOOD</span>
            <h2>Sell your vehicle in Bangalore.</h2>
          </div>
          <p>Find your area and start a conversation.</p>
        </div>
        <div className="home-area-list home-area-list-full">
          {serviceAreas.map((a) => (
            <Link key={a.slug} href={"/areas/" + a.slug}>
              {a.name}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      </section>
      <section className="home-faq-section">
        <div className="home-shell home-faq-grid">
          <div>
            <span className="home-eyebrow">GOOD QUESTIONS</span>
            <h2>
              A little clarity.
              <br />A smoother sale.
            </h2>
            <p>
              Need help? <Link href="/contact">Talk to our team</Link>
            </p>
          </div>
          <div className="home-faq-list">
            {familyFaqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={19} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <HomeFinalCta />
    </div>
  );
}
