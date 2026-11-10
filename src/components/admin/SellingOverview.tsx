"use client";

import useSWR from "swr";
import { Inbox, CalendarDays, PackageCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isKidsPickup } from "@/lib/pickup-summary";
import { Button } from "@/components/ui/button";

export function SellingOverview() {
  const { data, error, isLoading, mutate } = useSWR(["admin", "selling-overview"], async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("vehicle_type,items,lead_type,status");
    if (error) throw error;
    return data.filter(isKidsPickup);
  });
  if (error)
    return (
      <div
        role="alert"
        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-card p-4 text-sm"
      >
        <p>Could not load pickup totals. Check your connection and try again.</p>
        <Button variant="outline" size="sm" onClick={() => void mutate()}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  const requests = data ?? [];
  const metrics = [
    { label: "Selling requests", value: requests.length, icon: Inbox },
    {
      label: "Needs follow-up",
      value: requests.filter((item) => ["new", "contacted"].includes(item.status)).length,
      icon: PackageCheck,
    },
    {
      label: "Pickup scheduled",
      value: requests.filter((item) => item.status === "scheduled").length,
      icon: CalendarDays,
    },
    {
      label: "Completed pickups",
      value: requests.filter((item) => item.status === "done").length,
      icon: CheckCircle2,
    },
  ];
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map(({ label, value, icon: Icon }) => (
        <article key={label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <Icon className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-extrabold" aria-busy={isLoading}>
            {isLoading ? "…" : value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </article>
      ))}
    </div>
  );
}
