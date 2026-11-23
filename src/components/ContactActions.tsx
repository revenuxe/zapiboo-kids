import { Mail } from "lucide-react";
import { businessContact } from "@/lib/seo";

export function ContactActions({
  message,
  dark = false,
}: {
  message?: string;
  dark?: boolean;
}) {
  const href = message
    ? businessContact.emailHref + "?body=" + encodeURIComponent(message)
    : businessContact.emailHref;

  return (
    <div className={`contact-actions${dark ? " contact-actions-dark" : ""}`}>
      <a href={href} className="contact-phone">
        <Mail size={16} />
        <span>Email us</span>
      </a>
    </div>
  );
}
