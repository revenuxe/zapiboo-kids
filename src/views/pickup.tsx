"use client";
import { useSellingCategories } from "@/components/CatalogProvider";
import { ContactActions } from "@/components/ContactActions";

import { servicesPaused, showOpeningSoon } from "@/lib/launch-status";

import { OpeningSoonMessage } from "@/components/ServiceAvailability";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import {
  categoryImage,
  getSellingCategory,
  itemConditions,
  validateSellingItem,
  sellingItemPayload,
} from "@/lib/selling-categories";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  PartyPopper,
  Camera,
  X,
  MapPin,
  ShieldCheck,
  Wallet,
  Boxes,
  Info,
  Phone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLoader } from "@/components/PageLoader";
import { GoogleIcon } from "@/components/GoogleIcon";
import { supabase } from "@/integrations/supabase/client";
import { s3UploadsEnabled, uploadDataUrlToS3, uploadImageToS3 } from "@/lib/s3-upload";
import { compressImageToWebp } from "@/lib/client-image";
import { displayName, useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
type PickupSearch = {
  category?: string;
  pincode?: string;
  bookingAuth?: "1";
};

const pickupDraftKey = "zapiboo-kids-pickup-draft-v4";
const postAuthRedirectKey = "zapiboo-post-auth-redirect";
const pickupPhotoBucket = "pickup-photos";

// This version is small enough to store safely with a booking when external
// object storage is not configured, while still being clear for an evaluator.
function imageToDataUrl(file: File): Promise<string> {
  return compressImageToWebp(file, 960, 0.7);
}

type PickupPhoto = {
  id: string;
  previewUrl: string;
  file: File | null;
  uploadedUrl: string | null;
};

export default function Pickup({ pickupSearch }: { pickupSearch: PickupSearch }) {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const currentStepRef = useRef(step);
  currentStepRef.current = step;
  const [stepLoading, setStepLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Reset after the next step or confirmation has committed to the DOM.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step, submitted]);
  const [pickupId, setPickupId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const draftRestored = useRef(false);
  const flowHistoryReady = useRef(false);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "filled" | "missing">(
    "idle",
  );

  // Select a category, then condition, optional notes and a photo.

  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [photo, setPhoto] = useState<PickupPhoto | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoUploadPromiseRef = useRef<Promise<string> | null>(null);
  const photoUploadIdRef = useRef<string | null>(null);

  // step 4
  const [pincode, setPincode] = useState(pickupSearch.pincode ?? "");
  const [address, setAddress] = useState("");

  // step 3 auth gate
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // step 5
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const submissionInFlight = useRef(false);

  // Flow order: category, condition and optional notes/photo, sign in (if needed), pickup details.
  const progressSteps = servicesPaused
    ? user
      ? [1, 3, 5]
      : [1, 3, 4, 5]
    : user
      ? [1, 3, 5]
      : [1, 3, 4, 5];
  const currentProgress = Math.max(1, progressSteps.indexOf(step) + 1);

  const bookingRedirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/pickup?bookingAuth=1")}`
      : undefined;

  const catalog = useSellingCategories();
  const itemCategories = catalog.map((category) => ({
    ...category,
    image_url: category.image_url || categoryImage(category.id),
  }));
  useEffect(() => {
    if (hydrated && itemCategoryId && !catalog.some((category) => category.id === itemCategoryId)) {
      setItemCategoryId("");
      setStep(1);
      toast.info("That category is no longer available. Please choose another.");
    }
  }, [catalog, hydrated, itemCategoryId]);
  const selectedCategory = itemCategories.find((category) => category.id === itemCategoryId);
  const itemDetails = { category: itemCategoryId, condition, description };

  const uploadPickupPhoto = async (snapshot: PickupPhoto): Promise<string> => {
    if (!s3UploadsEnabled) {
      try {
        const response = await fetch(snapshot.previewUrl);
        const image = await response.blob();
        const ownerId = user?.id;
        if (!ownerId) throw new Error("Please sign in before uploading a photo.");

        const { error } = await supabase.storage
          .from(pickupPhotoBucket)
          .upload(`${ownerId}/${snapshot.id}.webp`, image, {
            contentType: "image/webp",
            upsert: false,
          });
        if (error) throw error;

        return `${pickupPhotoBucket}/${ownerId}/${snapshot.id}.webp`;
      } catch {
        // Keep a compressed fallback with the lead if storage is temporarily
        // unavailable, so the dashboard can still render the uploaded photo.
        return snapshot.previewUrl;
      }
    }

    try {
      if (snapshot.file) {
        return await uploadImageToS3(snapshot.file, "pickups", { maxDim: 1200, quality: 0.78 });
      }
      return await uploadDataUrlToS3(snapshot.previewUrl, "pickups");
    } catch (primaryError) {
      try {
        return await uploadDataUrlToS3(snapshot.previewUrl, "pickups");
      } catch {
        throw primaryError instanceof Error
          ? primaryError
          : new Error("Couldn't upload the photo. Please try again.");
      }
    }
  };

  const beginPhotoUpload = (snapshot: PickupPhoto, notify = false): Promise<string> => {
    if (snapshot.uploadedUrl) return Promise.resolve(snapshot.uploadedUrl);
    if (photoUploadPromiseRef.current && photoUploadIdRef.current === snapshot.id) {
      return photoUploadPromiseRef.current;
    }

    setPhotoUploading(true);
    photoUploadIdRef.current = snapshot.id;
    const promise = uploadPickupPhoto(snapshot)
      .then((url) => {
        setPhoto((current) =>
          current?.id === snapshot.id ? { ...current, uploadedUrl: url } : current,
        );
        if (notify) toast.success("Photo saved securely.");
        return url;
      })
      .catch((err) => {
        if (notify) toast.error(err instanceof Error ? err.message : "Couldn't upload the photo.");
        throw err;
      })
      .finally(() => {
        if (photoUploadPromiseRef.current === promise) {
          photoUploadPromiseRef.current = null;
          photoUploadIdRef.current = null;
          setPhotoUploading(false);
        }
      });
    photoUploadPromiseRef.current = promise;
    return promise;
  };

  const savePickupDraft = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      pickupDraftKey,
      JSON.stringify({
        step,
        flowVersion: 4,
        condition,
        description,
        itemCategoryId,
        pincode,
        address,
        name,
        phone,
        photo: photo
          ? { id: photo.id, previewUrl: photo.previewUrl, uploadedUrl: photo.uploadedUrl }
          : null,
      }),
    );
  };

  // Restore any in-progress booking draft once on mount. This keeps the whole
  // flow — including which step the user was on — intact across a full page
  // reload (returning from Google OAuth) or any remount triggered by an auth
  // state change, so signing in never bounces back to step 1.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (draftRestored.current) return;
    draftRestored.current = true;
    const rawDraft = window.sessionStorage.getItem(pickupDraftKey);
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as {
          step?: number;
          flowVersion?: number;
          condition?: string;
          description?: string;
          itemCategoryId?: string;
          pincode?: string;
          address?: string;
          name?: string;
          phone?: string;
          photo?: { id?: string; previewUrl?: string; uploadedUrl?: string | null } | null;
        };
        if (draft.condition) setCondition(draft.condition);
        if (draft.description) setDescription(draft.description);
        if (draft.itemCategoryId) setItemCategoryId(draft.itemCategoryId);
        if (draft.pincode) setPincode(draft.pincode);
        if (draft.address) setAddress(draft.address);
        if (draft.name) setName(draft.name);
        if (draft.phone) setPhone(draft.phone);
        if (draft.photo?.previewUrl) {
          setPhoto({
            id: draft.photo.id || crypto.randomUUID(),
            previewUrl: draft.photo.previewUrl,
            file: null,
            uploadedUrl: draft.photo.uploadedUrl ?? null,
          });
        }
        if (typeof draft.step === "number" && draft.step >= 1 && draft.step <= 6) {
          // Older drafts used step 6 for date/time selection. Resume them on
          // the new final details step instead of making people start over.
          setStep(Math.min(draft.step, 5));
        }
      } catch {
        window.sessionStorage.removeItem(pickupDraftKey);
      }
    }

    if (
      pickupSearch.category &&
      getSellingCategory(pickupSearch.category, itemCategories) &&
      new URLSearchParams(window.location.search).get("category") === pickupSearch.category
    ) {
      setItemCategoryId(pickupSearch.category);
      setCondition("");
      setDescription("");
      setStep(3);
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }
    if (pickupSearch.bookingAuth === "1") setStep(5);
    setHydrated(true);
    // Apply the landing-page handoff only when this booking flow mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard OAuth returns, old drafts and browser history during prelaunch.
  useEffect(() => {
    if (!servicesPaused || !user) return;
    // Keep prelaunch customers visible in the existing admin customer list,
    // without creating a pickup order or replacing an existing profile.
    const saveCustomer = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || data) return;
      const metadata = user.user_metadata as { phone?: string };
      const { error: saveError } = await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          full_name: displayName(user),
          whatsapp: metadata.phone ?? null,
        },
        { onConflict: "user_id", ignoreDuplicates: true },
      );
      if (saveError)
        toast.error(
          "Your account is saved, but we couldn't save your customer profile. Please try signing in again.",
        );
    };
    void saveCustomer();
  }, [user]);

  useEffect(() => {
    if (!servicesPaused || !hydrated || authLoading) return;
    if (step === 5 && !user) setStep(4);
  }, [hydrated, authLoading, step, user]);

  // Persist the draft on every meaningful change (once hydrated) so the flow
  // survives reloads/remounts and always resumes from the right step.
  useEffect(() => {
    if (!hydrated || submitted) return;
    savePickupDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hydrated,
    submitted,
    step,
    itemCategoryId,
    condition,
    description,
    pincode,
    address,
    name,
    phone,
    photo,
  ]);

  useEffect(() => {
    if (!hydrated || flowHistoryReady.current || typeof window === "undefined") return;
    flowHistoryReady.current = true;
    window.history.replaceState(
      { ...window.history.state, pickupFlow: true, pickupStep: currentStepRef.current },
      "",
      window.location.href,
    );
    const restoreStep = (event: PopStateEvent) => {
      const previousStep = event.state?.pickupFlow ? event.state.pickupStep : null;
      if (typeof previousStep === "number" && previousStep >= 1 && previousStep <= 5) {
        setStep(previousStep);
      }
    };
    window.addEventListener("popstate", restoreStep);
    return () => window.removeEventListener("popstate", restoreStep);
  }, [hydrated]);

  // Strip the bookingAuth flag out of the URL after returning from OAuth.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pickupSearch.bookingAuth !== "1") return;
    const params = new URLSearchParams(window.location.search);
    params.delete("bookingAuth");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [pickupSearch.bookingAuth]);

  useEffect(() => {
    if (!user) return;

    if (step === 4) setStep(5);
    if (!authEmail && user.email) setAuthEmail(user.email);
    if (!name) setName(displayName(user));

    const meta = user.user_metadata as { phone?: string; full_name?: string } | undefined;
    if (!phone && meta?.phone) setPhone(meta.phone);
    if (!authName && meta?.full_name) setAuthName(meta.full_name);
    if (!authPhone && meta?.phone) setAuthPhone(meta.phone);

    let ignore = false;
    setProfileStatus((s) => (s === "idle" ? "loading" : s));
    supabase
      .from("user_profiles")
      .select("full_name, whatsapp, address, pincode, lat, lng")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (ignore) return;
        if (error || !data) {
          setProfileStatus((s) => (s === "filled" ? s : "missing"));
          return;
        }
        if (!name && data.full_name) setName(data.full_name);
        if (!phone && data.whatsapp) setPhone(data.whatsapp);
        if (!address && data.address) setAddress(data.address);
        if (!pincode && data.pincode) setPincode(data.pincode);
        const hasSaved = Boolean(data.address?.trim()) && Boolean(data.pincode?.trim());
        setProfileStatus(hasSaved ? "filled" : "missing");
      });

    return () => {
      ignore = true;
    };
  }, [address, authEmail, authName, authPhone, name, phone, pincode, step, user]);

  const signInDuringBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getSupabaseConfig())
      return toast.error(
        "Sign-in is not configured yet. Please try again once the service is available.",
      );
    if (!authEmail.trim()) return toast.error("Enter your email.");
    if (!authPassword) return toast.error("Enter your password.");

    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });
    setAuthBusy(false);
    if (error) return toast.error(error.message);
    toast.success(
      servicesPaused ? "Signed in successfully." : "Signed in. Your saved address is filled in.",
    );
    setStep(5);
  };

  const signInWithGoogleDuringBooking = async () => {
    if (!getSupabaseConfig())
      return toast.error(
        "Sign-in is not configured yet. Please try again once the service is available.",
      );
    savePickupDraft();
    if (!bookingRedirectTo)
      return toast.error(
        "Couldn't prepare the Google sign-in redirect. Please refresh and try again.",
      );
    window.sessionStorage.setItem(postAuthRedirectKey, "/pickup?bookingAuth=1");
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: bookingRedirectTo,
        scopes: "email profile",
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setAuthBusy(false);
      toast.error(error.message);
    }
  };

  const signUpDuringBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getSupabaseConfig())
      return toast.error(
        "Sign-in is not configured yet. Please try again once the service is available.",
      );
    if (authName.trim().length < 2) return toast.error("Enter your name.");
    if (authPhone.trim().length < 10) return toast.error("Enter a valid WhatsApp number.");
    if (!authEmail.trim()) return toast.error("Enter your email.");
    if (authPassword.length < 6) return toast.error("Password must be at least 6 characters.");

    savePickupDraft();
    window.sessionStorage.setItem(postAuthRedirectKey, "/pickup?bookingAuth=1");
    setAuthBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
      options: {
        emailRedirectTo: bookingRedirectTo,
        data: { full_name: authName.trim(), phone: authPhone.trim() },
      },
    });
    setAuthBusy(false);
    if (error) return toast.error(error.message);

    setName(authName.trim());
    setPhone(authPhone.trim());
    if (data.session) {
      toast.success(
        servicesPaused
          ? "Account created successfully."
          : "Account created. Let's add your pickup address.",
      );
      setStep(5);
    } else {
      toast.success("Account created. Please verify your email, then sign in here.");
      setAuthTab("signin");
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    try {
      const previewUrl = await imageToDataUrl(file);
      const nextPhoto: PickupPhoto = {
        id: crypto.randomUUID(),
        previewUrl,
        file,
        uploadedUrl: null,
      };
      setPhoto(nextPhoto);
      if (!s3UploadsEnabled) return;
      beginPhotoUpload(nextPhoto, true).catch(() => {
        // The booking submit path retries and blocks if the early upload fails.
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't process the photo.");
    }
  };

  const pincodeOk = /^\d{6}$/.test(pincode);
  const pincodeBad = false;
  const addressOk = address.trim().length >= 10;
  const addressTooShort = address.trim().length > 0 && !addressOk;
  const addressStepReady = pincodeOk && addressOk;

  const moveToStep = (nextStep: number) => {
    setStepLoading(true);
    window.requestAnimationFrame(() => {
      window.history.pushState(
        { ...window.history.state, pickupFlow: true, pickupStep: nextStep },
        "",
        window.location.href,
      );
      setStep(nextStep);
      window.setTimeout(() => setStepLoading(false), 220);
    });
  };

  const goNext = () => {
    if (step === 1) {
      if (!selectedCategory) return toast.error("Choose what you want to sell.");
    }
    if (step === 3) {
      const error = validateSellingItem(itemDetails, itemCategories);
      if (error) return toast.error(error);
    }
    if (step === 5) {
      if (!pincode.trim()) return toast.error("Add your Bengaluru pincode.");
      if (pincode.length !== 6) return toast.error("Pincode must be 6 digits.");
      if (!address.trim()) return toast.error("Add your flat / house address.");
      if (!addressOk)
        return toast.error("Address looks too short — add your flat, street and a landmark.");
    }
    if (step === 1) {
      moveToStep(3);
    } else if (step === 3) {
      moveToStep(user ? 5 : 4);
    }
  };

  const goBack = () => {
    setStep((s) => {
      if (s === 5) return user ? 3 : 4;
      if (s === 4) return 3;
      if (s === 3) return 1;
      return 1;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (servicesPaused) {
      showOpeningSoon();
      return;
    }
    if (!user) {
      toast.error("Please sign in before confirming your pickup.");
      setStep(4);
      return;
    }
    if (!pincodeOk || !addressOk) {
      setStep(5);
      return toast.error("Please complete your pickup address and a serviceable pincode.");
    }
    if (!name.trim() || phone.trim().length < 10)
      return toast.error("Add your name and a valid phone number.");

    const itemError = validateSellingItem(itemDetails, itemCategories);
    if (itemError) {
      setStep(3);
      return toast.error(itemError);
    }
    if (submissionInFlight.current) return;
    submissionInFlight.current = true;
    setSaving(true);
    try {
      // Prefer an object-storage URL where configured. Otherwise retain the
      // compressed WebP data URL with the booking for the admin order view.
      let photoUrl: string | null = null;
      if (photo) {
        try {
          photoUrl = (photo.uploadedUrl ?? (await beginPhotoUpload(photo))) || null;
        } catch {
          // Photo storage is optional — never block the booking on it.
          photoUrl = null;
        }
      }

      const { data: savedPickup, error } = await supabase
        .from("leads")
        .insert({
          // Set ownership explicitly so the customer's row-level permissions apply
          // immediately, including on Supabase projects with older trigger state.
          user_id: user.id,
          ...sellingItemPayload(itemDetails, itemCategories),
          has_photo: !!photoUrl,
          photo_url: photoUrl,
          locality: null,
          pincode,
          address: address.trim(),
          name: name.trim(),
          phone: phone.trim(),
          preferred_date: null,
          slot: null,
          lat: null,
          lng: null,
          status: "new",
        })
        .select("pickup_id")
        .single();

      if (error) {
        toast.error("Couldn't save your booking. Please try again.");
        return;
      }
      try {
        const { error: profileError } = await supabase.from("user_profiles").upsert(
          {
            user_id: user.id,
            full_name: name.trim(),
            whatsapp: phone.trim(),
            address: address.trim(),
            pincode,
            lat: null,
            lng: null,
          },
          { onConflict: "user_id" },
        );
        if (profileError) {
          toast.warning("Pickup saved, but we couldn't save these details for next time.");
        }
      } catch {
        toast.warning("Pickup saved, but your profile could not be updated for next time.");
      }
      try {
        window.sessionStorage.removeItem(pickupDraftKey);
      } catch {
        /* Pickup is already saved. */
      }
      toast.success("Pickup request received. Our team will confirm the next steps.");
      setPickupId(savedPickup?.pickup_id ?? null);
      setSubmitted(true);
    } catch {
      toast.error("Connection interrupted. Your details are saved here; please try again.");
    } finally {
      submissionInFlight.current = false;
      setSaving(false);
    }
  };

  if (!hydrated)
    return (
      <section className="pickup-studio">
        <div className="pickup-studio-shell">
          <h1 className="pickup-kicker">Sell your kids items</h1>
          <div className="pickup-loading">
            <PageLoader label="Preparing your selling form..." full={false} />
          </div>
          <noscript>
            <style>{".pickup-loading { display: none; }"}</style>
            <p className="mt-5 text-sm">
              Enable JavaScript to use the selling form. You can still explore our item categories
              and preparation guides.
            </p>
            <Link href="/#sell-categories" className="mt-5 inline-flex font-semibold text-primary">
              Explore selling categories
            </Link>
          </noscript>
        </div>
      </section>
    );

  if (submitted) {
    return (
      <section className="relative overflow-hidden bg-gradient-navy py-24 text-navy-foreground">
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green"
          >
            <PartyPopper className="size-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-3xl font-bold sm:text-4xl"
          >
            Thank you, {name.split(" ")[0] || "friend"}!
          </motion.h1>
          <p className="mt-4 text-navy-foreground/80">
            Your pickup request has been received. Our team will review your item details and
            confirm availability and the next steps on WhatsApp.
          </p>
          {pickupId && (
            <p className="mx-auto mt-5 w-fit rounded-full bg-navy-foreground/10 px-4 py-2 text-xs font-bold tracking-wider text-navy-foreground">
              Pickup ID: {pickupId}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-8 max-w-md rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 text-left"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              What happens next
            </p>
            <ol className="mt-4 space-y-3 text-sm text-navy-foreground/80">
              <li className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <span>We confirm a convenient pickup time with you on WhatsApp.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span>Our team reviews your items and confirms handover arrangements.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span>You review the sale and payment details before deciding to proceed.</span>
              </li>
            </ol>
          </motion.div>

          <div className="mt-8 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-5 text-left text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-brand-green" /> Bengaluru {pincode}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Phone className="size-4 text-brand-green" /> {phone}
            </p>
          </div>
          <ContactActions
            dark
            message={`Hi Zapiboo, I have submitted pickup request ${pickupId ?? ""} for ${selectedCategory?.name ?? "kids items"}. Please help confirm the pickup details.`}
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
              }}
            >
              Sell more items
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link href="/orders">View pickup orders</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pickup-studio">
        <div className="pickup-studio-shell">
          <div className="pickup-workspace">
            <div className="pickup-workspace-heading">
              <h1 className="pickup-kicker">SELL YOUR KIDS ITEMS</h1>
              <span className="pickup-step-count">
                STEP {currentProgress} OF {progressSteps.length}
              </span>
            </div>

            <nav className="pickup-progress" aria-label="Pickup progress">
              <ol>
                {progressSteps.map((stepNumber, index) => {
                  const labels: Record<number, string> = {
                    1: "Category",
                    3: "Item details",
                    4: "Your account",
                    5: servicesPaused ? "Next steps" : "Your details",
                  };
                  const complete = currentProgress > index + 1;
                  return (
                    <li
                      key={stepNumber}
                      className={cn(
                        complete && "is-complete",
                        currentProgress === index + 1 && "is-current",
                      )}
                      aria-current={currentProgress === index + 1 ? "step" : undefined}
                    >
                      <span className="pickup-progress-dot">
                        {complete ? <Check size={13} /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{labels[stepNumber]}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="pickup-form-panel relative">
              {stepLoading && (
                <div className="absolute inset-0 z-20 grid place-items-center rounded-3xl bg-background/75 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-soft">
                    <Loader2 className="size-4 animate-spin text-primary" /> Preparing next step
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="text-xl font-bold">What are you selling?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose a category, add the condition and a photo if you like, then continue.
                    </p>

                    <div className="pickup-choices">
                      {itemCategories.map((category) => {
                        const active = itemCategoryId === category.id;
                        return (
                          <button
                            type="button"
                            key={category.id}
                            style={{ backgroundColor: category.accent_color }}
                            aria-pressed={active}
                            data-category={category.id}
                            onClick={() => {
                              if (category.id === itemCategoryId) return;
                              setPhoto(null);
                              setItemCategoryId(category.id);
                              setCondition("");
                              setDescription("");
                            }}
                            className={cn(
                              "pickup-choice relative overflow-hidden text-left transition-all",
                              active
                                ? "border-primary bg-primary/10 shadow-soft"
                                : "border-border hover:border-primary/40",
                            )}
                          >
                            <span className="pickup-choice-check">
                              {active ? <Check size={14} /> : <ArrowRight size={14} />}
                            </span>
                            <div className="pickup-choice-image">
                              <img
                                src={category.image_url}
                                alt=""
                                width={420}
                                height={420}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div
                              className={cn(
                                "mt-1 text-center text-base font-bold sm:mt-2 sm:text-lg",
                                category.name.length > 12 && "tracking-tight",
                              )}
                            >
                              {category.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div
                    key="s3-photo"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <h2 className="text-xl font-bold">Condition &amp; photo</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedCategory?.name} selected. Add the condition and anything we should
                      know before pickup.
                    </p>
                    <div className="mt-5 space-y-5">
                      <div>
                        <Label htmlFor="item-condition">Condition *</Label>
                        <Select value={condition} onValueChange={setCondition}>
                          <SelectTrigger id="item-condition" className="mt-2">
                            <SelectValue placeholder="Choose condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemConditions.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="item-description">Anything else? (optional)</Label>
                        <Textarea
                          id="item-description"
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          maxLength={1000}
                          rows={4}
                          placeholder="Anything we should know: wear, missing parts, size or items in a bundle"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <h3 className="mt-8 font-bold">
                      Add a photo{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      A clear photo helps our team review the condition and prepare for pickup.
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      aria-label="Add a photo"
                      className="hidden"
                      onChange={onPhoto}
                    />
                    {photo ? (
                      <div className="mt-5 relative w-fit">
                        <img
                          src={photo.previewUrl}
                          alt="Your items"
                          className="size-40 rounded-2xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-foreground text-background"
                          aria-label="Remove photo"
                        >
                          <X className="size-4" />
                        </button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {photoUploading ? "Saving photo…" : "Photo ready to attach."}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="pickup-photo-drop"
                      >
                        <span className="pickup-photo-icon">
                          <Camera size={25} strokeWidth={1.5} />
                        </span>
                        <strong>Take or upload a photo</strong>
                        <span>One clear photo is a lovely start</span>
                      </button>
                    )}
                  </motion.div>
                )}

                {/* STEP 5 */}
                {step === 5 && servicesPaused && (
                  <div className="py-4">
                    <OpeningSoonMessage saved={!!user} />
                    <Button asChild variant="outline" className="mt-6 w-full">
                      <Link href="/">Back to home</Link>
                    </Button>
                  </div>
                )}
                {step === 5 && !servicesPaused && (
                  <motion.form
                    key="s5-address"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="text-xl font-bold">Where should we pick up?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Share your address and WhatsApp number. We’ll confirm a convenient time with you.
                    </p>

                    {user && profileStatus === "loading" && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading your saved address…
                      </div>
                    )}
                    {user && profileStatus === "filled" && addressStepReady && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        <span>Auto-filled from your account. Edit anything that changed.</span>
                      </div>
                    )}
                    {user && profileStatus === "missing" && !addressStepReady && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">
                        <Info className="mt-0.5 size-4 shrink-0" />
                        <span>
                          No saved address on your account yet — add it below and we'll remember it
                          for your next pickup.
                        </span>
                      </div>
                    )}

                    <div className="mt-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="pin">Pincode</Label>
                        <Input
                          id="pin"
                          inputMode="numeric"
                          maxLength={6}
                          className="h-11"
                          placeholder="6-digit pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                          aria-invalid={pincodeBad}
                        />
                        {pincodeOk && (
                          <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                            <CheckCircle2 className="size-4" /> Great — we provide doorstep pickup
                            across Bengaluru.
                          </p>
                        )}
                        {pincode.length > 0 && pincode.length < 6 && (
                          <p className="text-sm text-muted-foreground">
                            {6 - pincode.length} more digit{6 - pincode.length > 1 ? "s" : ""} to
                            go.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addr">Flat / house & landmark</Label>
                        <Textarea
                          id="addr"
                          rows={3}
                          placeholder="e.g. #12, 3rd Cross, near Forum Mall"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          aria-invalid={addressTooShort}
                        />
                        {addressTooShort && (
                          <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                            <Info className="size-4" /> Add a bit more detail — flat/house number,
                            street and a landmark.
                          </p>
                        )}
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nm">Your name</Label>
                          <Input id="nm" className="h-11" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ph">WhatsApp number</Label>
                          <Input id="ph" type="tel" inputMode="numeric" className="h-11" placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" variant="hero" size="xl" className="mt-8 w-full" disabled={saving}>
                      {saving ? "Sending request…" : "Request pickup"}
                      {!saving && <ArrowRight />}
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">Free to request · We’ll confirm the pickup details on WhatsApp.</p>
                  </motion.form>
                )}

                {/* STEP 3 */}
                {step === 4 && (
                  <motion.div
                    key="s3-auth"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                        Customer account
                      </p>
                      <h2 className="mt-1 text-2xl font-extrabold leading-tight">
                        {authTab === "signin" ? "Sign in to continue" : "Create your account"}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Create an account so your details are ready when pickups open.
                      </p>
                    </div>

                    {authLoading ? (
                      <div className="flex items-center justify-center rounded-2xl border border-border bg-background py-10">
                        <Loader2 className="size-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border bg-background p-3 shadow-soft sm:p-4">
                        <Button
                          type="button"
                          variant="google"
                          size="lg"
                          className="mb-3 h-12 w-full justify-start rounded-xl px-3 text-sm"
                          disabled={authBusy}
                          onClick={signInWithGoogleDuringBooking}
                        >
                          <span className="grid size-6 shrink-0 place-items-center">
                            {authBusy ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-5" />}
                          </span>
                          <span className="min-w-0 flex-1 text-left font-semibold">Continue with Google</span>
                          {!authBusy && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary max-[420px]:hidden">
                              Recommended
                            </span>
                          )}
                        </Button>
                        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="h-px flex-1 bg-border" />
                          or
                          <span className="h-px flex-1 bg-border" />
                        </div>

                        <Tabs
                          value={authTab}
                          onValueChange={(v) => setAuthTab(v as "signin" | "signup")}
                        >
                          <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-muted p-1">
                            <TabsTrigger value="signin" className="rounded-xl">
                              Sign in
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-xl">
                              Create account
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="signin" className="mt-4">
                            <form onSubmit={signInDuringBooking} className="space-y-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-si-email">Email</Label>
                                <Input
                                  id="booking-si-email"
                                  type="email"
                                  autoComplete="email"
                                  value={authEmail}
                                  onChange={(e) => setAuthEmail(e.target.value)}
                                  placeholder="you@example.com"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-si-password">Password</Label>
                                <Input
                                  id="booking-si-password"
                                  type="password"
                                  autoComplete="current-password"
                                  value={authPassword}
                                  onChange={(e) => setAuthPassword(e.target.value)}
                                  placeholder="Password"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                              <Button
                                type="submit"
                                variant="hero"
                                size="lg"
                                className="h-11 w-full rounded-xl text-sm"
                                disabled={authBusy}
                              >
                                {authBusy ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  "Sign in and continue"
                                )}
                              </Button>
                            </form>
                          </TabsContent>

                          <TabsContent value="signup" className="mt-4">
                            <form onSubmit={signUpDuringBooking} className="space-y-3">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                  <Label htmlFor="booking-su-name">Full name</Label>
                                  <Input
                                    id="booking-su-name"
                                    value={authName}
                                    onChange={(e) => setAuthName(e.target.value)}
                                    placeholder="Your name"
                                    className="h-11 rounded-xl bg-background px-3"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="booking-su-phone">WhatsApp</Label>
                                  <Input
                                    id="booking-su-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={authPhone}
                                    onChange={(e) =>
                                      setAuthPhone(e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="10-digit mobile"
                                    className="h-11 rounded-xl bg-background px-3"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-su-email">Email</Label>
                                <Input
                                  id="booking-su-email"
                                  type="email"
                                  autoComplete="email"
                                  value={authEmail}
                                  onChange={(e) => setAuthEmail(e.target.value)}
                                  placeholder="you@example.com"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-su-password">Password</Label>
                                <Input
                                  id="booking-su-password"
                                  type="password"
                                  autoComplete="new-password"
                                  value={authPassword}
                                  onChange={(e) => setAuthPassword(e.target.value)}
                                  placeholder="At least 6 characters"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                              <Button
                                type="submit"
                                variant="hero"
                                size="lg"
                                className="h-11 w-full rounded-xl text-sm"
                                disabled={authBusy}
                              >
                                {authBusy ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  "Create account and continue"
                                )}
                              </Button>
                            </form>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>

              {/* nav buttons (item + address steps) */}
              {step !== 4 && step !== 5 && !(servicesPaused && step === 5) && (
                <div className="pickup-form-actions">
                  {step > 1 ? (
                    <Button type="button" variant="ghost" onClick={goBack}>
                      <ArrowLeft />
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="button" variant="hero" size="lg" onClick={goNext}>
                    Continue
                    <ArrowRight />
                  </Button>
                </div>
              )}
              {(step === 4 || step === 5) && (
                <div className="mt-4">
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ArrowLeft />
                    Back
                  </Button>
                </div>
              )}
            </div>

            {/* trust strip */}
            <div className="pickup-trust-strip">
              {[
                { icon: ShieldCheck, t: "Item review" },
                { icon: Wallet, t: "Clear payment terms" },
                { icon: MapPin, t: "Doorstep pickup" },
                { icon: CheckCircle2, t: "Free to book" },
              ].map((r) => (
                <div
                  key={r.t}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs font-medium"
                >
                  <r.icon className="size-4 shrink-0 text-primary" />
                  {r.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
