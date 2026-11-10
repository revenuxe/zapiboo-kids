import { sellingCategories } from "./selling-categories";

export type PickupSummarySource = {
  vehicle_type: string;
  items: string[] | null;
  lead_type?: string | null;
};

// vehicle_type is the existing database column; presentation uses item names.
export function pickupCategory(lead: PickupSummarySource) {
  return sellingCategories.find(
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
