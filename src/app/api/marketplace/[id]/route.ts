import { marketplaceDb, publicListingColumns, sameOrigin } from "@/lib/marketplace-server";
import { z } from "zod";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return Response.json({ error: "Listing not found." }, { status: 404 });
  try {
    const db = await marketplaceDb();
    const { data, error } = await db
      .from("vehicle_listings")
      .select(publicListingColumns)
      .eq("id", id)
      .maybeSingle();
    if (error || !data)
      return Response.json({ error: "Listing not found or no longer available." }, { status: 404 });
    return Response.json({ listing: data });
  } catch {
    return Response.json(
      { error: "Couldn't load this listing. Please try again." },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  const { id } = await params;
  const db = await marketplaceDb();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  const body = z
    .object({ status: z.enum(["active", "sold", "archived"]) })
    .safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid listing status." }, { status: 400 });
  const { data, error } = await db
    .from("vehicle_listings")
    .update(body.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();
  if (error || !data)
    return Response.json({ error: "Couldn't update this listing." }, { status: 404 });
  return Response.json({ id });
}
