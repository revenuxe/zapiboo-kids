"use client";

import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "@/hooks/use-auth";

async function fetchSellerPhone(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Couldn't load the seller's number.");
  return result as { phone: string };
}

export function FloatingContactActions({
  listingId,
  buyerCallEnabled,
}: {
  listingId: string;
  buyerCallEnabled: boolean;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data, error } = useSWR(
    user && buyerCallEnabled ? `/api/marketplace/${listingId}/contact` : null,
    fetchSellerPhone,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const chatPath = `/chats?listing=${encodeURIComponent(listingId)}`;
  const signInForChat = `/auth?redirectTo=${encodeURIComponent(chatPath)}`;
  const signInForCall = `/auth?redirectTo=${encodeURIComponent(pathname || "/marketplace")}`;
  const phoneLabel = data ? `+91 ${data.phone.slice(0, 5)} ${data.phone.slice(5)}` : "";
  const callStatus = !buyerCallEnabled
    ? "This seller hasn't enabled calls. Use Chat Now instead."
    : error?.message || "Loading the seller's number.";

  return (
    <nav className="floating-contact-actions" aria-label="Contact the seller">
      <a
        href={user ? chatPath : signInForChat}
        aria-label="Chat Now with the seller"
        className="floating-chat-now"
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span>Chat Now</span>
      </a>
      {user && data ? (
        <a
          href={`tel:+91${data.phone}`}
          aria-label={`Call seller at ${phoneLabel}`}
          className="floating-call-now"
        >
          <Phone size={18} aria-hidden="true" />
          <span className="floating-call-copy">
            <span>Call Now</span>
            <small>{phoneLabel}</small>
          </span>
        </a>
      ) : !user ? (
        <a
          href={signInForCall}
          aria-label="Sign in to call the seller"
          className="floating-call-now"
        >
          <Phone size={18} aria-hidden="true" />
          <span>Call Now</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          title={callStatus}
          aria-label={callStatus}
          className="floating-call-now"
        >
          <Phone size={18} aria-hidden="true" />
          <span>Call Now</span>
        </button>
      )}
      {user && (!buyerCallEnabled || error) && (
        <span className="floating-contact-status" role={error ? "alert" : "status"}>
          {callStatus}
        </span>
      )}
    </nav>
  );
}
