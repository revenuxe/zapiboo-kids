"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleIcon } from "@/components/GoogleIcon";
import { listingAuthReturn } from "@/lib/listing-auth";
import logoAsset from "@/assets/zapiboo-brand.webp";
const logo = logoAsset.src;

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);

export default function AuthPage({
  redirectPath,
  explicitRedirect = false,
}: {
  redirectPath: string;
  explicitRedirect?: boolean;
}) {
  const router = useRouter();
  const [destination, setDestination] = useState(redirectPath);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`
      : undefined;

  useEffect(() => {
    if (!getSupabaseConfig()) return;
    const target = explicitRedirect ? redirectPath : listingAuthReturn() || redirectPath;
    setDestination(target);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(target);
    });
  }, [router, redirectPath, explicitRedirect]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getSupabaseConfig())
      return toast.error("Sign-in is temporarily unavailable. Please try again later.");
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    if (!password) return toast.error("Enter your password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: em.data, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    router.replace(explicitRedirect ? destination : listingAuthReturn() || destination);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getSupabaseConfig())
      return toast.error("Sign-in is temporarily unavailable. Please try again later.");
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    const nm = nameSchema.safeParse(name);
    if (!nm.success) return toast.error(nm.error.issues[0].message);
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) return toast.error(pw.error.issues[0].message);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: em.data,
      password: pw.data,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: nm.data, phone: phone.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) {
      setNotice("Check your email to confirm your account. Open the link in this browser to continue your saved listing.");
      return;
    }
    toast.success("Account created! You're all set.");
    router.replace(explicitRedirect ? destination : listingAuthReturn() || destination);
  };

  const signInWithGoogle = async () => {
    if (!getSupabaseConfig())
      return toast.error("Sign-in is temporarily unavailable. Please try again later.");
    if (!redirectTo)
      return toast.error(
        "Couldn't prepare the Google sign-in redirect. Please refresh and try again.",
      );
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
    <div className="auth-page">
      <aside className="auth-story">
        <span className="auth-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Good vehicles.<br />Great connections.<br /><em>Your next move.</em></h1>
        <p>A simpler way to buy and sell pre-owned vehicles in Bangalore. Make it happen with Zapiboo.</p>
        <div className="auth-story-points">
          {["List your vehicle in a few simple steps", "Keep your favourites in one place", "Talk to buyers directly in Chats"].map(text => <span key={text}><Check size={17} />{text}</span>)}
        </div>
        <img className="auth-vehicle" src="/vehicles/used-cars-cutout.webp" alt="" />
        <span className="auth-story-caption">A NEW ROAD AHEAD.</span>
      </aside>
      <div className="auth-panel">
        <div className="mb-2 flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="Zapiboo"
              width={944}
              height={272}
              className="h-10 w-24 shrink-0 rounded-lg bg-background p-1 object-contain"
            />
            <div className="min-w-0">
              <p className="text-sm font-extrabold leading-tight">Zapiboo</p>
              <p className="truncate text-xs text-navy-foreground/65">
                Used Vehicle Selling | Bangalore
              </p>
            </div>
          </Link>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href={destination.startsWith("/marketplace/sell") ? destination : "/marketplace"}>
              <ArrowLeft /> Back
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="auth-card"
          >
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {destination.startsWith("/marketplace/sell") ? "YOUR LISTING IS SAVED" : "WELCOME TO ZAPIBOO"}
              </p>
              <h1 className="mt-0.5 whitespace-nowrap text-[22px] font-extrabold leading-tight sm:text-2xl">
                {tab === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tab === "signin"
                  ? destination.startsWith("/marketplace/sell") ? "Sign in, confirm your contact details, then publish." : "Your account. Your vehicles. Your next chapter."
                  : "Make your next move with Zapiboo."}
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

              <TabsContent value="signin" className="mt-3">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-2 h-11 w-full justify-start rounded-xl px-3 text-sm"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  <span className="grid size-6 shrink-0 place-items-center">
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <GoogleIcon className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-left font-semibold">{googleLabel}</span>
                  {!busy && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary max-[420px]:hidden">
                      Recommended
                    </span>
                  )}
                </Button>
                <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signIn} className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="si-email">Email</Label>
                    <Input
                      id="si-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="si-pw">Password</Label>
                    <Input
                      id="si-pw"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-10 w-full rounded-xl text-sm"
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-3">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-2 h-11 w-full justify-start rounded-xl px-3 text-sm"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  <span className="grid size-6 shrink-0 place-items-center">
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <GoogleIcon className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-left font-semibold">{googleLabel}</span>
                  {!busy && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary max-[420px]:hidden">
                      Recommended
                    </span>
                  )}
                </Button>
                <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signUp} className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input
                      id="su-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="su-phone">Phone (WhatsApp)</Label>
                    <Input
                      id="su-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="su-email">Email</Label>
                    <Input
                      id="su-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="su-pw">Password</Label>
                    <Input
                      id="su-pw"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-10 rounded-xl bg-background px-3"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-10 w-full rounded-xl text-sm"
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {notice && <p className="mp-auth-notice" role="status">{notice}</p>}
            <div className="auth-privacy"><ShieldCheck size={17} />Your mobile stays private. Connect through Chats.</div>
            <p className="auth-terms">
              By continuing you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
