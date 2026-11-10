"use client";

import { servicesPaused, openingSoonHref, showOpeningSoon } from "@/lib/launch-status";

import { useState } from "react";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { businessContact } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { isSpamLead } from "@/lib/spam-filter";


export default function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (servicesPaused) { showOpeningSoon(); return; }
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot: real visitors never fill this hidden field, bots that
    // auto-fill every input do. Pretend to succeed without writing anything.
    if (String(formData.get("website") ?? "").trim()) {
      form.reset();
      toast.success("Message sent! We'll get back to you within one business day.");
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    // Bot heuristics: random strings, dot-stuffed emails, link spam.
    // Silently accept so bots don't learn, but never store the row.
    if (isSpamLead({ name, email, subject, notes: message })) {
      form.reset();
      toast.success("Message sent! We'll get back to you within one business day.");
      return;
    }



    setSending(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: "query",
      vehicle_type: "query",
      items: ["Contact query"],
      has_photo: false,
      name,
      email,
      phone: phone || email,
      subject,
      notes: message,
      status: "new",
    });
    setSending(false);

    if (error) {
      toast.error("Couldn't send your message. Please call or WhatsApp us.");
      return;
    }

    form.reset();
    toast.success("Message sent! We'll get back to you within one business day.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Let&apos;s <span className="text-gradient">connect</span></>}
        subtitle="Whether you need help listing items, pickup support, or have a question about our service, we would love to help."
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: servicesPaused ? "Email support opening soon" : businessContact.email, href: servicesPaused ? openingSoonHref : businessContact.emailHref },
              { icon: Phone, label: "Phone", value: servicesPaused ? "Phone support opening soon" : businessContact.phone, href: servicesPaused ? openingSoonHref : businessContact.phoneHref },
              { icon: MapPin, label: "Visit us", value: businessContact.address, href: servicesPaused ? openingSoonHref : "https://www.google.com/maps/search/?api=1&query=No%206%2C%201st%20Cross%2C%20Umar%20Nagar%2C%20Nagawara%20Main%20Road%2C%20Bangalore%20560045" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <c.icon className="size-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} target={c.label === "Visit us" ? "_blank" : undefined} rel={c.label === "Visit us" ? "noreferrer" : undefined} className="font-semibold text-foreground hover:text-primary">
                      {c.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-foreground">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
            <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-xl font-bold">Serving Nagawara and all of Bangalore</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">Zapiboo is located on Nagawara Main Road and helps parents across Bangalore sell pre-loved kids items with selling support and doorstep pickup. Contact us to check availability in your area.</p>
            </aside>
          </div>

          <form data-service-form={servicesPaused ? "" : undefined}
            onSubmit={onSubmit}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="absolute left-[-9999px] top-auto size-px overflow-hidden" aria-hidden="true">
                <label htmlFor="cwebsite">Leave this field empty</label>
                <input id="cwebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cphone">Phone / WhatsApp</Label>
                <Input id="cphone" name="phone" inputMode="tel" placeholder="Optional" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="csubject">Subject</Label>
                <Input id="csubject" name="subject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cmsg">Message</Label>
                <Textarea id="cmsg" name="message" required rows={5} placeholder="Tell us about what you'd like to sell..." />
              </div>
            </div>
            <Button type="submit" variant="hero" size="xl" className="mt-8 w-full" disabled={sending}>
              {sending ? "Sending..." : "Send message"}
              {!sending && <Send />}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
