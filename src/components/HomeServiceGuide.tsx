import { familyServices } from "@/lib/family-service-catalog";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { servicesPaused } from "@/lib/launch-status";

export async function HomeServiceGuide() {
  const services = familyServices;
  return (
    <section
      id="what-we-pick-up"
      className="home-pickup-guide"
      aria-labelledby="pickup-guide-title"
    >
      <div className="home-shell home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">FROM FIRST STEPS TO NEW ADVENTURES</span>
            <h2 id="pickup-guide-title">
              What your family can explore.
              <br />
              <span>And what to ask before choosing.</span>
            </h2>
          </div>
          <div className="home-guide-heading-action">
            <p>
              From everyday support to special occasions.
              <br />
              Explore the options below, then tell us what you need.
            </p>
            <Link href="/contact" className="home-button">
              Send an enquiry
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="home-guide-grid">
          {services.map((category) => (
            <article key={category.id} className="home-guide-card" data-category={category.id}>
              <div className="home-guide-card-heading">
                <span
                  className="home-guide-thumbnail"
                  style={{ backgroundColor: category.accent_color }}
                >
                  <Image src={category.image_url} alt="" width={85} height={75} sizes="75px" />
                </span>
                <div>
                  <h3>{category.name}</h3>
                  <Link href={`/services/${category.id}`}>
                    View category
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
              <p className="home-guide-count">{category.types.length} options to explore</p>
              <ul className="home-guide-types">
                {category.types.map((type) => (
                  <li key={type}>
                    <Check size={13} />
                    {type}
                  </li>
                ))}
              </ul>
              <details className="home-guide-preparation">
                <summary>
                  Before you choose
                  <ChevronDown size={15} />
                </summary>
                <p>{category.preparation}</p>
              </details>
              <Link href={`/contact?service=${category.id}`} className="home-guide-sell">
                Enquire Service
                <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
        <div className="home-guide-standards">
          <div className="home-guide-standard">
            <span className="home-guide-standard-icon">
              <PackageCheck size={23} strokeWidth={1.5} />
            </span>
            <h3>A good fit for your child</h3>
            <p>
              Start with age, interests and your daily routine. Ask about age groups, schedules and
              a visit or trial session where available.
            </p>
          </div>
          <div className="home-guide-standard">
            <span className="home-guide-standard-icon">
              <ShieldCheck size={23} strokeWidth={1.5} />
            </span>
            <h3>Get to know the provider</h3>
            <p>
              Ask about experience, qualifications, supervision and references. Confirm what is
              included and who will be responsible for your child.
            </p>
          </div>
          <div className="home-guide-standard">
            <span className="home-guide-standard-icon">
              <CircleHelp size={23} strokeWidth={1.5} />
            </span>
            <h3>Agree the details first</h3>
            <p>
              Confirm fees, availability, cancellation terms and any special requirements directly
              with the provider before booking or paying.
            </p>
          </div>
        </div>
        <div className="home-guide-bottom">
          <div>
            <strong>Not sure where to begin?</strong>
            <p>Tell us what your family needs. Ask our team about the next step.</p>
          </div>
          <div className="home-guide-bottom-actions">
            <Link href="/contact" className="home-button">
              Share your requirements
              <ArrowUpRight size={18} />
            </Link>
            <Link href="/contact" className="home-text-link">
              Ask about a service
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <p className="home-guide-availability">
          {servicesPaused
            ? "Service enquiries are temporarily paused. You can still explore the categories."
            : "Services listed are categories to enquire about. Provider availability, fees and arrangements must be confirmed before booking."}
        </p>
      </div>
    </section>
  );
}
