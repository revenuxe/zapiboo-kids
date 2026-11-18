import "server-only";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// The new tables are installed by the marketplace migration; keep the existing generated schema intact.
export async function marketplaceDb(): Promise<SupabaseClient> {
  return (await createSupabaseServerClient()) as unknown as SupabaseClient;
}
export const publicListingColumns =
  "id,user_id,category,title,description,brand,model,year,mileage,price,fuel,transmission,owners,location,seller_name,negotiable,photos,status,created_at";
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
