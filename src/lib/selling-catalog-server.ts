import "server-only";
import { cache } from "react";
import { supabaseConfig } from "@/integrations/supabase/config";
import type { SellingCategory } from "@/lib/selling-categories";

export const categoryCacheTag = "selling-catalog";
export const getPublicSellingCategories = cache(async (): Promise<SellingCategory[]> => {
  const { url, key } = supabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/selling_categories?select=*&is_active=eq.true&order=sort_order.asc,id.asc`,
    {
      headers: { apikey: key },
      next: { revalidate: 60, tags: [categoryCacheTag] },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error("The selling catalog could not be loaded. Please try again.");
  return response.json();
});
