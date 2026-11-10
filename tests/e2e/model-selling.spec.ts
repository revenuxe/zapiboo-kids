import { test, expect } from "@playwright/test";
import { sellingModels, modelPath } from "../../src/lib/selling-models";
for (const model of sellingModels)
  test(`${model.slug}: retired model route redirects to a current kids category`, async ({
    request,
  }) => {
    const r = await request.get(modelPath(model), { maxRedirects: 0 });
    expect(r.status()).toBe(308);
    expect(r.headers().location).toBe(
      "/sell/" + { car: "toys", bike: "books", scooter: "clothing" }[model.category],
    );
  });
