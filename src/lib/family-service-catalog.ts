export const familyServices = [
  {
    id: "used-cars",
    name: "Sell Used Cars",
    tagline: "Your next chapter starts here",
    description:
      "Hatchbacks, sedans and everyday cars. Share your car details to discuss selling options.",
    accent_color: "#fff0cf",
    types: ["Hatchbacks", "Sedans", "Premium cars", "Family cars"],
    image_url: "/vehicles/used-cars-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
  {
    id: "used-bikes",
    name: "Sell Used Bikes",
    tagline: "Give your bike a new road",
    description: "From daily commuters to touring motorcycles, start your bike sale with Zapiboo.",
    accent_color: "#e3efff",
    types: ["Commuter bikes", "Sports bikes", "Cruisers", "Touring bikes"],
    image_url: "/vehicles/used-bikes-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
  {
    id: "used-scooters",
    name: "Sell Used Scooters",
    tagline: "A simpler way to move on",
    description: "Sell your petrol or electric scooter. Tell us its model, age and condition.",
    accent_color: "#ffe7ed",
    types: ["Petrol scooters", "Electric scooters", "City scooters", "Maxi scooters"],
    image_url: "/vehicles/used-scooters-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
  {
    id: "used-suvs",
    name: "Sell Used SUVs",
    tagline: "Ready for the next adventure",
    description: "Explore selling your compact SUV, crossover or full-size SUV in Bangalore.",
    accent_color: "#e9e8ff",
    types: ["Compact SUVs", "Mid-size SUVs", "Full-size SUVs", "Crossovers"],
    image_url: "/vehicles/used-suvs-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
  {
    id: "commercial-vehicles",
    name: "Sell Commercial Vehicles",
    tagline: "Keep your business moving",
    description: "Discuss selling your van, pickup or other commercial vehicle with our team.",
    accent_color: "#e3f4ff",
    types: ["Vans", "Pickup trucks", "Light trucks", "Passenger vehicles"],
    image_url: "/vehicles/commercial-vehicles-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
  {
    id: "electric-vehicles",
    name: "Sell Electric Vehicles",
    tagline: "A fresh start, fully charged",
    description:
      "Share your electric car or two-wheeler details, including battery condition and warranty.",
    accent_color: "#e6f3df",
    types: ["Electric cars", "Electric bikes", "Electric scooters", "Electric commercial vehicles"],
    image_url: "/vehicles/electric-vehicles-light.webp",
    preparation:
      "Keep your registration certificate, service history, insurance details and loan status ready. Share the model, year, kilometres driven and any known damage. Final offers and arrangements are subject to review.",
  },
] as const;
export type FamilyService = (typeof familyServices)[number];
export const serviceEnquiryHref = (id: string, area?: string) =>
  "/marketplace/sell?" + new URLSearchParams({ category: id, ...(area ? { area } : {}) });
export const familySteps = [
  {
    title: "Create your vehicle listing",
    text: "Choose a category and share the make, model, year, kilometres driven and condition.",
  },
  {
    title: "Add photos and set your price",
    text: "Upload clear photos, write an honest description and choose your asking price. Review your listing before publishing.",
  },
  {
    title: "Agree and move forward",
    text: "Connect directly with interested buyers. Arrange a viewing and agree payment and ownership transfer before completing a sale.",
  },
];
export const familyFaqs = [
  [
    "What vehicles can I sell?",
    "Explore used cars, bikes, scooters, SUVs, commercial vehicles and electric vehicles. Contact our team to confirm eligibility for your vehicle.",
  ],
  [
    "How do I start selling?",
    "Choose your category, add vehicle details and photos, then set a price and location. Review your listing and sign in to publish it.",
  ],
  [
    "What determines my vehicle value?",
    "The make, model, age, mileage, condition, service history, ownership and current demand all affect an offer. A final offer requires review of your vehicle.",
  ],
  [
    "What documents should I prepare?",
    "Keep your registration certificate, insurance and service records ready. Tell our team about any outstanding loan and confirm the documents and transfer process for your sale.",
  ],
] as const;
