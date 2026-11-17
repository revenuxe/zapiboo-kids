import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = readFileSync(new URL("../../src/lib/pickup-summary.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { pickupCategory, isKidsPickup, pickupCondition } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("historical requests retain submitted labels after the selling catalogue is removed", () => {
  const lead = {
    vehicle_type: "custom",
    selling_category_id: "custom",
    lead_type: "kids_pickup",
    items: ["Original submitted category", "Condition: Good"],
  };
  assert.equal(pickupCategory(lead).name, "Original submitted category");
  assert.equal(isKidsPickup(lead), true);
  assert.equal(pickupCondition(lead), "Good");
  assert.equal(pickupCategory({ vehicle_type: "toys", items: [] }).name, "Toys & games");
});

test("service enquiries and repair requests are excluded from historical pickup counts", () => {
  assert.equal(
    isKidsPickup({ vehicle_type: "query", items: ["Toys & games"], lead_type: "query" }),
    false,
  );
  assert.equal(
    isKidsPickup({ vehicle_type: "toys", items: [], lead_type: "repair_booking" }),
    false,
  );
});
