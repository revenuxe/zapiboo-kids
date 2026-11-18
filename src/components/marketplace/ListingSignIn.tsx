"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { GoogleIcon } from "@/components/GoogleIcon";

export function ListingSignIn({
  onBack,
  saveDraft,
  category,
}: {
  onBack: () => void;
  saveDraft: () => boolean;
  category?: string;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const redirectPath =
    "/marketplace/sell" + (category ? "?category=" + encodeURIComponent(category) : "");
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("authError") === "callback") {
      setError(
        "That sign-in link couldn't be completed. Your draft is saved. Please try signing in again.",
      );
      url.searchParams.delete("authError");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setNotice("");
    if (!getSupabaseConfig()) {
      setError("Sign-in is temporarily unavailable. Your listing draft is safe.");
      return;
    }
    if (!saveDraft()) {
      setError("We couldn't save your draft. Free some browser storage before continuing.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              window.location.origin + "/auth/callback?next=" + encodeURIComponent(redirectPath),
          },
        });
        if (error) throw error;
        if (!data.session)
          setNotice(
            "Check your email to confirm your account. Open the confirmation link in this browser to return to your saved listing, then add your name and mobile number.",
          );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    if (busy) return;
    setError("");
    if (!getSupabaseConfig()) {
      setError("Sign-in is temporarily unavailable.");
      return;
    }
    if (!saveDraft()) {
      setError("We couldn't save your draft. Free some browser storage before continuing.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            window.location.origin + "/auth/callback?next=" + encodeURIComponent(redirectPath),
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start Google sign-in.");
      setBusy(false);
    }
  }
  return (
    <section className="mp-form mp-listing-auth">
      <div className="mp-form-title">
        <span>STEP 4 OF 5 · YOUR ACCOUNT</span>
        <h2>
          One quick sign-in.
          <br />
          Then you&apos;re almost there.
        </h2>
        <p>
          Your vehicle details and photos are saved. Sign in, add your name and mobile number, then
          review your listing.
        </p>
      </div>
      <form onSubmit={submit}>
        <div className="mp-form-fields">
          <button
            type="button"
            className="mp-btn-secondary mp-google-button"
            onClick={google}
            disabled={busy}
          >
            <GoogleIcon className="size-5" />
            Continue with Google
          </button>
          <div className="mp-auth-divider">
            <span />
            or use your email
            <span />
          </div>
          <div className="mp-auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              onClick={() => {
                setMode("signin");
                setError("");
                setNotice("");
              }}
              disabled={busy}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setError("");
                setNotice("");
              }}
              disabled={busy}
            >
              Create account
            </button>
          </div>
          <label>
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={busy}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength={mode === "signup" ? 6 : 1}
              maxLength={72}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "signup" ? "Create a password (at least 6 characters)" : "Your password"
              }
              disabled={busy}
            />
          </label>
          {error && (
            <p className="mp-auth-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="mp-auth-notice" role="status">
              <Mail size={18} />
              {notice}
            </p>
          )}
          <div className="mp-info-box">
            <ShieldCheck size={20} />
            <p>
              Your phone number is not needed to sign in. After signing in, confirm your name and
              mobile number for your account. Buyers can message you in Chats; you can also opt in
              to share your number with signed-in buyers who choose Call Now.
            </p>
          </div>
        </div>
        <div className="mp-form-footer">
          <button type="button" className="mp-btn-secondary" onClick={onBack} disabled={busy}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button type="submit" className="mp-btn" disabled={busy}>
            {busy ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>
                {mode === "signup" ? "Create account" : "Sign in & continue"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
