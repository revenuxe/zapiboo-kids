import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const sections = [
  [
    "Using the service",
    "Zapiboo helps parents in Bangalore explore kids and family service categories and send enquiries. Please use the service as an adult parent, guardian or authorised representative and provide accurate contact details.",
  ],
  [
    "Your requirements",
    "Describe your requirements clearly, including the service, area, preferred dates and any relevant preferences. Avoid sharing sensitive information about your child through the general enquiry form.",
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
        subtitle="The terms that apply when you use Zapiboo's kids and family service enquiries."
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
            </a>{" "}
            or{" "}
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href={businessContact.phoneHref}
            >
              {businessContact.phone}
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
