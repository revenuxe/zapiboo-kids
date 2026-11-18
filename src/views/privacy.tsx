import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";

const sections = [
  [
    "Private marketplace chats",
    "Marketplace chat access is restricted to the buyer and seller in the application. Authorised operators may access records for support and report review. We store messages and conversation state to operate the inbox, read receipts and reporting features. Do not include phone numbers, email addresses or off-platform contact details; messages are checked before they are saved. Reports are stored for review by authorised operators.",
  ],
  [
    "Public marketplace information",
    "When you publish a vehicle, its title, description, specifications, asking price, photos, your seller name and neighbourhood become public. Do not include your exact home address, identity documents or bank details. Your mobile number is private and is not shown to buyers or sellers. Marketplace communication takes place in Zapiboo Chats.",
  ],
  [
    "Drafts and saved vehicles",
    "Listing drafts, including any details and compressed photos you add, are saved locally in this browser. Saved vehicles are also stored on this device. Unsent chat drafts are kept in the current tab and scoped to your account. They do not sync between devices. Avoid entering private information on shared devices, and clear the browser data when needed.",
  ],
  [
    "Information we collect",
    "When you create an account or send a service enquiry, we may collect your name, email, phone number, chosen service and message. You may include your neighbourhood, preferred dates, budget and your vehicle model and year to explain your requirements.",
  ],
  [
    "How we use your information",
    "We use these details to manage your account, respond to service enquiries, understand your requirements and explain the next steps. We may contact you by phone, WhatsApp or email about a request you submit.",
  ],
  [
    "Enquiry details",
    "Use the enquiry form for vehicle details. Avoid including identity documents, bank details or unrelated private information. Ask our team how to share any required documents securely.",
  ],
  [
    "Service providers",
    "We share information where needed to operate the website, authenticate accounts, store optional images, handle communications and arrange the service you request. We do not sell your personal information for independent third-party marketing.",
  ],
  [
    "Keeping your information",
    "We retain information as needed to manage your requests, provide support, maintain business records and meet applicable obligations. You can contact us about the information associated with your account.",
  ],
  [
    "Your choices",
    "Optional enquiry details can be omitted. You can ask us to correct inaccurate details or request deletion, subject to any records we need to keep for completed transactions or applicable obligations.",
  ],
  [
    "Security and external services",
    "We use reasonable measures to protect information. Services such as maps, Google sign-in and WhatsApp have their own privacy policies. Please review those policies when you use them.",
  ],
  [
    "Updates",
    "We may update this page as our service changes. The current policy is available here.",
  ],
] as const;

export default function Privacy() {
  return (
    <main className="bg-background">
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy"
        subtitle="How Zapiboo collects, uses and protects information when you use our used vehicle selling services."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          This policy applies to Zapiboo&apos;s website, service enquiries and related
          communications. It explains the information we handle when you explore vehicle selling
          services or send an enquiry.
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
          <h2 className="text-xl font-bold">Contact us about privacy</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            For privacy questions or a request about your information, contact Zapiboo at{" "}
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href={businessContact.emailHref}
            >
              {businessContact.email}
            </a>{" "}
            or call{" "}
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href={businessContact.phoneHref}
            >
              {businessContact.phone}
            </a>
            . You can also use our{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary underline underline-offset-4"
            >
              contact form
            </Link>
            .
          </p>
        </section>
      </section>
    </main>
  );
}
