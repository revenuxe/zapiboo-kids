
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const sections = [
  [
    "Using the service",
    "Zapiboo helps parents in Bangalore share pre-loved kids items for sale and arrange pickup when available. You must be at least 18 and authorised to sell the items you submit. Please provide accurate contact and item details."
  ],
  [
    "Items and condition",
    "Describe your items honestly, including wear, damage, missing pieces and accessories. Only submit items you own and are authorised to sell. Items must be safe for their intended use. Do not submit recalled, expired, counterfeit or unsafe products. For safety-related gear, disclose relevant history and expiry information."
  ],
  [
    "Review and acceptance",
    "Submitting details does not guarantee acceptance, a completed sale or a particular payment. Our team may need to review photos, condition and other information before confirming the next steps. You may ask questions and decline before accepting the final sale terms."
  ],
  [
    "Pickup requests",
    "Dates and time slots are preferences until our team confirms availability. Collection depends on service coverage, item eligibility and operating capacity. Please tell us if your address, availability or item details change."
  ],
  [
    "Payment and handover",
    "Sale, payment and handover arrangements are confirmed with you before you proceed. Review those details before handing over your items. Remove personal data from electronics and personal belongings from bags, clothing and baby gear."
  ],
  [
    "Your account",
    "Keep your sign-in details private and your contact information up to date. Do not submit false information, misuse the service or access another person?s account without permission."
  ],
  [
    "Availability",
    "Some services may be paused or not yet open. An account or saved draft is not a confirmed pickup. We display an opening-soon message while collection and booking services are unavailable."
  ],
  [
    "Website use",
    "Use the website lawfully. Do not disrupt its operation, submit malicious content or attempt unauthorised access to its systems. We may restrict access where the service is being misused."
  ],
  [
    "Service limitations",
    "To the extent permitted by law, Zapiboo is not responsible for indirect, incidental or consequential loss arising from website use, missed appointments or third-party services. These terms do not limit rights or liabilities that cannot legally be limited."
  ],
  [
    "Updates and governing law",
    "We may update these terms as the service changes. These terms are governed by the laws applicable in India, subject to mandatory legal rights and the jurisdiction of the appropriate courts."
  ]
] as const;

export default function Terms() {
  return <main className="bg-background"><PageHeader eyebrow="Legal" title="Terms of service" subtitle="The terms that apply when you use Zapiboo&apos;s pre-loved kids item selling service." /><section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">Please read these terms before requesting a pickup or proceeding with a sale. They explain how the service works and the responsibilities of both the seller and Zapiboo.</p><div className="mt-10 space-y-10">{sections.map(([title, text]) => <article key={title}><h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{text}</p></article>)}</div><section className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-6"><h2 className="text-xl font-bold">Questions about these terms?</h2><p className="mt-3 leading-relaxed text-muted-foreground">Contact Zapiboo at <a className="font-semibold text-primary underline underline-offset-4" href={businessContact.emailHref}>{businessContact.email}</a> or <a className="font-semibold text-primary underline underline-offset-4" href={businessContact.phoneHref}>{businessContact.phone}</a>. For a item-specific question, use our <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">contact page</Link>.</p></section></section></main>;
}
