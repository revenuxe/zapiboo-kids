import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export function HomeServiceNav() {
  return (
    <nav aria-label="Family services" className="mb-8 sm:mb-9">
      <Link
        href="/#sell-categories"
        className="inline-flex min-h-14 items-center gap-3 rounded-full bg-gradient-brand px-6 py-3 font-bold text-primary-foreground shadow-green hover:brightness-110"
      >
        <Compass aria-hidden="true" className="size-5" /> Explore services{" "}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </nav>
  );
}
