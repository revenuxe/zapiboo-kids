import { HomeCollectionSupport } from "@/components/HomeSections";
import { LandingHero } from "@/components/LandingHero";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { serviceAreas, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";
import { servicesPaused } from "@/lib/launch-status";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMetadata(
  "/areas",
  "Used Vehicle Selling Near You in Bangalore | Zapiboo Areas",
  "Sell your used car, bike, scooter or other vehicle in Bangalore. Explore Whitefield, HSR Layout, Hebbal, Nagawara and more.",
);

export default function AreasPage() {
  const areas = [...serviceAreas].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Service areas", path: "/areas" },
          ]),
          itemListSchema(
            "Bangalore family service areas",
            areas.map((area) => ({ name: area.name, path: `/areas/${area.slug}` })),
          ),
        ]}
      />
      <LandingHero
        eyebrow="IN YOUR NEIGHBOURHOOD"
        title={
          <>
            Vehicle sales. <span>Near you.</span>
          </>
        }
        description="Ready to sell your used vehicle? Choose your Bangalore neighbourhood and share your car, bike, scooter or commercial vehicle details."
        image="/vehicles/used-bikes-light.webp"
        imageAlt="New adventures, closer to home"
        href="/contact"
        action="Sell your vehicle"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed">
          {servicesPaused
            ? "Service enquiries are temporarily paused. You can still explore our service categories and neighbourhood pages."
            : "Service availability depends on the category, provider and your requirements. Enquire about your area before making plans."}
        </div>
        <h2 className="text-2xl font-bold">Choose your area</h2>
        <p className="mt-3 text-muted-foreground">
          Sell your vehicle and send an enquiry for your neighbourhood.
        </p>
        <nav
          aria-label="All service areas"
          className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-primary/50 hover:text-primary"
            >
              <MapPin className="size-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{area.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Bangalore · {area.pincode}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-sm text-muted-foreground">
          Can’t find your neighbourhood?{" "}
          <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">
            Check with our team
          </Link>{" "}
          before making service plans.
        </p>
      </section>

      <HomeCollectionSupport />
    </>
  );
}
