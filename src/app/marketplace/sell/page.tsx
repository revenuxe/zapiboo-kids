import { CreateListing } from "@/components/marketplace/CreateListing";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "/marketplace/sell",
  "List Your Vehicle | Zapiboo Marketplace",
  "Create your vehicle listing with photos, details, price and location.",
  true,
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return <CreateListing initialCategory={(await searchParams).category} />;
}
