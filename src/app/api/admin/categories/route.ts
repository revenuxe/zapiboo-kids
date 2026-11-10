import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { categoryCacheTag } from "@/lib/selling-catalog-server";
import { categoryInputSchema } from "@/lib/category-input";
import { supabaseConfig } from "@/integrations/supabase/config";

async function authorizedClient() {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: role, error: roleError } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !roleError && role ? client : null;
}
export async function GET() {
  const client = await authorizedClient();
  if (!client) return Response.json({ error: "Admin access required." }, { status: 403 });
  const { data, error } = await client
    .from("selling_categories")
    .select("*")
    .order("sort_order")
    .order("id");
  if (error) return Response.json({ error: "Could not load categories." }, { status: 503 });
  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
async function save(request: Request) {
  const origin = request.headers.get("origin");
  let sameOrigin = !origin;
  try {
    if (origin) {
      const source = new URL(origin);
      const target = new URL(request.url);
      const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
      const localPreview = loopbackHosts.has(source.hostname) && loopbackHosts.has(target.hostname) && source.port === target.port;
      sameOrigin = source.origin === target.origin || localPreview;
    }
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const client = await authorizedClient();
  if (!client) return Response.json({ error: "Admin access required." }, { status: 403 });
  let input;
  try {
    const text = await request.text();
    if (text.length > 64000)
      return Response.json({ error: "Category details are too large." }, { status: 413 });
    input = categoryInputSchema.safeParse(JSON.parse(text));
  } catch {
    return Response.json({ error: "Invalid category details." }, { status: 400 });
  }
  if (!input.success)
    return Response.json(
      { error: input.error.issues[0]?.message || "Invalid category details." },
      { status: 400 },
    );
  const value = input.data;
  const storagePrefix = `${supabaseConfig().url}/storage/v1/object/public/category-images/`;
  if (
    !value.image_url.startsWith(storagePrefix) &&
    !/^\/sell-categories\/[a-z0-9-]+\.webp$/.test(value.image_url)
  )
    return Response.json({ error: "Use an uploaded category image." }, { status: 400 });
  const { id, ...fields } = value;
  const result =
    request.method === "POST"
      ? await client.from("selling_categories").insert(value).select("id").single()
      : await client.from("selling_categories").update(fields).eq("id", id).select("id").single();
  if (result.error)
    return Response.json(
      {
        error:
          result.error.code === "23505"
            ? "That category URL already exists. Choose another URL."
            : "Could not save category. Please try again.",
      },
      { status: result.error.code === "23505" ? 409 : 400 },
    );
  revalidateTag(categoryCacheTag, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ id });
}
export const POST = save;
export const PATCH = save;
