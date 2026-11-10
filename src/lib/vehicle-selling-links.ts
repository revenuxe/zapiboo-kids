export const vehicleSellingLinks = [
  { key: "toys", label: "Sell kids toys", path: "/sell/toys" },
  { key: "books", label: "Sell kids books", path: "/#sell-categories" },
  { key: "clothing", label: "Sell kids clothing", path: "/#sell-categories" },
  { key: "gear", label: "Sell baby gear", path: "/#sell-categories" },
  { key: "cycles", label: "Sell kids cycles", path: "/#sell-categories" },
] as const;

export type SellingVehicle = (typeof vehicleSellingLinks)[number]["key"];
