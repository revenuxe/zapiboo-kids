"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Heart,
  LayoutGrid,
  List,
  ChevronDown,
  RotateCcw,
  BadgeCheck,
  CarFront,
  Loader2,
} from "lucide-react";
import {
  vehicleCategories,
  categoryLabel,
  sampleListings,
  type VehicleListing,
} from "@/lib/marketplace";
import { useSavedVehicles } from "@/hooks/use-saved-vehicles";
import { useAuth } from "@/hooks/use-auth";
import { ListingCard } from "./ListingCard";
import { toast } from "sonner";
const fetcher = async (url: string) => {
  const r = await fetch(url);
  const body = await r.json();
  if (!r.ok) throw new Error(body.error ?? "Couldn't load listings.");
  return body as { listings: VehicleListing[]; available: boolean };
};
export function Marketplace({
  initialCategory = "",
  initialView = "browse",
}: {
  initialCategory?: string;
  initialView?: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState(initialCategory);
  const [view, setView] = useState(initialView);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [page, setPage] = useState(1);
  const { saved, toggle } = useSavedVehicles();
  const { data, error, isLoading, mutate } = useSWR(
    view === "mine" && !user ? null : `/api/marketplace${view === "mine" ? "?mine=true" : ""}`,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  useEffect(() => {
    setCategory(initialCategory);
    setView(initialView);
  }, [initialCategory, initialView]);
  useEffect(() => {
    setPage(1);
  }, [category, view, query, location, minPrice, maxPrice, fuel, transmission, year, brand, sort]);
  useEffect(() => {
    if (!filtersOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = document.querySelector<HTMLElement>(".mp-filters-open");
    drawer?.querySelector<HTMLElement>(".mp-mobile-close")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
      if (event.key !== "Tab" || !drawer) return;
      const controls = Array.from(
        drawer.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, a[href]"),
      ).filter((el) => el.getClientRects().length);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [filtersOpen]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category) params.set("category", category);
    else params.delete("category");
    if (view !== "browse") params.set("view", view);
    else params.delete("view");
    window.history.replaceState(null, "", `/marketplace${params.size ? `?${params}` : ""}`);
  }, [category, view]);
  useEffect(() => {
    if (data && !data.available && view !== "mine") setShowPreview(true);
  }, [data, view]);
  const preview = view !== "mine" && showPreview;
  const source = preview ? sampleListings : (data?.listings ?? []);
  const results = useMemo(
    () =>
      source
        .filter(
          (l) =>
            (!category || l.category === category) &&
            (view !== "saved" || saved.includes(l.id)) &&
            (!query ||
              `${l.title} ${l.brand} ${l.model} ${l.description}`
                .toLowerCase()
                .includes(query.toLowerCase().trim())) &&
            (!location || l.location.toLowerCase().includes(location.toLowerCase())) &&
            (!minPrice || l.price >= Number(minPrice)) &&
            (!maxPrice || l.price <= Number(maxPrice)) &&
            (!fuel || l.fuel === fuel) &&
            (!transmission || l.transmission === transmission) &&
            (!year || l.year >= Number(year)) &&
            (!brand || l.brand === brand),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : sort === "mileage"
                ? a.mileage - b.mileage
                : sort === "year"
                  ? b.year - a.year
                  : Date.parse(b.created_at) - Date.parse(a.created_at),
        ),
    [
      source,
      category,
      view,
      saved,
      query,
      location,
      minPrice,
      maxPrice,
      fuel,
      transmission,
      year,
      brand,
      sort,
    ],
  );
  const filterCount = [
    category,
    minPrice,
    maxPrice,
    fuel,
    transmission,
    year,
    brand,
    location,
  ].filter(Boolean).length;
  const brands = [
    ...new Set(source.filter((l) => !category || l.category === category).map((l) => l.brand)),
  ].sort();
  function clear() {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setFuel("");
    setTransmission("");
    setYear("");
    setBrand("");
    setLocation("");
    setQuery("");
  }
  async function updateStatus(id: string, status: "active" | "sold" | "archived") {
    try {
      const r = await fetch(`/api/marketplace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      toast.success("Listing updated.");
      mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update listing.");
    }
  }
  return (
    <div className="marketplace">
      <div className="mp-shell">
        <h1 className="sr-only">
          {category ? categoryLabel(category) + " marketplace" : "Vehicle marketplace"}
        </h1>
        <section className="mp-intro" aria-label="List your vehicle">
          <div className="mp-sell-banner">
            <div>
              <span className="mp-eyebrow">TIME FOR SOMETHING NEW?</span>
              <h2>
                Your vehicle.
                <br />
                Someone&apos;s next adventure.
              </h2>
              <Link
                href={`/marketplace/sell${category ? `?category=${category}` : ""}`}
                className="mp-btn"
              >
                List your vehicle <Plus size={17} />
              </Link>
              <small>Photos. A few details. Ready to go.</small>
            </div>
            <Image
              src="/vehicles/used-cars-cutout.webp"
              alt="Silver hatchback"
              width={270}
              height={178}
              sizes="(max-width: 767px) 150px, 250px"
            />
          </div>
        </section>
        <div className="mp-search">
          <Search size={22} />
          <input
            aria-label="Search vehicles"
            placeholder="Search a brand, model or your next ride…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mp-search-location">
            <MapPin size={17} />
            <input
              aria-label="Search locality"
              placeholder="Bangalore locality"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button
            className="mp-btn"
            onClick={() =>
              document
                .getElementById("mp-results")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Find vehicles <ArrowRight size={17} />
          </button>
        </div>
        <nav className="mp-category-rail" aria-label="Vehicle categories">
          <button
            className={!category ? "is-active" : ""}
            onClick={() => {
              setCategory("");
              setBrand("");
            }}
          >
            <span className="mp-all-icon">
              <LayoutGrid size={24} />
            </span>
            All vehicles
          </button>
          {vehicleCategories.map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "is-active" : ""}
              onClick={() => {
                setCategory(c.id);
                setBrand("");
              }}
            >
              <Image src={c.image_url} alt="" width={85} height={54} sizes="85px" />
              {c.label.replace("Used ", "")}
            </button>
          ))}
        </nav>
        <div className="mp-tabs">
          <div role="tablist" aria-label="Marketplace views">
            {[
              ["browse", "Explore vehicles"],
              ["saved", `Saved${saved.length ? ` (${saved.length})` : ""}`],
              ["mine", "My listings"],
            ].map(([id, label]) => (
              <button
                role="tab"
                aria-selected={view === id}
                key={id}
                className={view === id ? "is-active" : ""}
                onClick={() => {
                  setView(id);
                  setShowPreview(false);
                }}
              >
                {id === "saved" && <Heart size={15} />} {label}
              </button>
            ))}
          </div>
          <Link href="/marketplace/sell">
            Sell a vehicle <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mp-content">
          <aside
            className={`mp-filters ${filtersOpen ? "mp-filters-open" : ""}`}
            aria-label="Filter vehicles"
          >
            <div className="mp-filter-heading">
              <h2>
                <SlidersHorizontal size={17} />
                Filters {filterCount > 0 && <span>{filterCount}</span>}
              </h2>
              <button onClick={clear}>Reset</button>
              <button
                className="mp-mobile-close"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
              >
                <X size={21} />
              </button>
            </div>
            <label>
              Vehicle type
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setBrand("");
                }}
              >
                <option value="">All vehicles</option>
                {vehicleCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Budget</legend>
              <div className="mp-budget">
                <input
                  aria-label="Minimum price"
                  type="number"
                  min="0"
                  placeholder="₹ Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>–</span>
                <input
                  aria-label="Maximum price"
                  type="number"
                  min="0"
                  placeholder="₹ Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="mp-budget-chips">
                {[
                  ["100000", "Under ₹1 lakh"],
                  ["500000", "Under ₹5 lakh"],
                  ["1000000", "Under ₹10 lakh"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    className={maxPrice === v ? "is-active" : ""}
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice(v);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {minPrice && maxPrice && Number(minPrice) > Number(maxPrice) && (
                <small className="mp-error">Minimum price exceeds maximum.</small>
              )}
            </fieldset>
            <label>
              Brand
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <label>
              Year
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Any year</option>
                {[2024, 2022, 2020, 2018, 2015].map((y) => (
                  <option key={y} value={y}>
                    {y} & newer
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Fuel type</legend>
              {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                <label className="mp-radio" key={f}>
                  <input
                    type="checkbox"
                    checked={fuel === f}
                    onChange={() => setFuel(fuel === f ? "" : f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </fieldset>
            <label>
              Transmission
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="">Any transmission</option>
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </label>
            <button className="mp-btn mp-mobile-apply" onClick={() => setFiltersOpen(false)}>
              Show {results.length} vehicles
            </button>
            <div className="mp-filter-tip">
              <BadgeCheck size={21} />
              <strong>A little care goes a long way.</strong>
              <p>Inspect the vehicle, verify its documents and meet the seller before paying.</p>
            </div>
          </aside>
          <section className="mp-results" id="mp-results">
            <div className="mp-results-heading">
              <div>
                <h2>
                  {view === "mine"
                    ? "My listings"
                    : view === "saved"
                      ? "Saved vehicles"
                      : category
                        ? categoryLabel(category)
                        : "Explore vehicles"}
                  <span>{results.length}</span>
                </h2>
              </div>
              <div className="mp-result-controls">
                <button
                  className="mp-filter-toggle mp-icon-btn"
                  aria-label="Open filters"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={17} />
                  Filters {filterCount || ""}
                </button>
                <label className="mp-sort">
                  <span className="sr-only">Sort vehicles</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="mileage">Lowest kilometres</option>
                    <option value="year">Newest model year</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
                <div className="mp-layout">
                  <button
                    aria-label="Grid view"
                    aria-pressed={layout === "grid"}
                    onClick={() => setLayout("grid")}
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    aria-label="List view"
                    aria-pressed={layout === "list"}
                    onClick={() => setLayout("list")}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
            {filterCount > 0 && (
              <div className="mp-active-filters">
                {[
                  [category, categoryLabel(category), () => setCategory("")],
                  [fuel, fuel, () => setFuel("")],
                  [transmission, transmission, () => setTransmission("")],
                  [year, `${year}+`, () => setYear("")],
                  [brand, brand, () => setBrand("")],
                  [
                    maxPrice,
                    `Max ₹${Number(maxPrice).toLocaleString("en-IN")}`,
                    () => setMaxPrice(""),
                  ],
                  [
                    minPrice,
                    `Min ₹${Number(minPrice).toLocaleString("en-IN")}`,
                    () => setMinPrice(""),
                  ],
                  [location, location, () => setLocation("")],
                ]
                  .filter(([v]) => v)
                  .map(([, label, action]) => (
                    <button key={String(label)} onClick={action as () => void}>
                      {String(label)}
                      <X size={12} />
                    </button>
                  ))}
              </div>
            )}
            {preview && (
              <div className="mp-preview-notice">
                You&apos;re exploring example listings. These vehicles aren&apos;t offered for sale.
                <button onClick={() => setShowPreview(false)}>
                  Back to live listings <ArrowRight size={13} />
                </button>
              </div>
            )}
            {(isLoading || authLoading) && !preview ? (
              <div className="mp-skeleton-grid" aria-label="Loading vehicles">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div className="mp-skeleton" key={i} />
                ))}
              </div>
            ) : view === "mine" && !user ? (
              <div className="mp-empty">
                <CarFront size={38} />
                <h3>Your vehicles. All in one place.</h3>
                <p>Sign in to publish a listing and manage your vehicles.</p>
                <Link href="/auth?redirectTo=%2Fmarketplace%3Fview%3Dmine" className="mp-btn">
                  Sign in <ArrowRight size={16} />
                </Link>
              </div>
            ) : results.length ? (
              <>
                <div className={`mp-listing-grid ${layout === "list" ? "mp-list-layout" : ""}`}>
                  {results.slice(0, page * 9).map((l) => (
                    <div key={l.id}>
                      <ListingCard
                        listing={l}
                        saved={saved.includes(l.id)}
                        onSave={toggle}
                        compact={layout === "list"}
                      />
                      {view === "mine" && (
                        <div className="mp-owner-actions">
                          <span className={`mp-status mp-status-${l.status}`}>{l.status}</span>
                          <button
                            onClick={() =>
                              updateStatus(l.id, l.status === "active" ? "sold" : "active")
                            }
                          >
                            {l.status === "active" ? "Mark as sold" : "Relist"}
                          </button>
                          {l.status !== "archived" && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Archive this listing? It will be hidden from buyers.",
                                  )
                                )
                                  updateStatus(l.id, "archived");
                              }}
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {results.length > page * 9 && (
                  <button className="mp-load-more" onClick={() => setPage((p) => p + 1)}>
                    Show more vehicles <ChevronDown size={16} />
                  </button>
                )}
              </>
            ) : (
              <div className="mp-empty">
                <Search size={36} />
                <h3>
                  {view === "saved"
                    ? "Your shortlist starts here."
                    : view === "mine"
                      ? "Your next sale starts here."
                      : filterCount || query
                        ? "No matches just yet."
                        : "Be part of the first chapter."}
                </h3>
                <p>
                  {view === "saved"
                    ? "Tap the heart on a vehicle to keep it here on this device."
                    : view === "mine"
                      ? "Add your vehicle, show its best side and tell buyers what makes it yours."
                      : error || data?.available === false
                        ? "Live listings are temporarily unavailable. You can still explore the marketplace preview."
                        : filterCount || query
                          ? "Try a wider budget, another locality or fewer filters."
                          : "The marketplace is ready for its first sellers. List your vehicle or explore the example listings."}
                </p>
                <div>
                  {filterCount || query ? (
                    <button className="mp-btn" onClick={clear}>
                      <RotateCcw size={16} />
                      Clear filters
                    </button>
                  ) : (
                    <Link
                      href={`/marketplace/sell${category ? `?category=${category}` : ""}`}
                      className="mp-btn"
                    >
                      List your vehicle <Plus size={17} />
                    </Link>
                  )}
                  {view !== "mine" && !preview && (
                    <button className="mp-btn-secondary" onClick={() => setShowPreview(true)}>
                      Explore preview <ArrowRight size={16} />
                    </button>
                  )}
                  {(error || data?.available === false) && (
                    <button className="mp-btn-secondary" onClick={() => mutate()}>
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="mp-bottom-note">
              <BadgeCheck size={17} />
              <p>
                Good deals start with a conversation. Check the vehicle and ownership documents
                before you commit.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
