import { familyServices } from "@/lib/family-service-catalog";
import type { FamilyService } from "@/lib/family-service-catalog";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Sparkles, CalendarDays } from "lucide-react";

export function HomeHero({
  categories = familyServices,
}: {
  categories?: readonly FamilyService[];
}) {
  const featured =
    categories.find((category) => category.id === "play-entertainment") || categories[0];
  const secondary =
    categories.find(
      (category) => category.id === "preschool-daycare" && category.id !== featured?.id,
    ) || categories.find((category) => category.id !== featured?.id);
  return (
    <section
      id="sell-kids-items"
      className="home-hero"
      aria-label="Kids and family services in Bangalore"
    >
      <div className="home-shell home-hero-grid">
        <div className="home-hero-copy">
          <span className="home-eyebrow">
            <span className="home-status-dot" /> PRESCHOOL, DAYCARE & KIDS ACTIVITIES
          </span>
          <h1>
            Kids services.
            <br />
            In{" "}
            <span className="home-loved">
              Bangalore.
              <svg viewBox="0 0 400 20" aria-hidden="true">
                <path d="M4 14 Q180 -5 394 10" />
              </svg>
            </span>
          </h1>
          <p>
            Find a starting point for preschool, daycare, kids classes, play areas and birthday
            celebrations in Bangalore. Explore babysitting, nanny and development support too.
          </p>
          <div className="home-hero-actions">
            <Link href="#sell-categories" className="home-button">
              Explore services <ArrowUpRight size={20} />
            </Link>
            <a
              href={`${businessContact.whatsappHref}?text=${encodeURIComponent("Hi Zapiboo, I would like to explore services for my family in Bangalore. Can you help?")}`}
              target="_blank"
              rel="noreferrer"
              className="home-whatsapp-button"
            >
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="home-hero-notes">
            <span>
              <MapPin size={15} /> Made for Bangalore
            </span>
            <span>
              <CalendarDays size={16} /> Care, learning & play
            </span>
          </div>
        </div>
        <div className="home-collage" aria-label="Discover learning and play for your child">
          <span className="home-collage-orbit" aria-hidden="true" />
          <div className="home-mini-note">
            <Heart size={18} fill="currentColor" /> More play. More joy.
          </div>
          <Link
            href={featured ? `/services/${featured.id}` : "/contact"}
            className="home-display-card home-display-toys"
          >
            <div className="home-display-label">
              <span>PLAY & ENTERTAINMENT</span>
              <ArrowUpRight size={18} />
            </div>
            <Image
              src={featured?.image_url || "/services/play-entertainment.webp"}
              alt={featured?.name || "Play and entertainment"}
              width={440}
              height={330}
              preload
              sizes="(max-width: 600px) 70vw, 360px"
            />
            <div className="home-display-bottom">
              <strong>
                Big smiles.
                <br />
                Endless possibilities.
              </strong>
              <span className="home-round-arrow">
                <ArrowUpRight size={22} />
              </span>
            </div>
          </Link>
          <Link
            href={secondary ? `/services/${secondary.id}` : "/contact"}
            className="home-display-card home-display-books"
          >
            <span>PRESCHOOL & DAYCARE</span>
            <Image
              src={secondary?.image_url || "/services/preschool-daycare.webp"}
              alt={secondary?.name || "Early learning and daycare"}
              width={200}
              height={170}
              sizes="180px"
            />
            <strong>
              Start their story <ArrowUpRight size={15} />
            </strong>
          </Link>
          <div className="home-circle-stamp">
            <Sparkles size={23} />
            <span>
              LEARN.
              <br />
              PLAY. GROW.
            </span>
          </div>
          <div className="home-pickup-note">
            <span>
              <CalendarDays size={21} />
            </span>
            <div>
              <strong>Your next chapter starts here</strong>
              <small>Your family. Your kind of support.</small>
            </div>
          </div>
        </div>
      </div>
      <div className="home-values-strip">
        <span>Little discoveries, big possibilities</span>
        <span aria-hidden="true">&#10035;</span>
        <span>Care for every stage of childhood</span>
        <span aria-hidden="true">&#10035;</span>
        <span>More happy moments together</span>
      </div>
    </section>
  );
}
