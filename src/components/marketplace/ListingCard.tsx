"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ArrowUpRight, Images } from "lucide-react";
import { listingPath, money, type VehicleListing } from "@/lib/marketplace";

export function ListingCard({
  listing,
  saved,
  onSave,
  compact = false,
}: {
  listing: VehicleListing;
  saved: boolean;
  onSave: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <article className={`mp-card ${compact ? "mp-card-row" : ""}`}>
      <div className={`mp-card-photo ${listing.demo ? "mp-demo-photo" : ""}`}>
        <Link
          href={listingPath(listing)}
          aria-label={`View ${listing.title}`}
          tabIndex={-1}
        >
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 639px) 90vw, (max-width: 1199px) 44vw, 320px"
          />
        </Link>
        <span className={`mp-badge ${listing.demo ? "mp-badge-example" : ""}`}>
          {listing.demo ? "Preview listing" : listing.status === "sold" ? "Sold" : "For sale"}
        </span>
        <span className="mp-card-photo-count"><Images size={13} />{listing.photos.length}</span>
        <button
          className={`mp-save ${saved ? "is-saved" : ""}`}
          aria-label={`${saved ? "Unsave" : "Save"} ${listing.title}`}
          aria-pressed={saved}
          onClick={() => onSave(listing.id)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <Link href={listingPath(listing)} className="mp-card-info">
        <div className="mp-card-price">
          {money(listing.price)}
          <ArrowUpRight size={18} />
        </div>
        <h3>{listing.title}</h3>
        <div className="mp-card-specs">
          <span>{listing.year}</span>
          <span>{listing.mileage.toLocaleString("en-IN")} km</span>
          <span>{listing.fuel}</span>
        </div>
        <div className="mp-card-footer">
          <span>
            <MapPin size={12} />
            {listing.location}
          </span>
          <span>
            {listing.demo
              ? "Example"
              : new Date(listing.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
          </span>
        </div>
      </Link>
    </article>
  );
}
