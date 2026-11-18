import { cache } from "react";
import { redirect } from "next/navigation";
import { ListingDetail } from "@/components/marketplace/ListingDetail";
import { pageMetadata } from "@/lib/metadata";
import {
  listingIdFromPath,
  listingPath,
  sampleListings,
  type VehicleListing,
} from "@/lib/marketplace";
import { getMarketplaceListing } from "@/lib/marketplace-server";

const getListing = cache(async (pathId: string): Promise<VehicleListing | null> => {
  const id = listingIdFromPath(pathId);
  const example = sampleListings.find((listing) => listing.id === id);
  if (example) return example;
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) return null;
  return getMarketplaceListing(id);
});

function storyDescription(story: string) {
  const description = story.replace(/\s+/g, " ").trim();
  if (description.length <= 160) return description;
  const end = description.lastIndexOf(" ", 157);
  return `${description.slice(0, end > 120 ? end : 157).trimEnd()}…`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: pathId } = await params;
  const listing = await getListing(pathId);
  const canonicalPath = listing ? listingPath(listing) : "/marketplace/" + pathId;
  const title = listing
    ? `${listing.title} for Sale in ${listing.location}, Bangalore | Zapiboo`
    : "Vehicle Listing | Zapiboo Marketplace";
  const description = listing
    ? storyDescription(listing.description)
    : "View vehicle details, photos and seller information on Zapiboo.";
  return pageMetadata(
    canonicalPath,
    title,
    description,
    !listing || listing.demo || listing.status !== "active",
  );
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: pathId } = await params;
  const listing = await getListing(pathId);
  if (listing) {
    const canonicalPath = listingPath(listing);
    if (pathId !== canonicalPath.slice("/marketplace/".length)) redirect(canonicalPath);
  }
  return <ListingDetail id={listingIdFromPath(pathId)} />;
}
