"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSellingCategories } from "@/components/CatalogProvider";
export function SellByModel() {
  const sellingCategories = useSellingCategories();
  return (
    <section className="selling-explore border-t border-border bg-secondary/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Make space for their next chapter
        </p>
        <h2 className="mt-3 text-2xl font-bold">More ways to pass it on</h2>
        <nav
          aria-label="Selling categories"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sellingCategories.map((category) => (
            <Link
              key={category.id}
              href={`/sell/${category.id}`}
              className="flex min-h-14 items-center justify-between rounded-xl border border-border bg-card px-4 py-3 font-semibold hover:border-primary/50 hover:text-primary"
            >
              Sell {category.name.toLowerCase()}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
