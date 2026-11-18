"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarHeart } from "lucide-react";
import { servicesPaused } from "@/lib/launch-status";

export function OpeningSoonMessage({ saved = false }: { saved?: boolean }) {
  return (
    <div className="text-center">
      <CalendarHeart aria-hidden="true" className="mx-auto mb-5 h-24 w-28 text-primary" />

      <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary">
        Getting ready for you
      </p>
      <h2 className="text-2xl font-bold tracking-tight">Sorry, we’re not open just yet</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We’re preparing our vehicle selling services. Enquiries and customer support are temporarily
        unavailable. You can still explore the service categories.
      </p>
      {saved && (
        <p className="mt-4 rounded-xl bg-primary/5 p-3 text-sm text-muted-foreground">
          You’re signed in and your account details are saved. No service has been booked. You can
          return with this account when we open.
        </p>
      )}
    </div>
  );
}

export function ServiceAvailability() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!servicesPaused) return;
    const show = () => setOpen(true);
    const intercept = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[role="dialog"]')) return;
      const link = target.closest("a");
      const href = link?.getAttribute("href") ?? "";
      const contact =
        /^(tel:|mailto:|https?:\/\/(wa\.me|api\.whatsapp\.com|www\.instagram\.com|www\.youtube\.com)\/)/i.test(
          href,
        ) || href === "#service-opening-soon";
      const form = target.closest("form[data-service-form]");
      if (!contact && !form) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.type === "focusin" && target instanceof HTMLElement) target.blur();
      show();
    };
    window.addEventListener("zapiboo:opening-soon", show);
    const events = ["click", "pointerdown", "focusin", "submit"];
    events.forEach((event) => document.addEventListener(event, intercept, true));
    return () => {
      window.removeEventListener("zapiboo:opening-soon", show);
      events.forEach((event) => document.removeEventListener(event, intercept, true));
    };
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-sm rounded-3xl p-6 sm:rounded-3xl sm:p-7"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">Services opening soon</DialogTitle>
        <DialogDescription className="sr-only">
          We are preparing our vehicle selling services. Services and customer support are
          temporarily unavailable.
        </DialogDescription>
        <OpeningSoonMessage />
        <button
          onClick={() => setOpen(false)}
          className="mt-2 min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          Got it, thank you
        </button>
      </DialogContent>
    </Dialog>
  );
}
