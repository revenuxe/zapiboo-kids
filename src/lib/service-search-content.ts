import { familyServices, familyFaqs } from "./family-service-catalog";
import type { FamilyService } from "./family-service-catalog";
export type SearchContent = {
  title: string;
  description: string;
  intro: string;
  options: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};
export const homepageSearch = {
  title: "Sell Your Used Vehicle in Bangalore | Zapiboo",
  description:
    "Sell your used car, bike, scooter, SUV, commercial or electric vehicle in Bangalore. Share your vehicle details and discuss the next steps with Zapiboo.",
};
export const serviceHeadings = Object.fromEntries(
  familyServices.map((c) => [c.id, { lead: c.name, accent: "in Bangalore." }]),
) as Record<FamilyService["id"], { lead: string; accent: string }>;
export const serviceSearchContent = Object.fromEntries(
  familyServices.map((c) => [
    c.id,
    {
      title: c.name + " in Bangalore | Zapiboo",
      description: c.description,
      intro: c.description,
      options: c.types.map(
        (t) =>
          "Selling " +
          t.toLowerCase() +
          "? Share the make, model, year, kilometres driven and condition. Our team will discuss eligibility and next steps.",
      ),
      faqs: familyFaqs.map(([question, answer]) => ({ question, answer })),
    },
  ]),
) as unknown as Record<FamilyService["id"], SearchContent>;
export function areaSearchContent(area: {
  name: string;
  pincode: string;
  nearby: readonly string[];
}) {
  return {
    title: "Sell Your Used Vehicle in " + area.name + " | Zapiboo",
    description:
      "Sell used cars, bikes, scooters and more in " +
      area.name +
      ", Bangalore. Contact Zapiboo with your vehicle details.",
    intro:
      "Ready to sell your used vehicle in " +
      area.name +
      "? Choose a vehicle category and share its make, model, year and condition.",
    guidance: [
      {
        title: "Share your vehicle details",
        text: "Include the make, model, registration year, kilometres driven and known damage.",
      },
      {
        title: "Confirm your location",
        text:
          "Share your neighbourhood and preferred inspection timing. Reference PIN: " +
          area.pincode +
          ". Arrangements are subject to confirmation.",
      },
      {
        title: "Prepare your documents",
        text: "Keep registration, insurance, service history and loan information ready.",
      },
    ],
    faqs: familyFaqs.map(([question, answer]) => ({ question, answer })),
  };
}
