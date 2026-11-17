import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  ClipboardCheck,
  Handshake,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const principles = [
  {
    icon: ClipboardCheck,
    title: "Thoughtful service choices",
    text: "Explore services by your child’s age, interests and everyday needs. Ask providers the questions that matter to your family.",
  },
  {
    icon: Handshake,
    title: "Respect for your choices",
    text: "You choose the support that fits your family. Ask questions, visit or try a session where available, and confirm details before booking.",
  },
  {
    icon: ShieldCheck,
    title: "Clear information",
    text: "Discuss experience, qualifications, supervision, fees and service terms before choosing a provider.",
  },
];

export default function About() {
  return (
    <main className="bg-background">
      <PageHeader
        eyebrow="About Zapiboo"
        title={
          <>
            For kids. <span className="text-gradient">For families.</span>
          </>
        }
        subtitle="Zapiboo helps families in Bangalore explore preschool, daycare, activities, play, celebrations, childcare and development support."
      />
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Little people. Big possibilities.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Every stage of childhood brings new questions. From finding a preschool and planning
              after-school activities to arranging care and celebrating a birthday, Zapiboo brings
              family service categories together in one place.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Choose a service and share your area, your child’s age, your preferred timing and
              budget. Ask our team about the next steps, then confirm availability and arrangements
              before booking.
            </p>
            <Link
              href="/#sell-categories"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Explore services <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [PackageCheck, "Care, learning, play & more"],
              [MapPin, "Explore Bangalore neighbourhoods"],
              [Wallet, "Clear service enquiries"],
            ].map(([Icon, text]) => {
              const ItemIcon = Icon as typeof PackageCheck;
              return (
                <div key={String(text)} className="rounded-2xl border border-border bg-card p-5">
                  <ItemIcon className="size-7 text-primary" />
                  <p className="mt-4 font-bold">{String(text)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-secondary/35 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">How we work</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Our approach is simple
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <Icon className="size-7 text-primary" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you can expect</h2>
          <div className="mt-7 space-y-5 text-muted-foreground">
            <p>
              Start with what your family needs: early learning, care, activities, a day out, an
              event or developmental support. Each category explains the options and useful
              questions to ask.
            </p>
            <p>
              Share your preferences through a service enquiry. An enquiry is not a confirmed
              booking; availability, fees and arrangements need to be agreed with the provider.
            </p>
            <p>
              Our aim is to help families make informed choices. Meet caregivers, check references
              and qualifications, and discuss your child’s needs before making a commitment.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-navy py-14 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Speak with the Zapiboo team</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Have a question about a service or your family’s requirements? Call or email our team.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={businessContact.phoneHref}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              {businessContact.phone}
            </a>
            <a
              href={businessContact.emailHref}
              className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold"
            >
              {businessContact.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
