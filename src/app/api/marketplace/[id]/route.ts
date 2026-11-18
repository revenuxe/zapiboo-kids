import { marketplaceDb, publicListingColumns, ownerListingColumns, privateListingHeaders, listingPhotoPaths, sameOrigin } from "@/lib/marketplace-server";
import { listingSchema, type VehicleListing } from "@/lib/marketplace";
import { optimizeListingPhoto } from "@/lib/listing-photo";
import { z } from "zod";
type Context = { params: Promise<{ id: string }> };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: privateListingHeaders });
const validId = (id: string) => z.string().uuid().safeParse(id).success;

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  if (!validId(id)) return json({ error: "Listing not found." }, 404);
  try {
    const db = await marketplaceDb();
    const owner = new URL(request.url).searchParams.get("owner") === "true";
    let query = db.from("vehicle_listings").select(owner ? ownerListingColumns : publicListingColumns).eq("id", id);
    if (owner) {
      const { data: { user } } = await db.auth.getUser();
      if (!user) return json({ error: "Please sign in." }, 401);
      query = query.eq("user_id", user.id);
    }
    const { data, error } = await query.maybeSingle();
    if (error || !data) return json({ error: "Listing not found or no longer available." }, 404);
    return json({ listing: data });
  } catch { return json({ error: "Couldn't load this listing. Please try again." }, 503); }
}

export async function PATCH(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  const { id } = await params;
  if (!validId(id)) return json({ error: "Listing not found." }, 404);
  try {
    const db = await marketplaceDb();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return json({ error: "Please sign in." }, 401);
    const body = z.object({ status: z.enum(["pending", "sold", "archived"]) }).strict().safeParse(await request.json().catch(() => null));
    if (!body.success) return json({ error: "Choose a valid listing action." }, 400);
    const { data, error } = await db.from("vehicle_listings").update(body.data)
      .eq("id", id).eq("user_id", user.id).select(ownerListingColumns).maybeSingle();
    if (error || !data) return json({ error: "Couldn't update this listing. Only a live listing can be marked sold." }, 400);
    return json({ listing: data });
  } catch { return json({ error: "Couldn't update your listing. Please try again." }, 503); }
}

export async function PUT(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  const { id } = await params;
  if (!validId(id)) return json({ error: "Listing not found." }, 404);
  if (Number(request.headers.get("content-length")) > 12 * 1024 * 1024) return json({ error: "Please upload smaller photos." }, 413);
  const db = await marketplaceDb();
  const uploaded: string[] = [];
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return json({ error: "Please sign in." }, 401);
    const { data: current, error: loadError } = await db.from("vehicle_listings").select(ownerListingColumns).eq("id", id).eq("user_id", user.id).returns<VehicleListing[]>().maybeSingle();
    if (loadError || !current) return json({ error: "Listing not found." }, 404);
    const form = await request.formData();
    const details = JSON.parse(String(form.get("listing")));
    const parsed = listingSchema.safeParse({ ...details, id, phone: "9999999999", consent: true });
    if (!parsed.success) return json({ error: parsed.error.issues[0].message }, 400);
    const retained = z.array(z.string()).max(8).safeParse(JSON.parse(String(form.get("retainedPhotos"))));
    const files = form.getAll("photos").filter((file): file is File => file instanceof File);
    if (!retained.success || retained.data.some(url => !current.photos.includes(url)) ||
        new Set(retained.data).size !== retained.data.length ||
        retained.data.length + files.length < 1 || retained.data.length + files.length > 8 ||
        files.some(file => file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      return json({ error: "Keep 1-8 photos. New photos must be JPG, PNG or WebP under 2 MB." }, 400);
    }
    const total = retained.data.length + files.length;
    const order = z.array(z.number().int().min(0).max(total-1)).length(total).safeParse(JSON.parse(String(form.get("photoOrder"))));
    if (!order.success || new Set(order.data).size !== total) return json({ error: "Invalid photo order." }, 400);
    const urls = [...retained.data];
    for (const file of files) {
      const buffer = await optimizeListingPhoto(Buffer.from(await file.arrayBuffer()));
      const path = `${user.id}/${id}/${crypto.randomUUID()}.webp`;
      const { error } = await db.storage.from("vehicle-listing-photos").upload(path, buffer, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) throw new Error("Couldn't upload your photo. Please try again.");
      uploaded.push(path);
      urls.push(db.storage.from("vehicle-listing-photos").getPublicUrl(path).data.publicUrl);
    }
    const { id: _id, phone: _phone, consent: _consent, ...listing } = parsed.data;
    let update = db.from("vehicle_listings").update({ ...listing, photos: order.data.map(index => urls[index]), status: "pending" }).eq("id", id).eq("user_id", user.id);
    // Refuse to overwrite an admin decision or an edit made in another tab.
    if (details.updated_at) update = update.eq("updated_at", details.updated_at);
    const { data, error } = await update.select(ownerListingColumns).maybeSingle();
    if (error) throw new Error("Couldn't save changes. Please try again.");
    if (!data) {
      if (uploaded.length) await db.storage.from("vehicle-listing-photos").remove(uploaded);
      return json({ error: "This listing changed since you opened it. Reload before editing again." }, 409);
    }
    uploaded.length = 0;
    const removed = listingPhotoPaths(current.photos.filter((url: string) => !urls.includes(url)), user.id, id);
    if (removed.length) await db.storage.from("vehicle-listing-photos").remove(removed).catch(() => {});
    return json({ listing: data });
  } catch (error) {
    if (uploaded.length) await db.storage.from("vehicle-listing-photos").remove(uploaded).catch(() => {});
    return json({ error: error instanceof SyntaxError ? "Invalid listing details." : error instanceof Error ? error.message : "Couldn't save changes." }, 400);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  const { id } = await params;
  if (!validId(id)) return json({ error: "Listing not found." }, 404);
  try {
    const db = await marketplaceDb();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return json({ error: "Please sign in." }, 401);
    const { data, error } = await db.from("vehicle_listings").delete().eq("id", id).eq("user_id", user.id).select("photos").maybeSingle();
    if (error || !data) return json({ error: "Couldn't delete this listing." }, 404);
    const paths = listingPhotoPaths(data.photos, user.id, id);
    if (paths.length) await db.storage.from("vehicle-listing-photos").remove(paths).catch(() => {});
    return json({ deleted: true });
  } catch { return json({ error: "Couldn't delete this listing. Please try again." }, 503); }
}
