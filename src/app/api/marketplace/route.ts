import { marketplaceDb, publicListingColumns, sameOrigin } from "@/lib/marketplace-server";
import { listingSchema } from "@/lib/marketplace";
import sharp from "sharp";

export async function GET(request: Request) {
  try {
    const db = await marketplaceDb();
    const query = new URL(request.url).searchParams;
    let listings = db
      .from("vehicle_listings")
      .select(publicListingColumns)
      .order("created_at", { ascending: false })
      .limit(500);
    if (query.get("mine") === "true") {
      const {
        data: { user },
      } = await db.auth.getUser();
      if (!user) return Response.json({ error: "Sign in to see your listings." }, { status: 401 });
      listings = listings.eq("user_id", user.id);
    } else listings = listings.eq("status", "active");
    const { data, error } = await listings;
    if (error)
      return Response.json({
        listings: [],
        available: false,
        error: "Live listings are temporarily unavailable.",
      });
    return Response.json(
      { listings: data, available: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({
      listings: [],
      available: false,
      error: "Live listings are temporarily unavailable.",
    });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 12 * 1024 * 1024)
    return Response.json({ error: "Please upload smaller photos." }, { status: 413 });
  let uploaded: string[] = [];
  const db = await marketplaceDb();
  try {
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user)
      return Response.json({ error: "Sign in before publishing your listing." }, { status: 401 });
    const form = await request.formData();
    const parsed = listingSchema.safeParse(JSON.parse(String(form.get("listing"))));
    if (!parsed.success)
      return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const photos = form.getAll("photos").filter((p): p is File => p instanceof File);
    if (
      !photos.length ||
      photos.length > 8 ||
      photos.some(
        (p) =>
          p.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(p.type),
      )
    )
      return Response.json(
        { error: "Add 1–8 JPG, PNG or WebP photos, up to 2 MB each." },
        { status: 400 },
      );
    const { data: existing, error: readiness } = await db
      .from("vehicle_listings")
      .select("id,user_id")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (readiness)
      return Response.json(
        {
          error:
            "Publishing is not available yet. Your draft stays on this device; please try again later.",
        },
        { status: 503 },
      );
    if (existing) {
      if (existing.user_id !== user.id)
        return Response.json({ error: "Please start a new listing." }, { status: 409 });
      return Response.json({ id: existing.id });
    }
    const { count } = await db
      .from("vehicle_listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 86400000).toISOString());
    if ((count ?? 0) >= 10)
      return Response.json(
        { error: "You can publish up to 10 listings per day." },
        { status: 429 },
      );
    const urls: string[] = [];
    for (const [i, photo] of photos.entries()) {
      const buffer = await sharp(Buffer.from(await photo.arrayBuffer()), {
        limitInputPixels: 40000000,
      })
        .rotate()
        .resize(1280, 960, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 76, effort: 4 })
        .toBuffer();
      const path = `${user.id}/${parsed.data.id}/${i}.webp`;
      const { error } = await db.storage
        .from("vehicle-listing-photos")
        .upload(path, buffer, { contentType: "image/webp", upsert: true });
      if (error)
        throw new Error("We couldn't upload your photos. Your draft is safe; please try again.");
      uploaded.push(path);
      urls.push(db.storage.from("vehicle-listing-photos").getPublicUrl(path).data.publicUrl);
    }
    const { phone, consent: _consent, ...listing } = parsed.data;
    const { error: contactError } = await db
      .from("vehicle_listing_contacts")
      .insert({ listing_id: listing.id, user_id: user.id, phone });
    if (contactError) throw new Error("Couldn't save your contact details. Please try again.");
    const { error } = await db
      .from("vehicle_listings")
      .insert({ ...listing, user_id: user.id, photos: urls });
    if (error) {
      await db
        .from("vehicle_listing_contacts")
        .delete()
        .eq("listing_id", listing.id)
        .eq("user_id", user.id);
      throw new Error("Couldn't publish your listing. Your draft is safe; please try again.");
    }
    uploaded = [];
    return Response.json({ id: listing.id }, { status: 201 });
  } catch (error) {
    if (uploaded.length) await db.storage.from("vehicle-listing-photos").remove(uploaded);
    return Response.json(
      {
        error:
          error instanceof SyntaxError
            ? "Invalid listing details."
            : error instanceof Error
              ? error.message
              : "Couldn't publish your listing.",
      },
      { status: 400 },
    );
  }
}
