import { Phone, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";

export function ContactActions({
  message = "Hi Zapiboo, I would like help selling my pre-loved kids items.",
  dark = false,
}: {
  message?: string;
  dark?: boolean;
}) {
  return (
    <div className={`contact-actions${dark ? " contact-actions-dark" : ""}`}>
      <a
        href={`${businessContact.whatsappHref}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-whatsapp"
      >
        <WhatsAppIcon className="size-5" />
        <span>Chat on WhatsApp</span>
        <ArrowUpRight size={15} />
      </a>
      <a href={businessContact.phoneHref} className="contact-phone">
        <Phone size={16} />
        <span>{businessContact.phone}</span>
      </a>
    </div>
  );
}
