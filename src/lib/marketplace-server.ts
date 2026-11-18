import "server-only";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { VehicleListing } from "@/lib/marketplace";

// The new tables are installed by the marketplace migration; keep the existing generated schema intact.
export async function marketplaceDb(): Promise<SupabaseClient> {
  return (await createSupabaseServerClient()) as unknown as SupabaseClient;
}
export const publicListingColumns =
  "id,user_id,category,title,description,brand,model,year,mileage,price,fuel,transmission,owners,location,seller_name,negotiable,buyer_call_enabled,photos,status,created_at";
export const ownerListingColumns = publicListingColumns + ",rejection_reason,updated_at";
export const privateListingHeaders = { "Cache-Control": "private, no-store" };

export async function getMarketplaceListing(id: string) {
  const db = await marketplaceDb();
  const { data, error } = await db
    .from("vehicle_listings")
    .select(publicListingColumns)
    .eq("id", id)
    .returns<VehicleListing>()
    .maybeSingle();
  if (error) throw new Error("Couldn't load marketplace listing metadata.");
  return data;
}

export function listingPhotoPaths(urls: string[], userId: string, listingId: string) {
  const prefix = "/storage/v1/object/public/vehicle-listing-photos/";
  return urls.flatMap(value => {
    try {
      const path = decodeURIComponent(new URL(value).pathname).split(prefix)[1];
      return path?.startsWith(`${userId}/${listingId}/`) && !path.includes("..") ? [path] : [];
    } catch { return []; }
  });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    // Next's development server may normalize request.url to localhost even
    // when the browser used 127.0.0.1. Host retains the actual request authority.
    return (
      source.host === (request.headers.get("host") || target.host) &&
      source.protocol === target.protocol
    );
  } catch {
    return false;
  }
}
