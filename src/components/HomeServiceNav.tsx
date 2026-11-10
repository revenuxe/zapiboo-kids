import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";

export function HomeServiceNav() {
  return <nav aria-label="Selling actions" className="mb-8 sm:mb-9">
    <Link href="/pickup" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-gradient-brand px-6 py-3 font-bold text-primary-foreground shadow-green hover:brightness-110">
      <Tag aria-hidden="true" className="size-5" /> Sell your items <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  </nav>;
}
