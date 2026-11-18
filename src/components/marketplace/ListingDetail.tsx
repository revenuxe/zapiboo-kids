"use client";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Loader2,
  CalendarDays,
  Gauge,
  Fuel,
  Settings2,
  Users,
  Check,
  Flag,
} from "lucide-react";
import { sampleListings, money, categoryLabel, type VehicleListing } from "@/lib/marketplace";
import { useSavedVehicles } from "@/hooks/use-saved-vehicles";
import { useAuth } from "@/hooks/use-auth";
import { ListingCard } from "./ListingCard";
import { ListingGallery } from "./ListingGallery";
import { FloatingContactActions } from "@/components/FloatingContactActions";
import { toast } from "sonner";
export function ListingDetail({ id }: { id: string }) {
  const example = sampleListings.find((l) => l.id === id);
  const { data, error, isLoading } = useSWR(
    example ? null : "/api/marketplace/" + id,
    async (url: string) => {
      const r = await fetch(url);
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      return b.listing as VehicleListing;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const listing = example ?? data;
  const [pending, setPending] = useState(false);
  const { user } = useAuth();
  const { saved, toggle } = useSavedVehicles();
  async function share() {
    try {
      const url = window.location.href;
      if (navigator.share) await navigator.share({ title: listing?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Listing link copied.");
      }
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError")
        toast.error("Could not share. Copy the link from your browser.");
    }
  }
  function contact() {
    if (!listing || listing.demo) return;
    setPending(true);
    const destination = "/chats?listing=" + encodeURIComponent(id);
    window.location.assign(
      user ? destination : "/auth?redirectTo=" + encodeURIComponent(destination),
    );
  }
  if (isLoading)
    return (
      <div className="marketplace">
        <div className="mp-shell">
          <div className="mp-detail-loading">
            <Loader2 className="animate-spin" size={30} />
            <p>Getting your next ride ready…</p>
          </div>
        </div>
      </div>
    );
  if (error || !listing)
    return (
      <div className="marketplace">
        <div className="mp-shell">
          <div className="mp-empty">
            <h1>This road ends here.</h1>
            <p>{error?.message ?? "This listing has been removed or is no longer available."}</p>
            <Link href="/marketplace" className="mp-btn">
              Explore vehicles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  const similar = listing.demo
    ? sampleListings.filter((l) => l.category === listing.category && l.id !== id).slice(0, 3)
    : [];
  return (
    <div className="marketplace mp-detail">
      <div className="mp-shell">
        <div className="mp-detail-top">
          <Link href={"/marketplace?category=" + listing.category} className="mp-back">
            <ArrowLeft size={15} />
            Back to {categoryLabel(listing.category).toLowerCase()}
          </Link>
          <div>
            <button
              className="mp-btn-secondary"
              onClick={() => toggle(id)}
              aria-pressed={saved.includes(id)}
            >
              <Heart size={16} fill={saved.includes(id) ? "currentColor" : "none"} />
              {saved.includes(id) ? "Saved" : "Save"}
            </button>
            <button className="mp-btn-secondary" onClick={share}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
        {listing.demo && (
          <div className="mp-preview-notice">
            Marketplace preview · This is an example listing with illustrative details and imagery.
            It is not offered for sale.
            <Link href="/marketplace/sell">
              List your real vehicle <ArrowRight size={14} />
            </Link>
          </div>
        )}
        {listing.status !== "active" && (
          <div className="mp-preview-notice">
            {listing.status === "pending" ? "This listing is awaiting admin approval and is hidden from buyers." : listing.status === "rejected" ? "This listing needs changes. Check the admin feedback in My Listings." : listing.status === "sold" ? "This vehicle is sold." : "This vehicle is no longer available."}
            <Link href="/marketplace">
              Find another vehicle <ArrowRight size={14} />
            </Link>
          </div>
        )}
        <header className="mp-detail-heading">
          <span className="mp-detail-category">{categoryLabel(listing.category)}<span />{listing.demo ? "Example listing" : listing.status === "active" ? "Available for sale" : listing.status === "sold" ? "Sold" : listing.status === "pending" ? "Awaiting approval" : listing.status === "rejected" ? "Changes requested" : "Archived"}</span>
          <h1>{listing.title}</h1>
          <div className="mp-detail-summary"><span><MapPin size={16} />{listing.location}, Bangalore</span><span>{listing.year}</span><span>{listing.mileage.toLocaleString("en-IN")} km</span><span>{listing.fuel}</span></div>
        </header>
        <div className="mp-detail-grid">
          <div>
            <ListingGallery photos={listing.photos} title={listing.title} demo={listing.demo} />
            <section className="mp-detail-section">
              <span className="mp-eyebrow">THE ESSENTIALS</span>
              <h2>A closer look.</h2>
              <div className="mp-spec-grid">
                {[
                  [CalendarDays, "Year", listing.year],
                  [Gauge, "Kilometres", listing.mileage.toLocaleString("en-IN") + " km"],
                  [Fuel, "Fuel type", listing.fuel],
                  [Settings2, "Transmission", listing.transmission],
                  [Users, "Ownership", listing.owners],
                  [MapPin, "Location", listing.location],
                ].map(([Icon, label, value]) => {
                  const I = Icon as typeof Gauge;
                  return (
                    <div key={String(label)}>
                      <I size={21} />
                      <span>{String(label)}</span>
                      <strong>{String(value)}</strong>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="mp-detail-section">
              <span className="mp-eyebrow">THE SELLER&apos;S STORY</span>
              <h2>About this vehicle.</h2>
              <p className="mp-description">{listing.description}</p>
            </section>
            <section className="mp-detail-section mp-seller-profile">
              <span className="mp-eyebrow">SELLER PROFILE</span>
              <h2>Meet the seller.</h2>
              <div className="mp-seller">
                <span>
                  {listing.seller_name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <strong>{listing.seller_name}</strong>
                  <small>{listing.demo ? "Example seller" : "Vehicle listed by this seller"}</small>
                </div>
              </div>
              {listing.demo ? (
                <div className="mp-demo-contact">
                  This is a preview. In-app chat is available on real, active listings.
                </div>
              ) : listing.user_id === user?.id ? (
                <Link href="/marketplace/my-listings" className="mp-btn">
                  Manage my listing <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  className="mp-btn"
                  onClick={contact}
                  disabled={pending || listing.status !== "active"}
                >
                  {pending ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <MessageCircle size={17} />
                  )}{" "}
                  Chat with seller
                </button>
              )}
              {!listing.demo && listing.user_id !== user?.id && (
                <small className="mp-contact-note">
                  Chat privately in Zapiboo. Signed-in buyers can call if you have enabled calls.
                </small>
              )}
            </section>
            <Link
              className="mp-report"
              href={"/contact?subject=" + encodeURIComponent("Report listing " + id)}
            >
              <Flag size={13} />
              Report this listing
            </Link>
            <section className="mp-detail-section mp-detail-safety">
              <ShieldCheck size={29} />
              <div>
                <h2>A good deal, with peace of mind.</h2>
                <p>
                  Inspect the vehicle in person, check the registration and service history, and
                  verify that the seller is authorised to sell. Avoid advance payments before
                  inspection. Agree the payment and ownership transfer process together.
                </p>
              </div>
            </section>
          </div>
          <aside className="mp-detail-sidebar">
            <div className="mp-price-card">
              <span className="mp-eyebrow">
                {listing.demo ? "ILLUSTRATIVE ASKING PRICE" : "ASKING PRICE"}
              </span>
              <strong className="mp-detail-price">{money(listing.price)}</strong>
              {listing.negotiable && (
                <span className="mp-negotiable">
                  <Check size={12} />
                  Open to reasonable offers
                </span>
              )}
            </div>
            <div className="mp-seller-promo">
              <span className="mp-eyebrow">GOT A VEHICLE TO SELL?</span>
              <h3>Make room for your next chapter.</h3>
              <Link href={"/marketplace/sell?category=" + listing.category}>
                Create your listing <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
        {similar.length > 0 && (
          <section className="mp-similar">
            <div className="mp-results-heading">
              <div>
                <span className="mp-eyebrow">KEEP EXPLORING</span>
                <h2>You might like these too.</h2>
              </div>
              <Link href={"/marketplace?category=" + listing.category}>
                View category <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mp-listing-grid">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} saved={saved.includes(l.id)} onSave={toggle} />
              ))}
            </div>
          </section>
        )}
        {!listing.demo && listing.status === "active" && listing.user_id !== user?.id && (
          <FloatingContactActions listingId={id} buyerCallEnabled={listing.buyer_call_enabled} />
        )}
      </div>
    </div>
  );
}
