"use client";
import { HeadingText } from "@/components/HeadingText";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSWRConfig } from "swr";
import { ListingsPanel } from "@/components/admin/ListingsPanel";
import { useDataCache } from "@/hooks/use-data-cache";
import {
  LogOut,
  LayoutDashboard,
  Inbox,
  Users,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";

const LeadsPanel = dynamic(() => import("@/components/admin/LeadsPanel").then(module => module.LeadsPanel));
const UsersPanel = dynamic(() => import("@/components/admin/UsersPanel").then(module => module.UsersPanel));
import { servicesPaused } from "@/lib/launch-status";

const CategoriesPanel = dynamic(() => import("@/components/admin/CategoriesPanel").then(module => module.CategoriesPanel));

export default function AdminDashboard() {
  const router = useRouter();
  const qc = useDataCache();
  const [refreshing, setRefreshing] = useState(false);
  const { mutate } = useSWRConfig();
  const signOut = async () => {
    await qc.clear();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="admin-studio min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                View website
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="admin-heading">
          <div>
            <span className="admin-eyebrow">
              <ShieldCheck size={14} /> ZAPIBOO OPERATIONS
            </span>
            <h1>
              <HeadingText>
                Every listing.
                <br className="sm:hidden" /> One clear view.
              </HeadingText>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Approve marketplace listings, review photos and help sellers get live.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await Promise.all([qc.refresh(["admin"]), mutate(key => typeof key === "string" && key.startsWith("/api/admin/listings"))]);
              } finally {
                setRefreshing(false);
              }
            }}
          >
            <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />
            Refresh dashboard
          </Button>
        </div>

        <p className="mb-5 mt-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {servicesPaused ? "Service enquiries paused" : "Service enquiries open"}
        </p>

        <Tabs defaultValue="listings" className="admin-tabs mt-6">
          <TabsList className="flex w-full max-w-full flex-nowrap justify-start gap-1 overflow-x-auto p-1 sm:w-auto">
            <TabsTrigger value="listings" className="gap-1.5"><ShieldCheck className="size-4"/>Listings & approvals</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5">
              <LayoutDashboard className="size-4" /> <span>Past requests</span>
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>

            <TabsTrigger value="leads" className="gap-1.5">
              <Inbox className="size-4" /> <span>Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="size-4" /> <span>Customers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-5"><ListingsPanel/></TabsContent>
          <TabsContent value="bookings" className="mt-5">
            <LeadsPanel scope="bookings" />
          </TabsContent>
          <TabsContent value="categories" className="mt-5">
            <CategoriesPanel />
          </TabsContent>

          <TabsContent value="leads" className="mt-5">
            <LeadsPanel scope="queries" />
          </TabsContent>
          <TabsContent value="users" className="mt-5">
            <UsersPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
