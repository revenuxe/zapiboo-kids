import path from "node:path";
import sharp from "sharp";
import { sellingCategories } from "@/lib/selling-categories";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return sellingCategories.map(({ id }) => ({ category: id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  if (!sellingCategories.some(({ id }) => id === category)) {
    return new Response("Not found", { status: 404 });
  }
  const image = await sharp(
    path.join(process.cwd(), "public", "sell-categories", `${category}.webp`),
  )
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
