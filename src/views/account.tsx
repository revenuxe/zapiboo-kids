"use client";
import { HeadingText } from "@/components/HeadingText";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { displayName } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/PageLoader";

export default function AccountPage({ initialUser }: { initialUser: User }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => (data.user ? setUser(data.user) : router.push("/auth")));
  }, [router]);
  if (!user) return <PageLoader label="Loading your account" />;
  return (
    <main className="bg-secondary/30">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
              <UserIcon className="size-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <HeadingText>{displayName(user)}</HeadingText>
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </div>
    </main>
  );
}
