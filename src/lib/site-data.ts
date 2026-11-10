import {
  CalendarClock,
  Truck,
  Wallet,
  ShieldCheck,
  FileCheck2,
  Globe2,
  BarChart3,
  PackageCheck,
} from "lucide-react";

export const steps = [
  {
    icon: CalendarClock,
    title: "Tell us what you want to sell",
    text: "Choose a category, select the condition and add optional notes or a photo.",
  },
  {
    icon: Truck,
    title: "Arrange doorstep pickup",
    text: "Choose a convenient slot and confirm pickup arrangements with our team.",
  },
  {
    icon: Wallet,
    title: "Confirm the sale details",
    text: "Confirm the sale and payment details before handing over your items.",
  },
];

export const features = [
  {
    icon: ShieldCheck,
    title: "Thoughtful item review",
    text: "Clear photos and honest condition details help our team review the items you want to sell.",
  },
  {
    icon: Wallet,
    title: "Support at every step",
    text: "Get help with item details, preparing for collection and understanding the next steps.",
  },
  {
    icon: FileCheck2,
    title: "Safe & secure transactions",
    text: "Confirm your item details, handover arrangements and payment terms before proceeding.",
  },
  {
    icon: Globe2,
    title: "Doorstep across Bangalore",
    text: "Pickup support in Whitefield, HSR, Koramangala, Hebbal, JP Nagar and 40+ areas.",
  },
  {
    icon: PackageCheck,
    title: "Sustainable parenting",
    text: "Give pre-loved items a second life. Make space, reduce waste and join a community of conscious parents.",
  },
  {
    icon: BarChart3,
    title: "Schools & bulk sellers welcome",
    text: "Bulk listing support for schools, daycare centres and families with large collections to sell.",
  },
];

export const navLinks = [
  { to: "/#sell-categories", label: "What you can sell" },
  { to: "/contact", label: "Contact" },
] as const;

// Trimmed set shown in the site header (the rest live only in the footer).
export const headerNavLinks = [
  { to: "/#sell-categories", label: "What you can sell" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
