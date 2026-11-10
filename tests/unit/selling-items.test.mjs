import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("../../src/lib/selling-categories.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { sellingCategories, validateSellingItem, sellingItemPayload } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const validItem = { category: "toys", condition: "Good", description: " Two pieces missing. " };

test("each category needs only condition; notes and a photo are optional", () => {
  for (const category of sellingCategories)
    assert.equal(
      validateSellingItem({ category: category.id, condition: "Good", description: "" }),
      null,
    );
});

test("rejects obsolete vehicle categories, invalid conditions and oversized notes", () => {
  for (const changes of [
    { category: "car" },
    { condition: "" },
    { condition: "Broken" },
    { description: "x".repeat(1001) },
  ]) {
    assert.equal(typeof validateSellingItem({ ...validItem, ...changes }), "string");
    assert.throws(() => sellingItemPayload({ ...validItem, ...changes }));
  }
});

test("booking payload retains only category, condition and optional notes without vehicle foreign keys", () => {
  const payload = sellingItemPayload(validItem);
  assert.equal(payload.model_name, null);
  assert.equal(payload.brand_name, null);
  assert.equal(payload.message, "Two pieces missing.");
  assert.deepEqual(payload.items, ["Toys & games", "Condition: Good"]);
  for (const key of [
    "registration_number",
    "manufacture_year",
    "brand_id",
    "model_id",
    "variant_id",
  ])
    assert.equal(payload[key], null);
});

test("custom published categories validate and carry stable IDs in pickup payloads", () => {
  const catalog = [
    {
      id: "school-bags",
      name: "School bags",
      description: "Kids bags and backpacks.",
      types: ["Backpacks"],
      preparation: "Clean and describe any wear.",
      is_active: true,
    },
  ];
  const item = { category: "school-bags", condition: "Good", description: "Two school bags." };
  assert.equal(validateSellingItem(item, catalog), null);
  const payload = sellingItemPayload(item, catalog);
  assert.equal(payload.selling_category_id, "school-bags");
  assert.equal(payload.lead_type, "kids_pickup");
  assert.equal(payload.vehicle_type, "School bags");
  assert.equal(validateSellingItem(item), "Choose the category of items you want to sell.");
  assert.equal(
    validateSellingItem(item, [{ ...catalog[0], is_active: false }]),
    "Choose the category of items you want to sell.",
  );
});
