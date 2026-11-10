"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { PageLoader } from "@/components/PageLoader";
import { LeadsPanel } from "@/components/admin/LeadsPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { servicesPaused } from "@/lib/launch-status";
import { SellingOverview } from "@/components/admin/SellingOverview";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";

export default function AdminDashboard() {
  const router = useRouter();
  const qc = useDataCache();
  const [refreshing, setRefreshing] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [authAttempt, setAuthAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setAuthError(false);
    setChecking(true);
    (async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) {
          router.replace("/admin/login");
          return;
        }
        const { data: role, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (error) throw error;
        if (!role) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }
        if (active) setChecking(false);
      } catch {
        if (active) {
          setAuthError(true);
          setChecking(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [router, authAttempt]);
  const signOut = async () => {
    await qc.clear();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (authError)
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Could not verify admin access</h1>
        <p className="mt-3 text-muted-foreground">Check your connection and try again.</p>
        <Button className="mt-6" onClick={() => setAuthAttempt((value) => value + 1)}>
          Try again
        </Button>
      </main>
    );

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PageLoader label="Opening dashboard" />
      </div>
    );
  }

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
              Every request.
              <br className="sm:hidden" /> One clear view.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage kids-item pickup requests, seller details and customer enquiries.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await qc.refresh(["admin"]);
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
          {servicesPaused
            ? "Pickup bookings paused - sellers can save their progress"
            : "Pickup bookings open"}
        </p>
        <SellingOverview />
        <Tabs defaultValue="bookings" className="admin-tabs mt-6">
          <TabsList className="flex w-full max-w-full flex-nowrap justify-start gap-1 overflow-x-auto p-1 sm:w-auto">
            <TabsTrigger value="bookings" className="gap-1.5">
              <LayoutDashboard className="size-4" /> <span>Pickups</span>
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>

            <TabsTrigger value="leads" className="gap-1.5">
              <Inbox className="size-4" /> <span>Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="size-4" /> <span>Sellers</span>
            </TabsTrigger>
          </TabsList>

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
