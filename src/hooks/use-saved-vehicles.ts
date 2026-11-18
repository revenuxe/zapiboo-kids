"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const key = "zapiboo-saved-vehicles-v1";
export function useSavedVehicles() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(value)) setSaved(value.filter((v) => typeof v === "string"));
    } catch {
      /* A new list can still be created. */
    }
  }, []);
  function toggle(id: string) {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        toast.error("Couldn't save to this browser. Check your storage settings.");
      }
      return next;
    });
  }
  return { saved, toggle };
}
