"use client";
import { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";
import type { SellingCategory } from "@/lib/selling-categories";
const CatalogContext = createContext<readonly SellingCategory[]>([]);
export function CatalogProvider({
  initialCategories,
  children,
}: {
  initialCategories: SellingCategory[];
  children: ReactNode;
}) {
  const { data } = useSWR(
    "/api/categories",
    async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Could not refresh categories.");
      return response.json() as Promise<SellingCategory[]>;
    },
    { fallbackData: initialCategories, refreshInterval: 60000, revalidateOnMount: false },
  );
  return (
    <CatalogContext.Provider value={data ?? initialCategories}>{children}</CatalogContext.Provider>
  );
}
export const useSellingCategories = () => useContext(CatalogContext);
