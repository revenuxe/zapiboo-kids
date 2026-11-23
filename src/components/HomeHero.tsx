"use client";

import { familyServices, type FamilyService } from "@/lib/family-service-catalog";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Car, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
export function HomeHero({
  categories = familyServices,
}: {
  categories?: readonly FamilyService[];
}) {
  const { user } = useAuth();
  const sellHref = user
    ? "/marketplace/sell"
    : "/auth?redirectTo=%2Fmarketplace%2Fsell";

  return (
    <section
      id="sell-vehicle"
      className="home-hero"
      aria-label="Sell your used vehicle in Bangalore"
    >
      <div className="home-shell home-hero-grid">
        <div className="home-hero-copy">
          <span className="home-eyebrow">
            <span className="home-status-dot" />
            CARS, BIKES, SCOOTERS & MORE
          </span>
          <h1>
            Sell your used
            <br />
            <span className="home-loved">
              vehicle.
              <svg viewBox="0 0 400 20" aria-hidden="true">
                <path d="M4 14 Q180 -5 394 10" />
              </svg>
            </span>
          </h1>
          <p>
            A new journey starts with a simple step. Sell your used car, bike, scooter or commercial
            vehicle in Bangalore. Share the details and let&apos;s talk about what comes next.
          </p>
          <div className="home-hero-actions">
            <Link href={sellHref} className="home-button">
              Sell your vehicle <ArrowUpRight size={20} />
            </Link>
            <Link href="/marketplace" className="home-whatsapp-button">
              Browse listings <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="home-hero-notes">
            <span>
              <MapPin size={15} />
              Bangalore
            </span>
            <span>
              <ShieldCheck size={16} />
              Clear steps. Personal support.
            </span>
          </div>
        </div>
        <div className="home-collage" aria-label="Used cars and bikes">
          <span className="home-collage-orbit" />
          <div className="home-mini-note">
            <Car size={18} />
            Your next chapter.
          </div>
          <Link href="/marketplace?category=used-cars" className="home-display-card home-display-toys">
            <div className="home-display-label">
              <span>SELL USED CARS</span>
              <ArrowUpRight size={18} />
            </div>
            <Image
              src={categories[0].image_url}
              alt="Silver hatchback car on a light background"
              width={440}
              height={330}
              sizes="(max-width: 639px) 68vw, 360px"
              preload
            />
            <div className="home-display-bottom">
              <strong>
                New roads.
                <br />
                New possibilities.
              </strong>
              <span className="home-round-arrow">
                <ArrowUpRight size={22} />
              </span>
            </div>
          </Link>
          <Link href="/marketplace?category=used-bikes" className="home-display-card home-display-books">
            <span>SELL USED BIKES</span>
            <Image src={categories[1].image_url} alt="Used motorcycle" width={200} height={170} />
            <strong>
              Ready to move on <ArrowUpRight size={15} />
            </strong>
          </Link>
          <div className="home-circle-stamp">
            <Car size={23} />
            <span>
              SELL.
              <br />
              MOVE FORWARD.
            </span>
          </div>
          <div className="home-pickup-note">
            <span>
              <ShieldCheck size={21} />
            </span>
            <div>
              <strong>Your vehicle. Your decision.</strong>
              <small>Discuss the details before you commit.</small>
            </div>
          </div>
        </div>
      </div>
      <div className="home-values-strip">
        <span>Cars, bikes & more</span>
        <span aria-hidden="true">✳</span>
        <span>Vehicle selling made simpler</span>
        <span aria-hidden="true">✳</span>
        <span>Made for Bangalore</span>
      </div>
    </section>
  );
}
