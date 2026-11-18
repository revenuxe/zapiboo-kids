import Image from "next/image";
import { familyServices } from "@/lib/family-service-catalog";
export function CategoriesPanel() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold">Vehicle categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The six services shown across the website. Customer enquiries include the selected service
          in their subject.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familyServices.map((service) => (
          <article key={service.id} className="rounded-2xl border border-border bg-card p-5">
            <Image
              src={service.image_url}
              alt={service.name}
              width={320}
              height={240}
              className="h-40 w-full object-contain"
            />
            <h3 className="mt-4 font-bold">{service.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
