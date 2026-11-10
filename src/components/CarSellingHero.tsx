import { servicesPaused, openingSoonHref } from "@/lib/launch-status";
import { ArrowRight, PackageCheck, Wallet, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";

export function CarSellingHero() {
  return (
    <section className="relative overflow-hidden bg-navy pb-24 pt-12 text-white sm:pt-16 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(31,89,104,0.35),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
          Pre-Loved Kids Marketplace · Bangalore
        </p>
        <h1 className="mt-5 max-w-xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
          Sell <span className="text-brand-sunshine">Pre-Loved Kids Items</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          Give your children&apos;s outgrown toys, books, clothes and gear a second life.
          List for free, connect with local parents and enjoy safe transactions.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
          {[
            [PackageCheck, "Quality Checked"],
            [Wallet, "Secure Payments"],
            [ShieldCheck, "Seller Support"],
          ].map(([Icon, title]) => {
            const BenefitIcon = Icon as typeof PackageCheck;
            return (
              <div
                key={String(title)}
                className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
              >
                <BenefitIcon aria-hidden="true" className="mb-3 size-6 text-brand-sunshine" />
                <p className="text-xs font-bold leading-relaxed sm:text-sm">{String(title)}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-stretch gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <a
            href="/pickup"
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 text-sm font-bold transition-colors hover:bg-brand-green-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
          >
            List your item for free <ArrowRight className="size-4" />
          </a>
          <a
            href={servicesPaused ? openingSoonHref : `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Zapiboo, I want to sell some pre-loved kids items.")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-sm font-bold transition-colors hover:border-[#00C875] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
          >
            <WhatsAppIcon className="size-5 text-[#00C875]" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
