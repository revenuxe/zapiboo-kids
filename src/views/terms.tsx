import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const sections = [
  [
    "Marketplace listings",
    "List only a vehicle you own or are authorised to sell. Provide accurate specifications, an honest description, a genuine asking price and photos you have permission to publish. Example listings are labelled and are not offers for sale.",
  ],
  [
    "Connecting with buyers",
    "Published listings, photos, seller names and neighbourhoods are public. Mobile numbers stay private. Use Zapiboo Chats to speak with buyers and sellers; do not share phone numbers, email addresses, social handles or off-platform links. Buyers and sellers agree inspection, payment and ownership transfer directly. Publishing does not guarantee a buyer or sale.",
  ],
  [
    "Managing a listing",
    "Use My listings to mark a vehicle as sold, archive it or relist it. Archived and sold listings are removed from public marketplace results. For corrections or removal of stored records, contact the Zapiboo team.",
  ],
  [
    "Using the service",
    "Zapiboo helps vehicle owners in Bangalore explore used vehicle categories and send selling enquiries. Use the service as an adult vehicle owner or authorised representative and provide accurate details.",
  ],
  [
    "Your requirements",
    "Describe your requirements clearly, including the service, area, preferred dates and any relevant preferences. Include accurate vehicle details; provide ownership documents only through an agreed secure process.",
  ],
  [
    "Review and acceptance",
    "Submitting an enquiry does not guarantee a provider, availability or a confirmed booking. Confirm the service details, suitability and next steps before proceeding.",
  ],
  [
    "Service enquiries",
    "Dates and times included in an enquiry are preferences until confirmed with the provider. Availability depends on the service, location and your requirements. Please tell us if your requirements change.",
  ],
  [
    "Fees and arrangements",
    "Confirm fees, inclusions, payment arrangements, cancellation terms and provider responsibilities before booking or paying. Ask about qualifications, experience and references where relevant.",
  ],
  [
    "Your account",
    "Keep your sign-in details private and your contact information up to date. Do not submit false information, misuse the service or access another person?s account without permission.",
  ],
  [
    "Availability",
    "Some services may be paused or not yet open. An account or enquiry is not a confirmed booking. Category pages do not guarantee local provider availability.",
  ],
  [
    "Website use",
    "Use the website lawfully. Do not disrupt its operation, submit malicious content or attempt unauthorised access to its systems. We may restrict access where the service is being misused.",
  ],
  [
    "Service limitations",
    "To the extent permitted by law, Zapiboo is not responsible for indirect, incidental or consequential loss arising from website use, missed appointments or third-party services. These terms do not limit rights or liabilities that cannot legally be limited.",
  ],
  [
    "Updates and governing law",
    "We may update these terms as the service changes. These terms are governed by the laws applicable in India, subject to mandatory legal rights and the jurisdiction of the appropriate courts.",
  ],
] as const;

export default function Terms() {
  return (
    <main className="bg-background">
      <PageHeader
        eyebrow="Legal"
        title="Terms of service"
        subtitle="The terms that apply when you use Zapiboo's used vehicle selling enquiries."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          Please read these terms before sending an enquiry or arranging a service. They explain how
          the website and service enquiries work.
        </p>
        <div className="mt-10 space-y-10">
          {sections.map(([title, text]) => (
            <article key={title}>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <section className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="text-xl font-bold">Questions about these terms?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Contact Zapiboo at{" "}
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href={businessContact.emailHref}
            >
              {businessContact.email}
            </a>
            . For a service-specific question, use our{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary underline underline-offset-4"
            >
              contact page
            </Link>
            .
          </p>
        </section>
      </section>
    </main>
  );
}
