import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
export async function GET() {
  try {
    return Response.json(await getPublicSellingCategories(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Could not load categories." }, { status: 503 });
  }
}
