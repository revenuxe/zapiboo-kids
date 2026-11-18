"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Camera,
  Plus,
  X,
  Sparkles,
  Loader2,
  ShieldCheck,
  Pencil,
  CheckCircle2,
  Save,
} from "lucide-react";
import {
  categoryImage,
  categoryLabel,
  listingSchema,
  money,
  vehicleCategories,
} from "@/lib/marketplace";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ListingSignIn } from "./ListingSignIn";
import { compressPhoto } from "@/lib/listing-photo-client";
import { containsContactDetails } from "@/lib/chat";
import { clearListingAuth, rememberListingAuth } from "@/lib/listing-auth";
type Draft = {
  id: string;
  seller_user_id: string;
  category: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  owners: string;
  title: string;
  description: string;
  price: string;
  negotiable: boolean;
  location: string;
  seller_name: string;
  phone: string;
  buyer_call_enabled: boolean;
  consent: boolean;
  photos: string[];
};
const draftKey = "zapiboo-vehicle-draft-v1";
const stepNames = [
  "Your vehicle",
  "Photos & story",
  "Price & location",
  "Your details",
  "Review & submit",
];
const empty: Draft = {
  id: "",
  seller_user_id: "",
  category: "used-cars",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  fuel: "Petrol",
  transmission: "Manual",
  owners: "1st owner",
  title: "",
  description: "",
  price: "",
  negotiable: true,
  location: "",
  seller_name: "",
  phone: "",
  buyer_call_enabled: false,
  consent: false,
  photos: [],
};
export function CreateListing({ initialCategory }: { initialCategory?: string }) {
  const [showAllCategories, setShowAllCategories] = useState(
    !vehicleCategories.some((c) => c.id === initialCategory),
  );
  const [draft, setDraft] = useState<Draft>(empty);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    let restored: Partial<Draft> = {};
    let restoredStep = 0;
    try {
      const stored = JSON.parse(localStorage.getItem(draftKey) ?? "null");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        if (Number.isInteger(stored.step) && stored.step >= 0 && stored.step <= 4)
          restoredStep = stored.step;
        for (const key of Object.keys(empty) as (keyof Draft)[]) {
          if (typeof stored[key] === typeof empty[key])
            Object.assign(restored, { [key]: stored[key] });
        }
        if (
          !Array.isArray(stored.photos) ||
          stored.photos.some(
            (p: unknown) => typeof p !== "string" || !p.startsWith("data:image/webp"),
          )
        )
          restored.photos = [];
      }
    } catch {}
    setDraft({
      ...empty,
      ...restored,
      id: restored.id || crypto.randomUUID(),
      ...(initialCategory && vehicleCategories.some((c) => c.id === initialCategory)
        ? { category: initialCategory }
        : {}),
    });
    setStep(restoredStep);
    setReady(true);
  }, [initialCategory]);
  useEffect(() => {
    if (!ready) return;
    setDraftSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ ...draft, step }));
        setDraftSaved(true);
      } catch {
        toast.error(
          "Your draft couldn't be saved on this device. Keep this tab open until you publish.",
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, ready, step]);
  useEffect(() => {
    if (!ready || authLoading) return;
    if (!user) {
      if (step >= 4) setStep(3);
      return;
    }
    clearListingAuth();
    let active = true;
    const identityChanged = !!draft.seller_user_id && draft.seller_user_id !== user.id;
    if (identityChanged && step >= 3) setStep(3);
    const metadata = user.user_metadata ?? {};
    const normalizePhone = (value: unknown) => {
      const digits = String(value ?? "").replace(/\D/g, "");
      return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    };
    const initialName = identityChanged ? "" : draft.seller_name;
    const initialPhone = identityChanged ? "" : draft.phone;
    const prefill = (name: string, phone: string, fromProfile = false) => {
      if (!active) return;
      setDraft((d) => ({
        ...d,
        seller_user_id: user.id,
        seller_name:
          d.seller_user_id && d.seller_user_id !== user.id ? name :
            fromProfile && !initialName && d.seller_name === String(metadata.full_name ?? metadata.name ?? "") ? name : d.seller_name || name,
        phone: d.seller_user_id && d.seller_user_id !== user.id ? phone :
          fromProfile && !initialPhone && d.phone === normalizePhone(metadata.phone ?? user.phone) ? phone : d.phone || phone,
        buyer_call_enabled:
          d.seller_user_id && d.seller_user_id !== user.id ? false : d.buyer_call_enabled,
        consent: d.seller_user_id && d.seller_user_id !== user.id ? false : d.consent,
      }));
    };
    prefill(
      String(metadata.full_name ?? metadata.name ?? ""),
      normalizePhone(metadata.phone ?? user.phone),
    );
    Promise.resolve(
      supabase
        .from("user_profiles")
        .select("full_name,whatsapp")
        .eq("user_id", user.id)
        .maybeSingle(),
    )
      .then(({ data }) => {
        if (data)
          prefill(
            data.full_name ?? String(metadata.full_name ?? metadata.name ?? ""),
            normalizePhone(data.whatsapp ?? metadata.phone ?? user.phone),
            true,
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [ready, authLoading, user?.id]);
  function saveBeforeSignIn() {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ ...draft, step: 3 }));
      rememberListingAuth(draft.category);
      setDraftSaved(true);
      return true;
    } catch {
      return false;
    }
  }
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function go(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => heading.current?.focus(), 0);
  }
  async function addPhotos(files: FileList | null) {
    if (!files) return;
    if (draft.photos.length + files.length > 8) return toast.error("You can add up to 8 photos.");
    setProcessing(true);
    try {
      const photos = await Promise.all(Array.from(files).map(compressPhoto));
      setDraft((d) => ({ ...d, photos: [...d.photos, ...photos].slice(0, 8) }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't read that photo.");
    } finally {
      setProcessing(false);
    }
  }
  async function next() {
    if (!form.current?.reportValidity()) return;
    if (step === 1 && !draft.photos.length)
      return toast.error("Add at least one real photo of your vehicle.");
    if (step === 1 && /\[(?:add details|your neighbourhood)\]/i.test(draft.description))
      return toast.error("Replace the starter text in brackets with your own details.");
    if (
      step === 1 &&
      (containsContactDetails(draft.title) || containsContactDetails(draft.description))
    )
      return toast.error(
        "Remove phone numbers, email and off-platform links. Buyers can reach you in Chats.",
      );
    if (step === 0 && !draft.title)
      field("title", `${draft.year} ${draft.brand} ${draft.model}`.trim());
    if (step === 3) {
      if (containsContactDetails(draft.seller_name))
        return toast.error("Use your name without phone numbers or contact links.");
      if (!user) {
        go(3);
        return;
      }
      setPending(true);
      try {
        const { error } = await supabase
          .from("user_profiles")
          .upsert(
            { user_id: user.id, full_name: draft.seller_name.trim(), whatsapp: draft.phone },
            { onConflict: "user_id" },
          );
        if (error) throw error;
        go(4);
      } catch {
        toast.error("Couldn't save your contact details. Please try again; your draft is safe.");
      } finally {
        setPending(false);
      }
      return;
    }
    go(Math.min(4, step + 1));
  }
  async function publish() {
    if (!user) {
      saveBeforeSignIn();
      go(3);
      return;
    }
    const parsed = listingSchema.safeParse({ ...draft, consent: draft.consent });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!draft.photos.length) {
      toast.error("Add at least one vehicle photo.");
      go(1);
      return;
    }
    setPending(true);
    try {
      const data = new FormData();
      const { photos, seller_user_id: _sellerIdentity, ...details } = draft;
      data.append("listing", JSON.stringify(details));
      for (const [i, url] of photos.entries()) {
        const blob = await (await fetch(url)).blob();
        data.append("photos", blob, `vehicle-${i}.webp`);
      }
      const response = await fetch("/api/marketplace", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Couldn't publish your listing.");
      localStorage.removeItem(draftKey);
      toast.success("Listing submitted for approval. You can track it in My Listings.");
      router.push("/marketplace/my-listings");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't publish. Please try again.");
    } finally {
      setPending(false);
    }
  }
  const title =
    draft.title ||
    [draft.year, draft.brand, draft.model].filter(Boolean).join(" ") ||
    "Your vehicle title";
  const tips = [
    [
      "Start with what you know.",
      "Your make, model and year help buyers find the right vehicle. You can find these on your registration certificate.",
    ],
    [
      "Show the real thing.",
      "Add clear photos of the front, rear, both sides and interior. Photograph any damage honestly. Your first photo becomes the cover.",
    ],
    [
      "A clear price starts conversations.",
      "Use your expected selling price. Share your neighbourhood, rather than your full home address.",
    ],
    [
      "A real person behind every listing.",
      "Sign in first, then confirm your name and mobile number. You can choose whether signed-in buyers may call you; Chats is always available.",
    ],
    [
      "One last look. Then a new road.",
      "Check the details and photos. You can mark your vehicle as sold or archive it from My listings.",
    ],
  ];
  return (
    <div className="marketplace mp-create">
      <div className="mp-shell">
        <Link
          href={`/marketplace${draft.category ? `?category=${draft.category}` : ""}`}
          className="mp-back"
        >
          <ArrowLeft size={15} />
          Back to marketplace
        </Link>
        <div className="mp-create-heading">
          <div>
            <span className="mp-eyebrow">A NEW CHAPTER FOR YOUR VEHICLE</span>
            <h1>
              Let&apos;s get you <span>listed.</span>
            </h1>
            <p>A few details. A few good photos. You&apos;re on your way.</p>
          </div>
          <span className="mp-draft-state">
            <Save size={14} />
            {draftSaved ? "Draft saved on this device" : "Saving your draft…"}
          </span>
        </div>
        <ol className="mp-stepper" aria-label="Listing progress">
          {stepNames.map((name, i) => (
            <li
              key={name}
              className={i === step ? "is-current" : i < step ? "is-complete" : ""}
              aria-current={i === step ? "step" : undefined}
            >
              <button type="button" disabled={i > step} onClick={() => go(i)}>
                <span>{i < step ? <Check size={15} /> : i + 1}</span>
                {name}
              </button>
            </li>
          ))}
        </ol>
        <div className="mp-create-grid">
          {step >= 3 && authLoading ? (
            <div className="mp-form mp-auth-loading" role="status">
              <Loader2 className="animate-spin" size={24} />
              Checking your session…
            </div>
          ) : step >= 3 && !user ? (
            <ListingSignIn
              onBack={() => go(2)}
              saveDraft={saveBeforeSignIn}
              category={draft.category}
            />
          ) : (
            <form
              className="mp-form"
              ref={form}
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 4) next();
                else publish();
              }}
            >
              <div className="mp-form-title">
                <span>STEP {step + 1} OF 5</span>
                <h2 ref={heading} tabIndex={-1}>
                  {
                    [
                      "First, meet your vehicle.",
                      "Give buyers the full picture.",
                      "The deal starts here.",
                      "How can buyers reach you?",
                      "Ready to send for approval?",
                    ][step]
                  }
                </h2>
                <p>
                  {
                    [
                      "The essentials help the right buyers find you.",
                      "Actual photos and an honest story make a stronger listing.",
                      "Set your price and tell buyers where to find you.",
                      "Confirm your name and mobile number before continuing.",
                      "An admin will review your listing before it becomes visible to buyers.",
                    ][step]
                  }
                </p>
              </div>
              {step === 0 && (
                <div className="mp-form-fields">
                  <fieldset>
                    <legend>What are you selling?</legend>
                    {!showAllCategories && (
                      <div className="mp-selected-category">
                        <Image
                          src={categoryImage(draft.category)}
                          alt={categoryLabel(draft.category)}
                          width={145}
                          height={95}
                          sizes="145px"
                        />
                        <div>
                          <small>YOUR VEHICLE TYPE</small>
                          <strong>{categoryLabel(draft.category)}</strong>
                          <span>
                            <CheckCircle2 size={13} />
                            Selected for this listing
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAllCategories(true)}
                          aria-expanded={showAllCategories}
                          aria-controls="listing-vehicle-types"
                        >
                          Change vehicle type
                        </button>
                      </div>
                    )}
                    {showAllCategories && (
                      <>
                        <div className="mp-form-categories" id="listing-vehicle-types">
                          {vehicleCategories.map((c) => (
                            <button
                              type="button"
                              key={c.id}
                              aria-pressed={draft.category === c.id}
                              className={draft.category === c.id ? "is-active" : ""}
                              onClick={() => {
                                field("category", c.id);
                                if (c.id === "electric-vehicles") field("fuel", "Electric");
                                else if (
                                  draft.fuel === "Electric" &&
                                  draft.category === "electric-vehicles"
                                )
                                  field("fuel", "Petrol");
                                setShowAllCategories(false);
                                const url = new URL(window.location.href);
                                url.searchParams.set("category", c.id);
                                window.history.replaceState(null, "", url.pathname + url.search);
                              }}
                            >
                              <Image src={c.image_url} alt="" width={80} height={52} sizes="80px" />
                              <span>{c.label.replace("Used ", "")}</span>
                              {draft.category === c.id && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </fieldset>
                  <div className="mp-form-two">
                    <label>
                      Brand <span>*</span>
                      <input
                        required
                        maxLength={40}
                        placeholder="e.g. Maruti Suzuki"
                        value={draft.brand}
                        onChange={(e) => field("brand", e.target.value)}
                        list="vehicle-brands"
                      />
                      <datalist id="vehicle-brands">
                        {[
                          "Maruti Suzuki",
                          "Hyundai",
                          "Tata",
                          "Mahindra",
                          "Honda",
                          "Toyota",
                          "Kia",
                          "Hero",
                          "Bajaj",
                          "TVS",
                          "Royal Enfield",
                          "Suzuki",
                          "Yamaha",
                          "Ather",
                          "Ola Electric",
                        ].map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </label>
                    <label>
                      Model / variant <span>*</span>
                      <input
                        required
                        maxLength={60}
                        placeholder="e.g. Swift VXi"
                        value={draft.model}
                        onChange={(e) => field("model", e.target.value)}
                      />
                    </label>
                    <label>
                      Registration year <span>*</span>
                      <input
                        required
                        type="number"
                        min={1980}
                        max={new Date().getFullYear() + 1}
                        placeholder="e.g. 2021"
                        value={draft.year}
                        onChange={(e) => field("year", e.target.value)}
                      />
                    </label>
                    <label>
                      Kilometres driven <span>*</span>
                      <input
                        required
                        type="number"
                        min={0}
                        max={2000000}
                        placeholder="e.g. 35000"
                        value={draft.mileage}
                        onChange={(e) => field("mileage", e.target.value)}
                      />
                    </label>
                    <label>
                      Fuel type
                      <select value={draft.fuel} onChange={(e) => field("fuel", e.target.value)}>
                        {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Transmission
                      <select
                        value={draft.transmission}
                        onChange={(e) => field("transmission", e.target.value)}
                      >
                        <option>Manual</option>
                        <option>Automatic</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Number of owners
                    <select value={draft.owners} onChange={(e) => field("owners", e.target.value)}>
                      <option>1st owner</option>
                      <option>2nd owner</option>
                      <option>3rd owner or more</option>
                    </select>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="mp-form-fields">
                  <fieldset>
                    <legend>
                      Vehicle photos <span>*</span>
                      <small>
                        {draft.photos.length}/8 photos · First photo is the cover · JPG, PNG or WebP
                      </small>
                    </legend>
                    <div className="mp-photo-grid">
                      {draft.photos.map((p, i) => (
                        <div key={p.slice(-30) + i} className="mp-uploaded-photo">
                          <img src={p} alt={`Vehicle photo ${i + 1}`} />
                          {i === 0 && <span>Cover</span>}
                          <button
                            type="button"
                            aria-label={`Remove photo ${i + 1}`}
                            onClick={() =>
                              field(
                                "photos",
                                draft.photos.filter((_, n) => n !== i),
                              )
                            }
                          >
                            <X size={14} />
                          </button>
                          {i > 0 && (
                            <button
                              type="button"
                              className="mp-make-cover"
                              onClick={() =>
                                field("photos", [p, ...draft.photos.filter((_, n) => n !== i)])
                              }
                            >
                              Make cover
                            </button>
                          )}
                        </div>
                      ))}
                      {draft.photos.length < 8 && (
                        <label className="mp-photo-add">
                          {processing ? (
                            <Loader2 size={25} className="animate-spin" />
                          ) : (
                            <Camera size={26} />
                          )}
                          <strong>{processing ? "Optimizing…" : "Add photos"}</strong>
                          <span>Up to 10 MB each</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            disabled={processing}
                            onChange={(e) => {
                              addPhotos(e.target.files);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="mp-photo-hint">
                      <CheckCircle2 size={14} />
                      Photos are automatically resized and converted to WebP. Keep phone numbers and
                      contact details out of your photos.
                    </p>
                  </fieldset>
                  <label>
                    Listing title <span>*</span>
                    <input
                      required
                      minLength={10}
                      maxLength={100}
                      value={draft.title}
                      onChange={(e) => field("title", e.target.value)}
                      placeholder="e.g. 2021 Maruti Swift VXi, single owner"
                    />
                    <small>
                      Keep it specific: year, make, model and one useful detail.{" "}
                      {draft.title.length}
                      /100
                    </small>
                  </label>
                  <label>
                    <span className="mp-label-action">
                      Tell its story{" "}
                      <button
                        type="button"
                        onClick={() =>
                          field(
                            "description",
                            `Selling my ${draft.year} ${draft.brand} ${draft.model}. It has covered ${Number(draft.mileage).toLocaleString("en-IN")} km and runs on ${draft.fuel.toLowerCase()}. ${draft.owners}.\n\nCondition and known damage: [add details]\nService history: [add details]\nReason for selling: [add details]\n\nAvailable for viewing in ${draft.location || "[your neighbourhood]"}, Bangalore. Contact me to discuss the vehicle and arrange a visit.`,
                          )
                        }
                      >
                        <Sparkles size={13} />
                        Help me start
                      </button>
                    </span>
                    <textarea
                      required
                      minLength={40}
                      maxLength={3000}
                      rows={8}
                      value={draft.description}
                      onChange={(e) => field("description", e.target.value)}
                      placeholder="How has it been used? Mention service history, condition, extras and why you're selling."
                    />
                    <small>
                      Review the starter text and replace anything in [brackets].{" "}
                      {draft.description.length}/3000
                    </small>
                  </label>
                </div>
              )}
              {step === 2 && (
                <div className="mp-form-fields">
                  <label>
                    Asking price <span>*</span>
                    <div className="mp-price-input">
                      <span>₹</span>
                      <input
                        required
                        type="number"
                        min={1000}
                        max={100000000}
                        value={draft.price}
                        onChange={(e) => field("price", e.target.value)}
                        placeholder="e.g. 525000"
                      />
                    </div>
                    <small>
                      {draft.price
                        ? money(Number(draft.price))
                        : "Enter the full amount, not a monthly EMI."}
                    </small>
                  </label>
                  <label className="mp-checkbox">
                    <input
                      type="checkbox"
                      checked={draft.negotiable}
                      onChange={(e) => field("negotiable", e.target.checked)}
                    />
                    I&apos;m open to reasonable offers
                  </label>
                  <label>
                    Bangalore neighbourhood <span>*</span>
                    <input
                      required
                      minLength={2}
                      maxLength={80}
                      value={draft.location}
                      onChange={(e) => field("location", e.target.value)}
                      placeholder="e.g. Indiranagar"
                    />
                    <small>Your neighbourhood is public. Keep your exact address private.</small>
                  </label>
                </div>
              )}
              {step === 3 && user && (
                <div className="mp-form-fields">
                  <div className="mp-account-confirmed">
                    <CheckCircle2 size={17} />
                    <span>Signed in as {user?.email || "your account"}</span>
                  </div>
                  <div className="mp-form-two mp-seller-fields">
                    <label>
                      Your name <span>*</span>
                      <input
                        required
                        minLength={2}
                        maxLength={80}
                        value={draft.seller_name}
                        onChange={(e) => field("seller_name", e.target.value)}
                        autoComplete="name"
                        placeholder="Name shown to buyers"
                      />
                    </label>
                    <label>
                      Mobile number <span>*</span>
                      <div className="mp-phone-input">
                        <span>+91</span>
                        <input
                          required
                          inputMode="tel"
                          pattern="[6-9][0-9]{9}"
                          maxLength={10}
                          autoComplete="tel-national"
                          value={draft.phone}
                          onChange={(e) => field("phone", e.target.value.replace(/\D/g, ""))}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </label>
                    <label className="mp-checkbox">
                      <input
                        type="checkbox"
                        checked={draft.buyer_call_enabled}
                        onChange={(e) => field("buyer_call_enabled", e.target.checked)}
                      />
                      <span>Allow signed-in buyers to see my number and call me.</span>
                    </label>
                  </div>
                  <label className="mp-checkbox mp-consent">
                    <input
                      type="checkbox"
                      required
                      checked={draft.consent}
                      onChange={(e) => field("consent", e.target.checked)}
                    />
                    <span>
                      I am the owner or authorised to sell this vehicle. I agree to the{" "}
                      <Link href="/terms" target="_blank">
                        terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank">
                        privacy policy
                      </Link>
                      . My listing and photos will be public. My number stays private unless I
                      opt in above; buyers can always contact me through Zapiboo Chats.
                    </span>
                  </label>
                </div>
              )}
              {step === 4 && (
                <div className="mp-form-fields">
                  <div className="mp-review-image">
                    {draft.photos[0] ? (
                      <img src={draft.photos[0]} alt={title} />
                    ) : (
                      <Image
                        src={categoryImage(draft.category)}
                        alt={title}
                        width={600}
                        height={400}
                      />
                    )}
                    <span>{categoryLabel(draft.category)}</span>
                  </div>
                  <div className="mp-review-title">
                    <div>
                      <strong>{money(Number(draft.price))}</strong>
                      <h3>{title}</h3>
                      <p>
                        {draft.location}, Bangalore ·{" "}
                        {draft.negotiable ? "Negotiable" : "Fixed price"}
                      </p>
                    </div>
                    <button type="button" className="mp-btn-secondary" onClick={() => go(2)}>
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>
                  <div className="mp-review-specs">
                    {[
                      ["Year", draft.year],
                      ["Kilometres", Number(draft.mileage).toLocaleString("en-IN") + " km"],
                      ["Fuel", draft.fuel],
                      ["Transmission", draft.transmission],
                      ["Ownership", draft.owners],
                      ["Seller", draft.seller_name],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span>{k}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="mp-review-description">
                    <h3>
                      Description{" "}
                      <button type="button" onClick={() => go(1)}>
                        Edit
                      </button>
                    </h3>
                    <p>{draft.description}</p>
                  </div>
                  <div className="mp-info-box">
                    <ShieldCheck size={21} />
                    <p>
                      Buyers will contact you through Zapiboo Chats. Always inspect documents, agree
                      payment arrangements and complete the ownership transfer before handing over
                      your vehicle.
                    </p>
                  </div>
                </div>
              )}
              <div className="mp-form-footer">
                {step > 0 ? (
                  <button
                    type="button"
                    className="mp-btn-secondary"
                    onClick={() => go(step - 1)}
                    disabled={pending}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                ) : (
                  <Link className="mp-btn-secondary" href="/marketplace">
                    Cancel
                  </Link>
                )}
                <button className="mp-btn" type="submit" disabled={pending || processing || !ready}>
                  {pending ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {step === 3 ? "Saving details…" : "Publishing…"}
                    </>
                  ) : step === 4 ? (
                    <>
                      Submit for approval
                      <ArrowRight size={17} />
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          <aside className="mp-create-aside">
            <div className="mp-tip-card">
              <span className="mp-tip-icon">
                <Sparkles size={23} />
              </span>
              <h3>{tips[step][0]}</h3>
              <p>{tips[step][1]}</p>
            </div>
            <div className="mp-live-preview">
              <span className="mp-eyebrow">YOUR LISTING, COMING TO LIFE</span>
              <div className="mp-preview-photo">
                {draft.photos[0] ? (
                  <img src={draft.photos[0]} alt="Your listing cover" />
                ) : (
                  <Image
                    src={categoryImage(draft.category)}
                    alt="Category illustration; add your own photos"
                    width={300}
                    height={200}
                    sizes="300px"
                  />
                )}
              </div>
              <strong>{draft.price ? money(Number(draft.price)) : "Your asking price"}</strong>
              <h3>{title}</h3>
              <p>
                {draft.year || "Year"} ·{" "}
                {draft.mileage
                  ? Number(draft.mileage).toLocaleString("en-IN") + " km"
                  : "Kilometres"}{" "}
                · {draft.fuel}
              </p>
              <span>{draft.location || "Your neighbourhood"}, Bangalore</span>
            </div>
            <p className="mp-draft-note">
              <Save size={14} />
              Your draft is saved in this browser. Return on this device to pick up where you left
              off.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
