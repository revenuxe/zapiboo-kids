import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Check,
  ClipboardList,
  MessageCircle,
  MapPin,
  Phone,
  ChevronDown,
} from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { ServiceSelection } from "@/components/repair/ServiceSelection";
import { businessContact } from "@/lib/seo";
import { cn } from "@/lib/utils";
const faqs = [
  [
    "How do I request a repair?",
    "Select your vehicle category, choose View Service, then complete the booking enquiry form. Share your model, year, locality and the issue you are facing so the team can discuss the next step.",
  ],
  [
    "How much will the service cost?",
    "The cost depends on the vehicle, diagnosis, parts and work required. Ask the team for an estimate and confirm the scope before agreeing to repairs.",
  ],
  [
    "Can I enquire for an electric vehicle?",
    "Yes. Select EV and describe the issue, including the make and model. The team will need to confirm whether the required EV work can be supported.",
  ],
  [
    "Is pickup or doorstep service available?",
    "Share your Bangalore locality and the service you need. The team will confirm available arrangements, timings and any associated charges before you proceed.",
  ],
  [
    "What if I do not know which service I need?",
    "Use Get a Service Recommendation below the service cards and describe the symptoms. You do not need to diagnose the problem yourself.",
  ],
];
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function RepairHome() {
  return (
    <>
      <HomeHero />

      <ServiceSelection />

      <section className="bg-background py-14 sm:py-20">
        <div className={container}>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              From concern to clarity
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to get things moving.
            </h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: "Tell us what’s happening",
                text: "Choose your vehicle and service. Share the model, symptoms and your Bangalore locality.",
              },
              {
                icon: MessageCircle,
                title: "Discuss the details",
                text: "Check service availability, inspection arrangements and an estimate with the team.",
              },
              {
                icon: Wrench,
                title: "Agree on the next step",
                text: "Confirm the work, cost and timing before going ahead. Ask about parts and any applicable warranty.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <Icon aria-hidden="true" className="size-7 text-primary" />
                  <span className="text-4xl font-extrabold text-primary/15">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14 text-white sm:py-16">
        <div className={`${container} grid gap-8 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-coral">
              Make the conversation count
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Good care starts with the right details.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">
              A little information helps the team understand your vehicle and discuss a useful next
              step.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Make, model and year",
              "Mileage and service history",
              "Symptoms or dashboard lights",
              "Your locality and preferred time",
            ].map((text) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <Check aria-hidden="true" className="size-5 shrink-0 text-brand-coral" />
                <p className="text-sm font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-20">
        <div className={`${container} grid gap-10 lg:grid-cols-[0.8fr_1.2fr]`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              A few useful answers
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Before you get started.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Have a question about your particular vehicle?
            </p>
            <Link
              href="/contact"
              className={cn(
                "mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary",
                focus,
              )}
            >
              Contact the team <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details key={question} className="group border-b border-border">
                <summary
                  className={cn(
                    "flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold [&::-webkit-details-marker]:hidden",
                    focus,
                  )}
                >
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-3xl border border-primary/15 bg-primary/5 p-6 sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-primary">
              <MapPin aria-hidden="true" className="size-4" />
              Bangalore, let’s get you moving
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Your next service starts here.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us about your vehicle. We’ll take the conversation from there.
            </p>
          </div>
          <a
            href={businessContact.phoneHref}
            className={cn(
              "inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white",
              focus,
            )}
          >
            <Phone aria-hidden="true" className="size-4" />
            Call Zapiboo
          </a>
        </div>
      </section>
    </>
  );
}
