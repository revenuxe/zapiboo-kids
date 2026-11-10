import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import Pickup from "@/views/pickup";
import { getSellingCategory } from "@/lib/selling-categories";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";
export const metadata = pageMetadata(
  "/pickup",
  "Sell Your Kids Items - Arrange Pickup | Zapiboo",
  "Share the toys, books, clothes or baby gear you want to sell. Add item details, sign in and arrange doorstep pickup in Bangalore when bookings are available.",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const categories = await getPublicSellingCategories();
  const pickupSearch = {
    category:
      typeof search.category === "string" && getSellingCategory(search.category, categories)
        ? search.category
        : undefined,
    pincode:
      typeof search.pincode === "string" && /^\d{6}$/.test(search.pincode)
        ? search.pincode
        : undefined,
    bookingAuth: search.bookingAuth === "1" ? ("1" as const) : undefined,
  };
  return (
    <>
      <JsonLd
        data={[
          serviceSchema("/pickup"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Sell your kids items", path: "/pickup" },
          ]),
        ]}
      />
      <Pickup pickupSearch={pickupSearch} />
    </>
  );
}
