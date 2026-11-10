"use client";

import { servicesPaused, showOpeningSoon } from "@/lib/launch-status";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const carRegistrationKey = "zapiboo-item-search";

export function CarValuationForm() {
  const id = useId();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (servicesPaused) { showOpeningSoon(); return; }
    const value = search.trim();
    if (!value || value.length < 2) {
      setError("Please describe the item you want to sell (e.g. 'Lego set', 'Kids bicycle').");
      return;
    }
    try {
      window.sessionStorage.setItem(carRegistrationKey, value);
      router.push("/pickup");
    } catch {
      setError("Your browser could not save these details. Please continue manually below.");
    }
  }
  return (
    <form data-service-form={servicesPaused ? "" : undefined} onSubmit={submit} className="text-foreground">
      <label htmlFor={id} className="block text-base font-bold sm:text-lg">
        What would you like to sell?
      </label>
      <p id={`${id}-hint`} className="mt-2 text-sm text-muted-foreground">
        Describe the item you want to list — toys, books, clothing, baby gear or anything kids-related.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setError("");
          }}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          aria-invalid={!!error}
          maxLength={100}
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. Lego set, Kids bicycle, Baby stroller"
          className="min-h-14 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-base font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Start listing <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-col justify-between gap-3 text-xs sm:flex-row sm:items-center">
        <span className="text-muted-foreground">
          Free listing · No commission on first items
        </span>
        <Link
          href="/pickup"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Browse all categories
        </Link>
      </div>
    </form>
  );
}
