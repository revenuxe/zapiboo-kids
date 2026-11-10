import { servicesPaused, openingSoonHref } from "@/lib/launch-status";
﻿import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  ClipboardCheck,
  ShieldCheck,
  Wallet,
  MapPin,
  Check,
  ChevronDown,
} from "lucide-react";
import { CarValuationForm } from "@/components/CarValuationForm";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact, siteUrl } from "@/lib/seo";
import car from "@/assets/vehicle-car.webp";
import inspection from "@/assets/doorstep-inspection.webp";
import type { ReactNode } from "react";

const steps = [
  [
    "Share Your Car Details",
    "Enter your registration number, choose your car type and brand, and tell us where you need an inspection. You can also start manually if your registration number is not handy. Accurate details help the team prepare for your vehicle.",
  ],
  [
    "Book a Doorstep Inspection",
    "Choose an available appointment in your area. The team inspects your car and reviews its condition and details to help establish a market-linked offer. Keep your service records and vehicle documents ready, and mention any repairs or known issues.",
  ],
  [
    "Review Your Offer and Decide",
    "Discuss the offer and the next steps with the team. If you choose to proceed, confirm payment, handover and ownership-transfer arrangements. Asking for a valuation is a starting point; take the time you need to understand the offer before making a decision.",
  ],
];
const factors = [
  [
    "Make, Model and Variant",
    "The exact version of your car matters. Engine, transmission, equipment and demand for a particular model can influence the offer. Share the variant where possible, rather than relying on a broad model name. Two cars with similar badges may have different specifications and buyer appeal.",
  ],
  [
    "Age and Kilometres Driven",
    "Registration year and distance travelled give context to how a vehicle has been used. Mileage is considered alongside maintenance and condition, rather than in isolation. A lightly used car and a regularly driven, carefully maintained car can each need a different assessment.",
  ],
  [
    "Overall Vehicle Condition",
    "Mechanical health, bodywork, interior wear, tyres and working features all contribute to an inspection. Tell the team about known faults, accident repairs or modifications upfront. An accurate description makes it easier to discuss an offer that reflects the car being inspected.",
  ],
  [
    "Ownership and Service History",
    "Previous ownership and documented maintenance help explain your car's history. Service invoices can show what work was completed and when. If records are incomplete, share what you do have and be clear about any gaps rather than guessing at the vehicle's past.",
  ],
  [
    "Fuel Type and Transmission",
    "Petrol, diesel, CNG, hybrid and electric vehicles have different characteristics. Manual and automatic variants can also attract different demand. For an electric car, available battery-health and warranty information can help the team understand the vehicle more fully during the assessment.",
  ],
  [
    "Local Demand and Documentation",
    "An offer also reflects demand for that kind of car in the local market. Registration details, insurance information and any outstanding finance help establish what needs attention before a sale. An online description starts the conversation; it does not replace a vehicle inspection.",
  ],
];
const faqs = [
  [
    "How Can I Sell My Car Through Zapiboo?",
    "Enter your registration number or choose manual entry, add your vehicle details and book an available inspection. The team reviews your car and discusses an offer. If you decide to sell, confirm the payment, handover and transfer steps before proceeding.",
  ],
  [
    "Will I Get an Instant Price From My Registration Number?",
    "No. The registration form starts your inspection request and carries the number into your booking. It does not perform a registration-database lookup or generate an automatic price. Your car's condition and details need to be reviewed before an offer is discussed.",
  ],
  [
    "What Affects My Used Car's Value?",
    "Make, model, variant, age, mileage, overall condition, service records, ownership history and local demand can all influence an offer. Accurate information and an inspection give a more useful basis for assessment than the original purchase price alone.",
  ],
  [
    "Can I Start Without My Registration Number?",
    "Yes. Use Enter Car Details Manually to open the booking flow with car selected. You can add the registration number in the vehicle-details step when it is available. Have the relevant vehicle records ready for the inspection and sale discussion.",
  ],
  [
    "Is the Inspection Free?",
    "Zapiboo offers free doorstep inspections. Choose an available appointment during booking and confirm the visit with the team. Availability depends on your location and the slots shown in the booking flow.",
  ],
  [
    "Do I Have to Accept the Offer?",
    "You decide whether to proceed after reviewing the offer. Ask the team to explain the assessment and any remaining steps before you agree to the sale. Starting a booking does not itself complete a vehicle sale.",
  ],
  [
    "Can I Sell a Car With an Outstanding Loan?",
    "Tell the team about the finance arrangement before agreeing to a sale. Lender-related steps and documents may need attention before ownership can be transferred. Confirm the requirements for your vehicle with the lender and the team handling the transaction.",
  ],
  [
    "Which Documents Should I Prepare?",
    "Keep your registration certificate, insurance information, identification and available service records together. PUC and lender-related documents may also be relevant. The exact requirements depend on your vehicle and transaction, so confirm the checklist before arranging the final handover.",
  ],
  [
    "How Long Does Selling a Car Take?",
    "Timing depends on inspection availability, your vehicle, the offer discussion and document readiness. Ask the team about the expected schedule for your sale. Do not treat an inspection appointment as a guaranteed completion or payment time.",
  ],
  [
    "Should I Repair My Car Before the Inspection?",
    "Clean the vehicle and describe known issues accurately. Before spending on major repairs, discuss whether the work is necessary for your intended sale. Repair costs do not automatically translate into an equal increase in the offer.",
  ],
  [
    "Can I Sell an Older or Out-of-State Car?",
    "Share the age, registration state, condition and available documents when you contact the team. Eligibility and additional transfer steps need to be confirmed for the specific vehicle. A booking request is not a guarantee that every vehicle can be accepted.",
  ],
  [
    "Can I Sell a Bike or Scooter Instead?",
    "Yes. Zapiboo also has a vehicle inspection booking flow for bikes and scooters. Open the booking page and select the appropriate vehicle category to continue with the relevant details.",
  ],
];
const benefits = [
  [
    Car,
    "A Market-Linked Offer",
    "Start with your car's actual details and condition. An inspection helps create a clearer basis for the offer, so you can ask informed questions before deciding whether to sell.",
  ],
  [
    MapPin,
    "Inspection at Your Doorstep",
    "Choose an available visit at your home or office. A scheduled inspection helps you plan around your day and gives the team time to assess your vehicle in person.",
  ],
  [
    ClipboardCheck,
    "A Clear Next Step",
    "Move from vehicle details to inspection and an offer discussion. You can ask about the paperwork and handover process before you commit, instead of working through the sale without guidance.",
  ],
  [
    ShieldCheck,
    "Support Through the Sale",
    "Discuss payment and RC transfer support with the team. Confirm the arrangements for your vehicle and keep the agreed details and transaction records together for your own reference.",
  ],
] as const;
const brands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Toyota",
  "Honda",
  "Kia",
  "Renault",
  "Volkswagen",
  "Skoda",
  "MG",
  "Nissan",
];
function Section({
  id,
  eyebrow,
  title,
  children,
  muted = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-b border-border py-14 sm:py-20 ${muted ? "bg-secondary/40" : "bg-background"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
const copy = "mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground";
function Cta({ children = "Start My Free Valuation" }: { children?: ReactNode }) {
  return (
    <a
      href="#car-valuation"
      className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
    >
      {children}
      <ArrowRight className="size-4" />
    </a>
  );
}

export default function SellUsedCar() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Used Car Inspection and Selling in Bangalore",
          serviceType: "Used car inspection and selling assistance",
          areaServed: "Bangalore",
          provider: { "@type": "Organization", name: businessContact.name, url: siteUrl },
          url: `${siteUrl}/sell-used-car`,
        }}
      />
      <section className="relative overflow-hidden bg-navy pb-24 pt-12 text-white sm:pt-16 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(31,89,104,0.35),transparent_65%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              A Simpler Way to Sell · Bangalore
            </p>
            <h1 className="mt-5 max-w-xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
              Sell Your Used Car <span className="text-brand-sunshine">With Confidence.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Get a fair, market-linked offer with a free doorstep inspection in Bangalore. Share
              your car details, meet the team and decide when the offer is right for you.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                [Car, "Free Doorstep Inspection"],
                [Wallet, "Clear Offer Discussion"],
                [ShieldCheck, "RC Transfer Support"],
              ].map(([Icon, title]) => {
                const BenefitIcon = Icon as typeof Car;
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
                href="#car-valuation"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 text-sm font-bold transition-colors hover:bg-brand-green-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
              >
                Get free valuation <ArrowRight className="size-4" />
              </a>
              <div className="flex w-full items-center gap-3 text-xs font-semibold text-white/60 lg:hidden">
                <span className="h-px flex-1 bg-white/20" />
                OR
                <span className="h-px flex-1 bg-white/20" />
              </div>
              <a
                href={servicesPaused ? openingSoonHref : `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Zapiboo, I want a free valuation for my used car in Bangalore.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-sm font-bold transition-colors hover:border-[#00C875] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:w-auto"
              >
                <WhatsAppIcon className="size-5 text-[#00C875]" />
                Sell instantly on WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden min-w-0 lg:block">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={inspection}
                alt="Doorstep vehicle inspection"
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <ol className="mt-4 grid grid-cols-3 gap-3">
              {["Share Details", "Get Inspected", "Review Your Offer"].map((label, index) => (
                <li key={label} className="text-xs leading-relaxed text-white/75">
                  <span className="mb-1 block text-sm font-extrabold text-brand-sunshine">
                    0{index + 1}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <div
        id="car-valuation"
        className="relative z-10 mx-auto -mt-14 max-w-4xl scroll-mt-24 px-4 sm:px-6"
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-8">
          <CarValuationForm />
        </div>
      </div>
      <Section eyebrow="Built Around Your Convenience" title="A Smarter Way to Sell Your Used Car">
        <p className={copy}>
          Selling a car can mean repeated calls, uncertain offers and several meetings. Zapiboo
          gives you a more organised starting point: share your details, arrange an inspection and
          discuss an offer with the team. You can focus on understanding your options and the steps
          needed to complete your sale.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([Icon, title, text]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon aria-hidden="true" className="size-7 text-primary" />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section
        id="how-it-works"
        eyebrow="From Details to a Decision"
        title="Sell Your Car in 3 Simple Steps"
        muted
      >
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {steps.map(([title, text], index) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <span className="text-4xl font-extrabold text-primary/25">0{index + 1}</span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <Cta />
      </Section>
      <Section id="car-value" eyebrow="Understand Your Car's Value" title="What Is My Car Worth?">
        <p className={copy}>
          There is no single price that applies to every used car. Even two vehicles with the same
          model and registration year can receive different offers. Their usage, maintenance,
          specification and current condition may be quite different. A useful valuation considers
          the vehicle you own, alongside the market it is being sold in.
        </p>
        <p className={copy}>
          Your original purchase price is one part of the car's history, but it does not determine
          today's offer. Share accurate details and use the inspection to ask questions about how
          the car has been assessed. These are some of the factors worth understanding before you
          decide.
        </p>
        <div className="mt-9 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {factors.map(([title, text], index) => (
            <article key={title} className="border-t border-border pt-5">
              <p className="text-xs font-bold text-primary">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <Cta>Check My Car's Selling Potential</Cta>
      </Section>
      <Section title="Less Coordination. A Clearer Selling Journey." muted>
        <p className={copy}>
          Selling privately suits some owners, but it also means managing the price discussion,
          enquiries, visits and paperwork yourself. A guided process can reduce the amount you need
          to organise. Compare the approaches and choose the experience that works for your schedule
          and your car.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <table className="w-full table-fixed text-left text-sm">
            <caption className="sr-only">
              Private selling compared with Zapiboo's inspection-led process
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="p-4 sm:p-5">
                  Selling on Your Own
                </th>
                <th scope="col" className="p-4 sm:p-5">
                  Selling With Zapiboo
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Create a listing and describe your car",
                  "Start with a guided vehicle-details form",
                ],
                [
                  "Coordinate enquiries and viewing requests",
                  "Book an available doorstep inspection",
                ],
                [
                  "Assess different asking prices yourself",
                  "Discuss a market-linked offer after inspection",
                ],
                [
                  "Plan the handover and paperwork",
                  "Ask the team about payment and RC transfer support",
                ],
                [
                  "Choose whether an offer suits you",
                  "Review the offer and decide whether to proceed",
                ],
              ].map(([left, right]) => (
                <tr key={left} className="border-t border-border bg-card">
                  <td className="p-4 leading-relaxed text-muted-foreground sm:p-5">{left}</td>
                  <td className="p-4 font-medium leading-relaxed sm:p-5">{right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="A New Chapter for Your Car">
        <div className="mt-5 grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className={copy}>
              Upgrading, relocating or simply using your car less? Start with the vehicle you have.
              Hatchbacks, sedans, SUVs and family cars each have their own selling considerations.
              Share the exact model and condition so the team can confirm the next steps for your
              vehicle.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                [
                  "Hatchbacks and Sedans",
                  "City use, mileage, maintenance and variant help explain your car's history. Share these details even if your car has mostly been used for short journeys.",
                ],
                [
                  "SUVs and Family Cars",
                  "Mention the seating configuration, drivetrain and use of the vehicle. These details help distinguish similar-looking variants and prepare for an inspection.",
                ],
                [
                  "Electric and Hybrid Cars",
                  "Have any available battery, service and warranty information ready. Confirm with the team how your particular vehicle can be assessed.",
                ],
                [
                  "Premium and Older Cars",
                  "Detailed service records and an honest account of condition are particularly useful. Eligibility and inspection arrangements should be confirmed for the specific car.",
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <Image
            src={car}
            alt="Red hatchback"
            sizes="(min-width: 1024px) 500px, 100vw"
            className="w-full object-contain"
          />
        </div>
        <h3 className="mt-10 text-xl font-bold">Popular Car Brands</h3>
        <p className={copy}>
          Have the brand, model and variant ready when you begin. Contact the team to confirm
          eligibility for your specific vehicle.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <li key={brand} className="rounded-full border border-border px-4 py-2 text-sm">
              {brand}
            </li>
          ))}
        </ul>
      </Section>
      <Section eyebrow="Local Service" title="Sell Your Used Car in Bangalore" muted>
        <p className={copy}>
          Finding time for a car sale between work, family and Bangalore traffic can be difficult.
          Start online and choose an available inspection slot for your location. Enter your address
          and pincode during booking so the team can check the visit details before coming to you.
        </p>
        <p className={copy}>
          Whether you are in Whitefield, Electronic City, HSR Layout, Koramangala, Indiranagar,
          Jayanagar, JP Nagar, Marathahalli, Hebbal, Yelahanka or Bellandur, check availability in
          the booking flow. Share any access instructions for your home or office to help the
          inspection run smoothly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pickup?vehicle=car"
            className="rounded-xl border border-primary px-5 py-3 text-sm font-bold text-primary"
          >
            Check Inspection Availability
          </Link>
          <a
            href={businessContact.phoneHref}
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold"
          >
            Talk to the Team
          </a>
        </div>
      </Section>
      <Section title="Get Ready for Your Inspection">
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-border p-6 sm:p-8">
            <h3 className="text-xl font-bold">Keep Your Documents Together</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Gather your registration certificate, current insurance information and
              identification. Keep available service invoices, PUC records and any finance-related
              documents together too. These help you explain the vehicle's history and identify
              questions that need attention before a sale.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              If there is an active loan, a missing document or a registration detail that needs
              updating, mention it early. Document requirements vary by vehicle and transaction;
              confirm the specific checklist with the team and relevant authority or lender before
              completing a transfer.
            </p>
          </article>
          <article className="rounded-2xl border border-border p-6 sm:p-8">
            <h3 className="text-xl font-bold">Present the Car Clearly</h3>
            <ul className="mt-5 space-y-4">
              {[
                "Clean the exterior and interior so the car can be assessed clearly.",
                "Remove personal items from the glove box, boot and storage pockets.",
                "Keep service information and spare keys easy to find.",
                "Mention known faults, repairs and modifications accurately.",
                "Check basic features and note anything that does not work.",
              ].map((text) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>
      <Section title="Your Car. Your Decision." muted>
        <p className={copy}>
          A good selling experience leaves you clear about what is happening. Ask how the offer was
          assessed, what payment arrangements apply and how the handover will be recorded. Keep
          copies of the agreed details, and clarify any outstanding questions before proceeding.
        </p>
        <p className={copy}>
          You can contact Zapiboo directly to discuss your inspection and sale. Our{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-4">
            privacy policy
          </Link>{" "}
          explains information handling, and the{" "}
          <Link href="/terms" className="text-primary underline underline-offset-4">
            terms of service
          </Link>{" "}
          provide further context for using the service. For a question about your particular
          vehicle,{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">
            contact the team
          </Link>
          .
        </p>
      </Section>
      <Section id="selling-guide" title="The Easier Way to Approach a Used Car Sale">
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <p className="text-base leading-relaxed text-muted-foreground">
            Begin with a clear picture of your vehicle. Write down the exact model, variant, age and
            kilometres driven, and gather any maintenance records you have. Think about the
            condition as it is today, including known issues. This preparation makes the inspection
            conversation more useful and reduces the need to check missing details later.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Next, look beyond a headline price. Understand what the offer covers, what steps remain
            and what is expected of you before handover. A convenient appointment, clear
            communication and an organised document process also matter. Take the opportunity to ask
            questions so you can judge the complete sale arrangement.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            An online request can simplify the start, but selling a physical vehicle still involves
            an assessment and a careful handover. Allow time for those stages. If your plans change,
            speak with the team about your appointment instead of assuming that an initial request
            has already completed the sale.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Whether you are moving to another city, replacing your car or reducing the number of
            vehicles at home, you can start with the same straightforward process. Share accurate
            details, arrange an inspection and review the offer. The goal is to give you enough
            clarity to make a decision that works for you.
          </p>
        </div>
      </Section>
      <Section id="faqs" title="Questions About Selling Your Car" muted>
        <div className="mt-8 grid items-start gap-3 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
      <section className="bg-navy py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-sunshine">
            Take the First Step
          </p>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Ready to Sell Your Car?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Start with your registration number and arrange a free inspection. Share your details,
            understand the offer and choose your next step.
          </p>
          <div className="mt-8 rounded-2xl bg-card p-5 text-left sm:p-8">
            <CarValuationForm />
          </div>
          <nav
            aria-label="Car selling resources"
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/70"
          >
            <a href="#car-value" className="hover:text-white">
              Car Valuation
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>
            <a href="#faqs" className="hover:text-white">
              Selling FAQs
            </a>
            <Link href="/contact" className="hover:text-white">
              Contact Zapiboo
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
