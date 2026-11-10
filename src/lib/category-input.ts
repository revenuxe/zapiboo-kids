import { z } from "zod";
export const categoryInputSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens for the URL."),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(600),
  image_url: z.string().min(1, "Upload a category image.").max(2000),
  tagline: z.string().trim().max(100).default(""),
  accent_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#e3efff"),
  types: z
    .array(z.string().trim().min(1).max(120))
    .min(1, "Add at least one item example.")
    .max(50),
  preparation: z.string().trim().min(10).max(2000),
  intro: z.string().trim().max(2000).default(""),
  seo_title: z.string().trim().max(120).default(""),
  seo_description: z.string().trim().max(300).default(""),
  sort_order: z.number().int().min(0).max(9999).default(0),
  is_active: z.boolean().default(true),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export function categorySlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
