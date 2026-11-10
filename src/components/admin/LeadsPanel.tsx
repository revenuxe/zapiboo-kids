"use client";
import { PrivatePickupPhoto } from "@/components/admin/PrivatePickupPhoto";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useCommand } from "@/hooks/use-command";
import { useDataCache } from "@/hooks/use-data-cache";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Search,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Boxes,
  Mail,
  MessageSquareText,
  Loader2,
  Inbox,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { isKidsPickup, pickupCategory, pickupCondition } from "@/lib/pickup-summary";
import { isSpamLead } from "@/lib/spam-filter";

type Lead = {
  id: string;
  pickup_id: string | null;
  lead_type: string | null;
  vehicle_type: string;
  items: string[];
  has_photo: boolean;
  photo_url: string | null;
  locality: string | null;
  pincode: string | null;
  address: string | null;
  name: string;
  email: string | null;
  subject: string | null;
  phone: string;
  preferred_date: string | null;
  slot: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  message: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "scheduled", "done", "cancelled"] as const;

const statusStyle: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  contacted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  scheduled: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
};

function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        statusStyle[status] ?? "bg-secondary text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

function isQueryLead(lead: Lead) {
  return lead.lead_type === "query" || lead.vehicle_type === "query";
}

function LeadTypeChip({ lead }: { lead: Lead }) {
  if (!isQueryLead(lead)) return null;

  return (
    <span className="inline-flex rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-300">
      query
    </span>
  );
}

export type LeadScope = "all" | "bookings" | "queries";

export function LeadsPanel({ scope = "all" }: { scope?: LeadScope } = {}) {
  const qc = useDataCache();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [draftStatus, setDraftStatus] = useState("new");
  const [draftNotes, setDraftNotes] = useState("");

  const {
    data: leadData,
    isLoading: loading,
    error: loadError,
    mutate: reload,
  } = useSWR(["admin", "leads"], async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const { data: privateNotes, error: notesError } = await supabase
      .from("admin_lead_notes")
      .select("lead_id,notes");
    if (notesError) throw notesError;
    const noteMap = new Map(privateNotes.map((note) => [note.lead_id, note.notes]));
    return data.map((lead) => ({
      ...lead,
      admin_notes: noteMap.get(lead.id) ?? null,
    })) as unknown as Lead[];
  });
  const leads = useMemo(() => leadData ?? [], [leadData]);
  const isLoading = loading && leadData === undefined;

  const spamIds = useMemo(
    () => leads.filter((l) => isQueryLead(l) && isSpamLead(l)).map((l) => l.id),
    [leads],
  );
  const spamSet = useMemo(() => new Set(spamIds), [spamIds]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (scope === "bookings" && !isKidsPickup(l)) return false;
      if (scope === "queries" && !isQueryLead(l)) return false;
      if (filter === "spam") {
        if (!spamSet.has(l.id)) return false;
      } else if (filter === "all") {
        if (spamSet.has(l.id)) return false;
      } else if (l.status !== filter || spamSet.has(l.id)) {
        return false;
      }
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.subject ?? "").toLowerCase().includes(q) ||
        (pickupCategory(l)?.name ?? "").toLowerCase().includes(q) ||
        pickupCondition(l).toLowerCase().includes(q) ||
        (l.message ?? "").toLowerCase().includes(q) ||
        (l.notes ?? "").toLowerCase().includes(q) ||
        (l.admin_notes ?? "").toLowerCase().includes(q) ||
        (l.locality ?? "").toLowerCase().includes(q) ||
        (l.pincode ?? "").includes(q)
      );
    });
  }, [leads, query, filter, spamSet, scope]);

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setDraftStatus(lead.status);
    setDraftNotes(lead.admin_notes ?? "");
  };

  const saveMutation = useCommand({
    execute: async () => {
      if (!selected) return;
      const { error } = await supabase.rpc("admin_update_lead", {
        p_lead_id: selected.id,
        p_status: draftStatus,
        p_notes: draftNotes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.refresh(["admin"]);
      toast.success("Lead updated.");
      setSelected(null);
    },
    onError: () => toast.error("Couldn't update the lead."),
  });

  const deleteMutation = useCommand({
    execute: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id).select("id").single();
      if (error) throw error;
    },
    onSuccess: () => {
      qc.refresh(["admin"]);
      toast.success("Lead deleted.");
      setSelected(null);
    },
    onError: () => toast.error("Couldn't delete the lead."),
  });

  const purgeSpam = useCommand({
    execute: async () => {
      if (!spamIds.length) return;
      const { error } = await supabase.from("leads").delete().in("id", spamIds);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.refresh(["admin", "leads"]);
      toast.success("Spam leads deleted.");
    },
    onError: () => toast.error("Couldn't delete spam leads."),
  });

  return (
    <div>
      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search seller, category, condition, area…"
            className="h-11 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-11 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
            <SelectItem value="spam">Suspected spam ({spamIds.length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {spamIds.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-secondary/40 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            {spamIds.length} bot-looking{" "}
            {spamIds.length === 1 ? "submission is" : "submissions are"} hidden from the main list.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="size-4" /> Delete all spam
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {spamIds.length} spam leads?</AlertDialogTitle>
                <AlertDialogDescription>
                  These look machine generated. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => purgeSpam.run()}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* list */}
      {loadError ? (
        <div role="alert" className="mt-4 rounded-2xl border border-destructive/30 bg-card p-5">
          <p className="text-sm">Could not load pickup requests. Please try again.</p>
          <Button variant="outline" className="mt-3" onClick={() => void reload()}>
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No matching requests yet.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {filtered.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{lead.name}</p>
                  <LeadTypeChip lead={lead} />
                  <StatusChip status={lead.status} />
                  {lead.has_photo && (
                    <Camera
                      className="size-3.5 shrink-0 text-primary"
                      aria-label="Photo attached"
                    />
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {isQueryLead(lead)
                    ? `${lead.email ?? lead.phone} - ${lead.subject ?? "Contact query"}`
                    : `${lead.pickup_id ?? lead.phone} - ${lead.subject ?? pickupCategory(lead)?.name ?? lead.vehicle_type} - ${lead.preferred_date ?? "no date"}`}
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="size-9 shrink-0 rounded-full"
                onClick={() => openLead(lead)}
                aria-label={`View ${lead.name}'s booking`}
              >
                <Eye className="size-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* compact lead modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[88dvh] w-[calc(100vw-2rem)] max-w-[22rem] gap-0 overflow-hidden rounded-3xl border-0 p-0 sm:max-w-sm">
          <AnimatePresence>
            {selected && (
              <div className="flex max-h-[88dvh] flex-col">
                <DialogHeader className="shrink-0 bg-gradient-brand px-4 pb-4 pt-5 text-left text-primary-foreground sm:px-5 sm:pb-5 sm:pt-6">
                  <div className="flex items-center gap-2 pr-8">
                    <DialogTitle className="text-base sm:text-lg">{selected.name}</DialogTitle>
                    <LeadTypeChip lead={selected} />
                  </div>
                  <p className="text-xs text-primary-foreground/80 sm:text-sm">
                    {isQueryLead(selected) ? (selected.email ?? selected.phone) : selected.phone}
                  </p>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:space-y-4 sm:px-5 sm:py-5">
                  <div className="grid gap-2 text-sm sm:gap-2.5">
                    {isQueryLead(selected) ? (
                      <>
                        <Row
                          icon={Boxes}
                          label="Contact query"
                          sub={selected.subject ?? undefined}
                        />
                        <Row icon={Mail} label={selected.email ?? "No email"} />
                        <Row icon={Phone} label={selected.phone} />
                        <Row
                          icon={MessageSquareText}
                          label={selected.subject ?? "No subject"}
                          sub={selected.notes ?? undefined}
                        />
                      </>
                    ) : (
                      <>
                        {selected.pickup_id && (
                          <Row icon={Boxes} label="Pickup ID" sub={selected.pickup_id} />
                        )}
                        <Row
                          icon={Boxes}
                          label="Category"
                          sub={pickupCategory(selected)?.name ?? selected.vehicle_type}
                        />
                        <Row icon={Boxes} label="Condition" sub={pickupCondition(selected)} />
                        {selected.message && (
                          <Row
                            icon={MessageSquareText}
                            label="Seller notes"
                            sub={selected.message}
                          />
                        )}
                        <Row
                          icon={MapPin}
                          label={`${selected.locality ?? "-"} ${selected.pincode ?? ""}`}
                          sub={selected.address ?? undefined}
                        />
                        <Row
                          icon={Calendar}
                          label={`${selected.preferred_date ?? "No date"}`}
                          sub={selected.slot ?? undefined}
                        />
                        <Row icon={Phone} label={selected.phone} />
                      </>
                    )}
                    {selected.photo_url && (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Camera className="size-4 text-primary" /> Uploaded photo
                        </p>
                        <PrivatePickupPhoto value={selected.photo_url} />
                      </div>
                    )}
                    {selected.lat != null && selected.lng != null && (
                      <a
                        href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-4" /> Open pinned location
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={draftStatus} onValueChange={setDraftStatus}>
                      <SelectTrigger className="h-10 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Private admin notes</Label>
                    <Textarea
                      rows={3}
                      placeholder="Internal notes about this pickup…"
                      className="min-h-20 rounded-2xl"
                      value={draftNotes}
                      maxLength={5000}
                      onChange={(e) => setDraftNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="hero"
                      className="h-10 flex-1 rounded-2xl"
                      onClick={() => saveMutation.run()}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10 shrink-0 rounded-2xl text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes {selected.name}'s booking. This can't be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteMutation.run(selected.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ icon: Icon, label, sub }: { icon: LucideIcon; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
