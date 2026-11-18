import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
export default function About() {
  return (
    <main className="bg-background">
      <PageHeader
        eyebrow="About Zapiboo"
        title="Your vehicle. Your next chapter."
        subtitle="Zapiboo helps vehicle owners in Bangalore take the next step towards selling their used cars, bikes, scooters and more."
      />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-3xl font-bold">A clearer way to start selling.</h2>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Whether you are upgrading your family car, moving on from your first bike or changing your
          business fleet, start with your vehicle category. Share the make, model, year, kilometres
          driven and condition with our team.
        </p>
        <div className="my-10 grid gap-6 sm:grid-cols-3">
          {[
            [
              "Your vehicle, your choice",
              "Review the details and decide whether an offer works for you.",
            ],
            [
              "Clear conversations",
              "Discuss inspection, documentation, payment and ownership transfer before confirming.",
            ],
            [
              "Local support",
              "Based in Bangalore, with enquiries organised by vehicle category and neighbourhood.",
            ],
          ].map(([t, d]) => (
            <article key={t} className="rounded-2xl border border-border p-6">
              <h3 className="text-xl font-bold">{t}</h3>
              <p className="mt-4 text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <Link href="/#sell-categories" className="home-button">
          Sell your used vehicle
        </Link>
      </section>
    </main>
  );
}
