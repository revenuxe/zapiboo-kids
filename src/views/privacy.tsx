
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const sections = [
  [
    "Information we collect",
    "When you create an account, share items to sell or request a pickup, we may collect your name, email, phone number, item category, condition, optional notes and photographs. Address, pincode, preferred appointment details and optional map location are collected when needed for pickup."
  ],
  [
    "How we use your information",
    "We use these details to manage your account, review the items you want to sell, respond to enquiries, arrange collection and explain the next steps. We may contact you by phone, WhatsApp or email about a request you submit."
  ],
  [
    "Item photos and location",
    "Photos help our team understand the items and their condition. Avoid including children, personal documents or unrelated private details in photographs. Address and optional map location help us plan collection and check availability."
  ],
  [
    "Service providers",
    "We share information where needed to operate the website, authenticate accounts, store optional images, handle communications and arrange the service you request. We do not sell your personal information for independent third-party marketing."
  ],
  [
    "Keeping your information",
    "We retain information as needed to manage your requests, provide support, maintain business records and meet applicable obligations. You can contact us about the information associated with your account."
  ],
  [
    "Your choices",
    "Optional photographs, notes and map location can be omitted. You can ask us to correct inaccurate details or request deletion, subject to any records we need to keep for completed transactions or applicable obligations."
  ],
  [
    "Security and external services",
    "We use reasonable measures to protect information. Services such as maps, Google sign-in and WhatsApp have their own privacy policies. Please review those policies when you use them."
  ],
  [
    "Updates",
    "We may update this page as our service changes. The current policy is available here."
  ]
] as const;

export default function Privacy() {
  return <main className="bg-background"><PageHeader eyebrow="Privacy" title="Privacy policy" subtitle="How Zapiboo collects, uses and protects information when you use our kids item selling services." /><section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">This policy applies to Zapiboo&apos;s website, item pickup requests and related communications. It explains the information we handle when you sell or enquire about pre-loved kids items through our services.</p><div className="mt-10 space-y-10">{sections.map(([title, text]) => <article key={title}><h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{text}</p></article>)}</div><section className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-6"><h2 className="text-xl font-bold">Contact us about privacy</h2><p className="mt-3 leading-relaxed text-muted-foreground">For privacy questions or a request about your information, contact Zapiboo at <a className="font-semibold text-primary underline underline-offset-4" href={businessContact.emailHref}>{businessContact.email}</a> or call <a className="font-semibold text-primary underline underline-offset-4" href={businessContact.phoneHref}>{businessContact.phone}</a>. You can also use our <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">contact form</Link>.</p></section></section></main>;
}
