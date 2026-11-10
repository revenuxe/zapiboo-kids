"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleIcon } from "@/components/GoogleIcon";
import logoAsset from "@/assets/zapiboo-kids-logo.webp";
const logo = logoAsset.src;


const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);

export default function AuthPage({ redirectPath }: { redirectPath: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}` : undefined;

  useEffect(() => {
    if (!getSupabaseConfig()) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push(redirectPath);
    });
  }, [router, redirectPath]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getSupabaseConfig()) return toast.error("Sign-in is temporarily unavailable. Please try again later.");
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    if (!password) return toast.error("Enter your password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: em.data, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    router.push(redirectPath);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    const nm = nameSchema.safeParse(name);
    if (!nm.success) return toast.error(nm.error.issues[0].message);
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) return toast.error(pw.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: em.data,
      password: pw.data,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: nm.data, phone: phone.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! You're all set.");
    router.push(redirectPath);
  };

  const signInWithGoogle = async () => {
    if (!getSupabaseConfig()) return toast.error("Sign-in is temporarily unavailable. Please try again later.");
    if (!redirectTo) return toast.error("Couldn't prepare the Google sign-in redirect. Please refresh and try again.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, scopes: "email profile", queryParams: { prompt: "select_account" } },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
    }
  };

  const googleLabel = tab === "signin" ? "Sign in with Google" : "Sign up with Google";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-navy px-4 py-4 text-navy-foreground sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="Zapiboo" width={1774} height={887} className="h-10 w-24 shrink-0 rounded-lg bg-background p-1 object-contain" />
            <div className="min-w-0">
              <p className="text-sm font-extrabold leading-tight">Zapiboo</p>
              <p className="truncate text-xs text-navy-foreground/65">Pre-loved kids items | Bangalore</p>
            </div>
          </Link>
          <Button asChild variant="outlineLight" size="sm" className="shrink-0">
            <Link href="/">
              <ArrowLeft /> Back
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-3xl border border-white/15 bg-background p-4 text-foreground shadow-elevated sm:p-5"
          >
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Customer account
              </p>
              <h1 className="mt-1 text-2xl font-extrabold leading-tight">
                {tab === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === "signin"
                  ? "Sign in to manage your item pickup requests."
                  : "Save your details for selling and future pickups."}
              </p>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-muted p-1">
                <TabsTrigger value="signin" className="rounded-xl">
                  Sign in
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl">
                  Create account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-5">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-3 h-12 w-full justify-start rounded-xl px-3 text-sm"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  <span className="grid size-6 shrink-0 place-items-center">{busy ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-5" />}</span>
                  <span className="min-w-0 flex-1 text-left font-semibold">{googleLabel}</span>
                  {!busy && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary max-[420px]:hidden">Recommended</span>}
                </Button>
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-email">Email</Label>
                    <Input
                      id="si-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si-pw">Password</Label>
                    <Input
                      id="si-pw"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-11 w-full rounded-xl text-sm"
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-3 h-12 w-full justify-start rounded-xl px-3 text-sm"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  <span className="grid size-6 shrink-0 place-items-center">{busy ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-5" />}</span>
                  <span className="min-w-0 flex-1 text-left font-semibold">{googleLabel}</span>
                  {!busy && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary max-[420px]:hidden">Recommended</span>}
                </Button>
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input
                      id="su-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-phone">Phone (WhatsApp)</Label>
                    <Input
                      id="su-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">Email</Label>
                    <Input
                      id="su-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-pw">Password</Label>
                    <Input
                      id="su-pw"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-11 rounded-xl bg-background px-3"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-11 w-full rounded-xl text-sm"
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              By continuing you agree to Zapiboo's terms of service.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
