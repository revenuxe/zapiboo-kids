"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  CalendarDays,
  PackageCheck,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/PageLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type PickupOrder = {
  id: string;
  pickup_id: string | null;
  status: string;
  vehicle_type: string;
  items: string[];
  message: string | null;
  brand_name: string | null;
  model_name: string | null;
  registration_number: string | null;
  manufacture_year: number | null;
  preferred_date: string | null;
  slot: string | null;
  address: string | null;
  locality: string | null;
  pincode: string | null;
  created_at: string;
};

const statusMeta: Record<string, { label: string; className: string; note: string }> = {
  new: {
    label: "Request received",
    className: "bg-primary/15 text-primary",
    note: "Your pickup request is with Zapiboo.",
  },
  contacted: {
    label: "Team contacted",
    className: "bg-amber-500/15 text-amber-700",
    note: "Our team is confirming the pickup details.",
  },
  scheduled: {
    label: "Pickup scheduled",
    className: "bg-blue-500/15 text-blue-700",
    note: "Your pickup visit is scheduled.",
  },
  done: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-700",
    note: "This pickup has been completed.",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
    note: "This pickup was cancelled.",
  },
};

function statusFor(status: string) {
  return (
    statusMeta[status] ?? {
      label: status,
      className: "bg-secondary text-muted-foreground",
      note: "Your pickup is being reviewed.",
    }
  );
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<PickupOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    user ? ["customer-pickups", user.id] : null,
    async () => {
      // Request only customer-facing fields. Operational notes live in an admin-only table.
      const { data, error } = await supabase
        .from("leads")
        .select(
          "id,pickup_id,status,vehicle_type,items,message,brand_name,model_name,registration_number,manufacture_year,preferred_date,slot,address,locality,pincode,created_at",
        )
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as PickupOrder[]).filter((order) => order.vehicle_type !== "query");
    },
  );

  if (loading) return <PageLoader label="Loading your pickups..." />;
  const orders = data ?? [];
  const cancelOrder = async () => {
    if (!selected) return;
    setCancelling(true);
    const { error } = await supabase
      .from("leads")
      .update({ status: "cancelled" })
      .eq("id", selected.id)
      .select("id")
      .single();
    setCancelling(false);
    if (error)
      return toast.error("This pickup can no longer be cancelled. Please contact our team.");
    const cancelled = { ...selected, status: "cancelled" };
    setSelected(cancelled);
    await mutate(
      (current) => current?.map((item) => (item.id === cancelled.id ? cancelled : item)),
      false,
    );
    toast.success("Pickup cancelled.");
  };

  return (
    <main className="bg-secondary/25 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-navy px-6 py-8 text-white sm:px-9 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            Zapiboo pickup orders
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your item pickups
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Track your selling requests, view appointment details and manage pending pickups in one
            place.
          </p>
        </div>
        {isLoading ? (
          <PageLoader label="Loading your orders..." full={false} />
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <ClipboardList className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-xl font-bold">No pickup orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share the kids items you want to sell and request a pickup to see it here.
            </p>
            <Button asChild className="mt-6">
              <a href="/pickup">Book a pickup</a>
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {orders.map((order) => {
              const status = statusFor(order.status);
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelected(order)}
                  className="group rounded-3xl border border-border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <PackageCheck className="size-5" />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold tracking-wider text-muted-foreground">
                    {order.pickup_id ?? "PICKUP REQUEST"}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    {order.model_name ??
                      order.brand_name ??
                      order.items?.join(" · ") ??
                      order.vehicle_type}
                  </h2>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" />
                    {order.preferred_date ?? "Date to be confirmed"}
                    {order.slot ? ` · ${order.slot}` : ""}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-primary">View pickup details →</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {selected &&
            (() => {
              const status = statusFor(selected.status);
              const canCancel = ["new", "contacted", "scheduled"].includes(selected.status);
              return (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-7">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-primary">
                          {selected.pickup_id ?? "PICKUP REQUEST"}
                        </p>
                        <DialogTitle className="mt-1">Pickup details</DialogTitle>
                        <DialogDescription className="mt-2">{status.note}</DialogDescription>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                  </DialogHeader>
                  <div className="mt-4 space-y-4 rounded-2xl bg-secondary/50 p-4 text-sm">
                    <p>
                      <strong>Items</strong>
                      <br />
                      {selected.model_name ??
                        selected.brand_name ??
                        selected.items?.join(" · ") ??
                        selected.vehicle_type}
                    </p>
                    {selected.items?.length > 0 && (
                      <ul className="space-y-1 text-muted-foreground">
                        {selected.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {selected.message && (
                      <p>
                        <strong>Item notes</strong>
                        <br />
                        {selected.message}
                      </p>
                    )}
                    <p className="flex gap-2">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Appointment</strong>
                        <br />
                        {selected.preferred_date ?? "To be confirmed"}
                        {selected.slot ? ` · ${selected.slot}` : ""}
                      </span>
                    </p>
                    <p className="flex gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <strong>Pickup address</strong>
                        <br />
                        {[selected.address, selected.locality, selected.pincode]
                          .filter(Boolean)
                          .join(", ") || "To be confirmed"}
                      </span>
                    </p>
                  </div>
                  {canCancel ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-5 w-full text-destructive hover:text-destructive"
                        >
                          <XCircle className="size-4" /> Cancel pickup
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this pickup?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your pickup request will be cancelled and cannot be restored from this
                            page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep pickup</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={cancelling}
                            onClick={cancelOrder}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {cancelling && <Loader2 className="size-4 animate-spin" />} Cancel
                            pickup
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-primary" /> This pickup can no longer be
                      cancelled online.
                    </div>
                  )}
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </main>
  );
}
