export const sellingCategories = [
  {
    id: "toys",
    name: "Toys & games",
    description: "Wooden toys, puzzles, building sets and games.",
    types: [
      "Building blocks",
      "Puzzles & board games",
      "Soft toys & dolls",
      "Learning toys",
      "Toy sets & bundles",
      "Wooden toys",
      "Action figures",
      "Toy cars & trains",
      "Pretend-play sets",
      "Dollhouses & playsets",
      "Musical toys",
      "Stacking & sorting toys",
    ],
    preparation: "Clean toys, check for loose parts and mention any missing pieces.",
  },
  {
    id: "books",
    name: "Kids books",
    description: "Picture books, story collections and activity books.",
    types: [
      "Picture books",
      "Story books",
      "Learning & activity books",
      "Book sets & bundles",
      "Board books",
      "Early readers",
      "Phonics books",
      "Alphabet & number books",
      "Comics & graphic novels",
      "Kids encyclopedias",
      "Chapter books",
      "School reading books",
    ],
    preparation: "Check for torn pages, writing and missing covers. Group sets together.",
  },
  {
    id: "clothing",
    name: "Kids clothing",
    description: "Outgrown clothes, shoes and accessories.",
    types: [
      "Baby clothing",
      "Kids clothing",
      "Shoes",
      "Accessories",
      "Clothing bundles",
      "T-shirts & tops",
      "Dresses & skirts",
      "Trousers & shorts",
      "Sweaters & jackets",
      "Baby sleepsuits",
      "Party & occasion wear",
      "Raincoats & winterwear",
    ],
    preparation: "Wash and dry clothing. Include the size and mention stains or wear.",
  },
  {
    id: "gear",
    name: "Baby gear",
    description: "Strollers, high chairs, cots and other baby essentials.",
    types: [
      "Strollers",
      "High chairs",
      "Cots & cribs",
      "Car seats",
      "Other baby gear",
      "Prams",
      "Travel cots",
      "Booster seats",
      "Baby carriers",
      "Playpens",
      "Baby bouncers",
      "Baby changing tables",
    ],
    preparation:
      "Check straps, locks and moving parts. Mention damage, recalls or missing accessories. For car seats, include expiry and accident history.",
  },
  {
    id: "cycles",
    name: "Cycles & ride-ons",
    description: "Balance bikes, kids cycles, tricycles and ride-ons.",
    types: [
      "Balance bikes",
      "Kids bicycles",
      "Tricycles",
      "Scooters & ride-ons",
      "Training-wheel bicycles",
      "Kick scooters",
      "Ride-on cars",
      "Pedal cars",
      "Push-along ride-ons",
      "Battery-powered ride-ons",
      "Ride-on motorbikes",
      "Bicycle accessories",
    ],
    preparation: "Check the brakes, tyres and frame. Include wheel size and any repair needs.",
  },
  {
    id: "electronics",
    name: "Kids electronics",
    description: "Learning tablets, electronic toys and STEM kits.",
    types: [
      "Learning tablets",
      "Electronic learning toys",
      "STEM kits",
      "Other kids electronics",
      "Kids learning laptops",
      "Coding & robotics kits",
      "Electronic story readers",
      "Talking alphabet toys",
      "Math learning devices",
      "Electronic keyboards",
      "Kids digital cameras",
      "Science experiment kits",
    ],
    preparation:
      "Check that it works, remove personal accounts and include chargers or accessories.",
  },
] as const;

export type BuiltInSellingCategoryId = (typeof sellingCategories)[number]["id"];
export type SellingCategoryId = string;
export type SellingCategory = {
  id: string;
  name: string;
  description: string;
  types: readonly string[];
  preparation: string;
  image_url?: string;
  tagline?: string;
  accent_color?: string;
  intro?: string;
  seo_title?: string;
  seo_description?: string;
  sort_order?: number;
  is_active?: boolean;
};
export const itemConditions = ["Like new", "Good", "Well used"] as const;
export const itemAges = [
  "Less than 6 months",
  "6–12 months",
  "1–2 years",
  "2–3 years",
  "More than 3 years",
  "Not sure",
] as const;
export const categoryImage = (id: string) => `/sell-categories/${id}.webp`;
export const getSellingCategory = (
  id?: string,
  categories: readonly SellingCategory[] = sellingCategories,
) => categories.find((category) => category.id === id);

export type SellingItemDetails = {
  category: string;
  condition: string;
  description: string;
};

export function validateSellingItem(
  item: SellingItemDetails,
  categories: readonly SellingCategory[] = sellingCategories,
): string | null {
  const category = getSellingCategory(item.category, categories);
  if (!category || category.is_active === false)
    return "Choose the category of items you want to sell.";
  if (!(itemConditions as readonly string[]).includes(item.condition))
    return "Select the condition of your items.";
  if (item.description.length > 1000) return "Keep the description within 1,000 characters.";
  return null;
}

// Keep the existing leads schema and its ownership policies. Item specifics are
// stored in its generic items/message fields; vehicle foreign keys stay null.
export function sellingItemPayload(
  item: SellingItemDetails,
  categories: readonly SellingCategory[] = sellingCategories,
) {
  const error = validateSellingItem(item, categories);
  if (error) throw new Error(error);
  const category = getSellingCategory(item.category, categories)!;
  return {
    lead_type: "kids_pickup",
    selling_category_id: category.id,
    vehicle_type: category.name,
    registration_number: null,
    manufacture_year: null,
    brand_id: null,
    brand_name: null,
    model_id: null,
    model_name: null,
    vehicle_model_name: null,
    variant_id: null,
    variant_name: null,
    items: [category.name, `Condition: ${item.condition}`],
    message: item.description.trim() || null,
  };
}
