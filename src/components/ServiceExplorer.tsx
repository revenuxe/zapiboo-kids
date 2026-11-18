"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { familyServices } from "@/lib/family-service-catalog";
export function ServiceExplorer() {
  const services = familyServices;
  return (
    <section className="selling-explore border-t border-border bg-secondary/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Ready for your next journey
        </p>
        <h2 className="mt-3 text-2xl font-bold">More vehicles you can sell</h2>
        <nav
          aria-label="Vehicle categories"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((category) => (
            <Link
              key={category.id}
              href={`/marketplace?category=${category.id}`}
              className="flex min-h-14 items-center justify-between rounded-xl border border-border bg-card px-4 py-3 font-semibold hover:border-primary/50 hover:text-primary"
            >
              {category.name}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
