import { z } from "zod";
import { familyServices } from "./family-service-catalog";
import { containsContactDetails } from "./chat";

export const vehicleCategories = familyServices.map((c) => ({
  ...c,
  label: c.name.replace("Sell ", ""),
}));
export const listingSchema = z
  .object({
    id: z.string().uuid(),
    category: z.enum([
      "used-cars",
      "used-bikes",
      "used-scooters",
      "used-suvs",
      "commercial-vehicles",
      "electric-vehicles",
    ]),
    title: z.string().trim().min(10, "Add a title of at least 10 characters.").max(100),
    description: z
      .string()
      .trim()
      .min(40, "Tell buyers a little more (at least 40 characters).")
      .max(3000)
      .refine(
        (value) => !/\[(?:add details|your neighbourhood)\]/i.test(value),
        "Replace the starter text in brackets with your own details.",
      ),
    brand: z.string().trim().min(2).max(40),
    model: z.string().trim().min(1).max(60),
    year: z.coerce
      .number()
      .int()
      .min(1980)
      .max(new Date().getFullYear() + 1),
    mileage: z.coerce.number().int().min(0).max(2000000),
    price: z.coerce.number().int().min(1000).max(100000000),
    fuel: z.enum(["Petrol", "Diesel", "Electric", "CNG", "Hybrid"]),
    transmission: z.enum(["Manual", "Automatic"]),
    owners: z.enum(["1st owner", "2nd owner", "3rd owner or more"]),
    location: z.string().trim().min(2).max(80),
    seller_name: z.string().trim().min(2).max(80),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
    negotiable: z.boolean(),
    buyer_call_enabled: z.boolean().default(false),
    consent: z.literal(true),
  })
  .superRefine((listing, context) => {
    for (const field of [
      "title",
      "description",
      "seller_name",
      "location",
      "brand",
      "model",
    ] as const) {
      if (containsContactDetails(listing[field]))
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message:
            "Remove contact details from your public listing. Buyers will contact you through Chats.",
        });
    }
  });
export type ListingInput = z.infer<typeof listingSchema>;
export type VehicleListing = Omit<ListingInput, "phone" | "consent"> & {
  photos: string[];
  user_id: string;
  buyer_call_enabled: boolean;
  status: "pending" | "active" | "rejected" | "sold" | "archived";
  rejection_reason?: string | null;
  updated_at?: string;
  created_at: string;
  demo?: boolean;
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const categoryImage = (id: string) =>
  vehicleCategories.find((c) => c.id === id)?.image_url ?? vehicleCategories[0].image_url;
export const categoryLabel = (id: string) =>
  vehicleCategories.find((c) => c.id === id)?.label ?? "Vehicles";
export function listingPath(listing: { id: string; title: string }) {
  const slug = listing.title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/marketplace/${slug || "vehicle"}--${listing.id}`;
}
export function listingIdFromPath(pathId: string) {
  const separator = pathId.lastIndexOf("--");
  return separator === -1 ? pathId : pathId.slice(separator + 2);
}
export const sampleListings: VehicleListing[] = [
  [
    "used-cars",
    "Maruti Suzuki",
    "Swift VXi",
    2020,
    42500,
    525000,
    "Petrol",
    "Manual",
    "Indiranagar",
  ],
  ["used-bikes", "Hero", "Splendor Plus", 2022, 18000, 68000, "Petrol", "Manual", "HSR Layout"],
  ["used-scooters", "Honda", "Activa 6G", 2023, 9200, 72000, "Petrol", "Automatic", "Whitefield"],
  ["used-suvs", "Hyundai", "Creta SX", 2021, 38000, 1275000, "Diesel", "Automatic", "Koramangala"],
  ["commercial-vehicles", "Tata", "Ace Gold", 2022, 52000, 395000, "Diesel", "Manual", "Hebbal"],
  [
    "electric-vehicles",
    "Tata",
    "Tiago EV",
    2024,
    12000,
    775000,
    "Electric",
    "Automatic",
    "JP Nagar",
  ],
  ["used-cars", "Maruti Suzuki", "Swift ZXi", 2019, 61000, 465000, "Petrol", "Manual", "Yelahanka"],
  ["used-bikes", "Hero", "Splendor Plus XTEC", 2024, 6500, 79000, "Petrol", "Manual", "Nagawara"],
  [
    "used-scooters",
    "Honda",
    "Activa Deluxe",
    2021,
    24000,
    58000,
    "Petrol",
    "Automatic",
    "Marathahalli",
  ],
].map((r, i) => ({
  id: `preview-${i + 1}`,
  category: r[0],
  brand: r[1],
  model: r[2],
  year: r[3],
  mileage: r[4],
  price: r[5],
  fuel: r[6],
  transmission: r[7],
  location: r[8],
  title: `${r[1]} ${r[2]}`,
  description:
    "This is an example listing to preview the Zapiboo marketplace. Vehicle specifications, pricing and seller details are illustrative. This vehicle is not offered for sale.",
  photos: [categoryImage(String(r[0]))],
  owners: "1st owner",
  negotiable: true,
  seller_name: "Example seller",
  user_id: "preview",
  status: "active",
  buyer_call_enabled: false,
  created_at: new Date(Date.UTC(2026, 10, 18, 10 - i)).toISOString(),
  demo: true,
})) as VehicleListing[];
