import { marketplaceDb, ownerListingColumns, sameOrigin, privateListingHeaders } from "@/lib/marketplace-server";
import { z } from "zod";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: privateListingHeaders });
async function adminSession() {
  const db = await marketplaceDb();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { response: json({ error: "Please sign in." }, 401) };
  const { data, error } = await db.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  if (error || !data) return { response: json({ error: "Admin access required." }, 403) };
  return { db };
}
export async function GET(request: Request) {
  try {
    const session = await adminSession();
    if (session.response) return session.response;
    const params = new URL(request.url).searchParams;
    const status = z.enum(["pending", "active", "rejected", "sold", "archived", "all"]).catch("pending").parse(params.get("status"));
    const page = Math.max(0, Math.min(10000, Number(params.get("page")) || 0));
    let query = session.db!.from("vehicle_listings").select(ownerListingColumns, { count: "exact" }).order("created_at", { ascending: false }).range(page * 30, page * 30 + 29);
    if (status !== "all") query = query.eq("status", status);
    const search = (params.get("search") ?? "").trim().slice(0, 100).replace(/[%_]/g, "");
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error, count } = await query;
    if (error) return json({ error: "Couldn't load the review queue. Check that the listing approval migration is installed." }, 503);
    return json({ listings: data, total: count ?? 0 });
  } catch { return json({ error: "Couldn't load listings. Please try again." }, 503); }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  try {
    const session = await adminSession();
    if (session.response) return session.response;
    const parsed = z.object({
      id: z.string().uuid(), action: z.enum(["approve", "reject"]),
      reason: z.string().trim().max(500).optional(), updated_at: z.string().datetime({ offset: true }),
    }).strict().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return json({ error: "Invalid review details. Refresh the queue and try again." }, 400);
    const { id, action, reason, updated_at } = parsed.data;
    if (action === "reject" && (!reason || reason.length < 5)) return json({ error: "Add a reason of at least 5 characters so the seller knows what to fix." }, 400);
    const { data, error } = await session.db!.from("vehicle_listings")
      .update({ status: action === "approve" ? "active" : "rejected", rejection_reason: action === "reject" ? reason : null })
      .eq("id", id).eq("updated_at", updated_at).in("status", action === "approve" ? ["pending"] : ["pending", "active"])
      .select(ownerListingColumns).maybeSingle();
    if (error) return json({ error: "Couldn't save this decision. Please try again." }, 503);
    if (!data) return json({ error: "This listing has changed. Refresh the queue before reviewing it." }, 409);
    return json({ listing: data });
  } catch { return json({ error: "Couldn't save this decision. Please try again." }, 503); }
}
