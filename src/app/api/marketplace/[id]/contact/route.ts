import { marketplaceDb, privateListingHeaders } from "@/lib/marketplace-server";
import { z } from "zod";

type Context = { params: Promise<{ id: string }> };
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: privateListingHeaders });
const validId = (id: string) => z.string().uuid().safeParse(id).success;

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!validId(id)) return json({ error: "Listing not found." }, 404);

  try {
    const db = await marketplaceDb();
    const {
      data: { user },
      error: authError,
    } = await db.auth.getUser();
    if (authError || !user) return json({ error: "Sign in to call this seller." }, 401);

    const { data: listing, error: listingError } = await db
      .from("vehicle_listings")
      .select("id,user_id,status,buyer_call_enabled")
      .eq("id", id)
      .maybeSingle();
    if (listingError) return json({ error: "Couldn't check seller call availability." }, 503);
    if (!listing || listing.status !== "active")
      return json({ error: "This listing is not available for calls." }, 404);
    if (listing.user_id === user.id)
      return json({ error: "You can't call yourself from your own listing." }, 403);
    if (!listing.buyer_call_enabled)
      return json({ error: "This seller hasn't enabled calls. Use Chat Now instead." }, 403);

    const { data: phone, error: phoneError } = await db.rpc("marketplace_seller_phone", {
      p_listing: id,
    });
    if (phoneError) return json({ error: "Couldn't load the seller's number. Please try again." }, 503);
    if (typeof phone !== "string")
      return json({ error: "This seller's number is unavailable. Use Chat Now instead." }, 404);
    return json({ phone });
  } catch {
    return json({ error: "Couldn't load the seller's number. Please try again." }, 503);
  }
}
