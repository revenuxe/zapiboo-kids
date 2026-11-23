import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import ts from "typescript";
import sharp from "sharp";

const source = readFileSync(
  new URL("../../src/lib/family-service-catalog.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { familyServices } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("each vehicle category has a distinct, readable local illustration with an opaque light background", async () => {
  assert.equal(familyServices.length, 6);
  assert.equal(new Set(familyServices.map((service) => service.image_url)).size, 6);
  for (const service of familyServices) {
    assert.ok(service.image_url.startsWith(`/vehicles/${service.id}`));
    const metadata = await sharp(`public${service.image_url}`).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.hasAlpha, false);
    const { data } = await sharp(`public${service.image_url}`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.ok(data[0] > 235 && data[1] > 235 && data[2] > 235, "Image corner must have a baked-in light background");
    assert.ok(metadata.width >= 560, `${service.name} is too small for the listing`);
    assert.ok(metadata.width <= 1024, `${service.name} exceeds the intended image dimensions`);
    assert.ok(
      statSync(`public${service.image_url}`).size <= 90 * 1024,
      `${service.name} exceeds the 90 KiB image budget`,
    );
  }
});
