import Link from "next/link";
import Image from "next/image";
import type { FamilyService } from "@/lib/family-service-catalog";
import { ArrowUpRight, Check } from "lucide-react";
export function HomePreparation() {
  return (
    <section className="home-preparation-section">
      <div className="home-shell home-preparation-grid">
        <div className="home-prep-board">
          <div className="home-prep-board-top">
            <span className="home-eyebrow">YOUR VEHICLE SELLING CHECKLIST</span>
          </div>
          <h3>
            A little preparation.
            <br />A smoother next step.
          </h3>
          <div className="home-prep-tasks">
            {[
              ["Vehicle details", "Make, model, year and kilometres driven."],
              ["Condition & history", "Service records, repairs and known damage."],
              ["Documents ready", "Registration, insurance and outstanding loan details."],
            ].map(([t, d]) => (
              <div key={t}>
                <Check size={20} />
                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="home-prep-copy">
          <span className="home-eyebrow">START WITH THE DETAILS</span>
          <h2>
            Ready to sell
            <br />
            your used vehicle?
          </h2>
          <p>
            Share accurate details so our team can understand your vehicle. Keep your records handy
            and tell us your preferred timing and Bangalore neighbourhood.
          </p>
          <div className="home-prep-tip">
            <span>GOOD TO KNOW</span>
            <p>
              Final offers depend on vehicle review. Confirm payment, handover and ownership
              transfer arrangements before completing a sale.
            </p>
          </div>
          <Link href="/marketplace/sell" className="home-text-link">
            Start your selling enquiry <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
export function HomeCollectionSupport() {
  return (
    <section className="home-shell home-collection-wrap">
      <div className="home-collection">
        <div>
          <span className="home-eyebrow">A QUESTION ABOUT YOUR VEHICLE?</span>
          <h2>Let&apos;s talk about your next move.</h2>
          <p>
            Share your vehicle category, condition and location. Our team can explain the next
            steps.
          </p>
        </div>
        <Link href="/marketplace/sell" className="home-collection-link">
          Talk to our team <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function HomeFinalCta() {
  return (
    <section className="home-shell home-final-wrap">
      <div className="home-grand-cta">
        <div className="home-grand-copy">
          <span className="home-eyebrow">YOUR NEXT JOURNEY STARTS HERE</span>
          <h2>
            New roads.
            <br />
            New plans.
            <br />
            <span>Let&apos;s move forward.</span>
          </h2>
          <p>
            Sell your used car, bike, scooter or more.
            <br />
            Start with a conversation.
          </p>
          <div className="home-grand-actions">
            <Link href="/marketplace/sell" className="home-grand-button">
              Sell your used vehicle <ArrowUpRight size={22} />
            </Link>
          </div>
          <span className="home-grand-note">
            Offers and arrangements are confirmed after review.
          </span>
        </div>
        <div className="home-grand-art">
          <div className="home-grand-orbit" />
          <div className="home-grand-toys">
            <span>READY FOR A NEW ROAD</span>
            <Image src="/vehicles/used-cars-cutout.webp" alt="Used car" width={340} height={270} />
            <strong>Your next chapter.</strong>
          </div>
          <div className="home-grand-books">
            <Image src="/vehicles/used-bikes-cutout.webp" alt="Used bike" width={200} height={160} />
            <span>Keep moving.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeMoments({ categories }: { categories: readonly FamilyService[] }) {
  return <HomeQuickStart categories={categories} />;
}
export function HomeQuickStart({ categories }: { categories: readonly FamilyService[] }) {
  return (
    <section className="home-shell home-section">
      <h2>Choose your vehicle</h2>
      {categories.map((c) => (
        <Link key={c.id} href={"/marketplace?category=" + c.id} className="home-text-link">
          {c.name}
          <ArrowUpRight size={18} />
        </Link>
      ))}
    </section>
  );
}
