import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryInputSchema, categorySlug } from "../../src/lib/category-input.ts";
const valid = {
  id: "school-bags",
  name: "School bags",
  description: "Pre-loved school bags and backpacks.",
  image_url: "/sell-categories/toys.webp",
  types: ["Backpacks", "Lunch bags"],
  preparation: "Clean the bag and describe any damage.",
};
test("category editor validates defaults and normalizes names for stable URLs", () => {
  const value = categoryInputSchema.parse(valid);
  assert.equal(value.is_active, true);
  assert.equal(value.accent_color, "#e3efff");
  assert.equal(categorySlug("  School Bags & Backpacks! "), "school-bags-backpacks");
});
test("category editor rejects malformed URLs, missing images and invalid item examples", () => {
  for (const change of [
    { id: "../admin" },
    { id: "School Bags" },
    { image_url: "" },
    { types: [] },
    { types: Array(51).fill("Toy") },
    { sort_order: -1 },
    { accent_color: "red" },
    { description: "short" },
  ])
    assert.equal(categoryInputSchema.safeParse({ ...valid, ...change }).success, false);
});
