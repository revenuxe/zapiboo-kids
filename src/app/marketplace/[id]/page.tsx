import { ListingDetail } from "@/components/marketplace/ListingDetail";
import { pageMetadata } from "@/lib/metadata";
import { sampleListings } from "@/lib/marketplace";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const example = sampleListings.find((l) => l.id === id);
  return pageMetadata(
    "/marketplace/" + id,
    example ? example.title + " | Marketplace Preview" : "Vehicle Listing | Zapiboo Marketplace",
    "View vehicle details, photos and seller information on Zapiboo.",
    true,
  );
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ListingDetail id={(await params).id} />;
}
