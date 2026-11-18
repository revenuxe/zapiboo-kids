import type { VehicleListing } from "./marketplace";
export const listingStatusLabel: Record<VehicleListing["status"], string> = {
  pending: "Awaiting approval", active: "Live", rejected: "Changes requested", sold: "Sold", archived: "Archived",
};
