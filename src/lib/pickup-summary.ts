// Read-only labels for historical requests; the selling flow is retired.
const legacyCategories = [
  { id: "toys", name: "Toys & games" },
  { id: "books", name: "Kids books" },
  { id: "clothing", name: "Kids clothing" },
  { id: "gear", name: "Baby gear" },
  { id: "cycles", name: "Cycles & ride-ons" },
  { id: "electronics", name: "Kids electronics" },
] as const;
export type PickupSummarySource = {
  vehicle_type: string;
  items: string[] | null;
  lead_type?: string | null;
  selling_category_id?: string | null;
};
export function pickupCategory(
  lead: PickupSummarySource,
  categories: readonly { id: string; name: string }[] = legacyCategories,
) {
  // Requests retain their submitted category name even when the catalog is renamed or hidden.
  if (lead.selling_category_id || lead.lead_type === "kids_pickup")
    return {
      id: lead.selling_category_id || lead.vehicle_type,
      name: lead.items?.[0] || lead.vehicle_type,
    };
  return categories.find(
    (category) =>
      category.id === lead.vehicle_type ||
      category.name.toLowerCase() === lead.vehicle_type.toLowerCase() ||
      lead.items?.includes(category.name),
  );
}
export function isKidsPickup(lead: PickupSummarySource) {
  return (
    lead.lead_type !== "query" &&
    lead.lead_type !== "repair_booking" &&
    Boolean(pickupCategory(lead))
  );
}
export function pickupCondition(lead: PickupSummarySource) {
  return (
    lead.items?.find((item) => item.startsWith("Condition: "))?.slice("Condition: ".length) ??
    "Not provided"
  );
}
