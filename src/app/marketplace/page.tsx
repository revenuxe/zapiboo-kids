import { redirect } from "next/navigation";
import { Marketplace } from "@/components/marketplace/Marketplace";
import { pageMetadata } from "@/lib/metadata";
import { vehicleCategories } from "@/lib/marketplace";
export const metadata = pageMetadata(
  "/marketplace",
  "Used Vehicle Marketplace in Bangalore | Zapiboo",
  "Browse used cars, bikes, scooters and more. Search, filter, save favourites and list your vehicle on Zapiboo.",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string }>;
}) {
  const { category, view } = await searchParams;
  if (view === "mine") redirect("/marketplace/my-listings");
  return (
    <Marketplace
      initialCategory={vehicleCategories.some((c) => c.id === category) ? category : ""}
      initialView={view === "saved" || view === "mine" ? view : "browse"}
    />
  );
}
