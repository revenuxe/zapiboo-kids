import { redirect, notFound } from "next/navigation";
import { familyServices } from "@/lib/family-service-catalog";
export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const aliases: Record<string, string> = {
    cars: "used-cars",
    car: "used-cars",
    bikes: "used-bikes",
    bike: "used-bikes",
    scooters: "used-scooters",
    scooter: "used-scooters",
    suv: "used-suvs",
  };
  const id = aliases[category] ?? category;
  if (!familyServices.some((c) => c.id === id)) notFound();
  redirect("/marketplace?category=" + id);
}
