import { test, expect } from "@playwright/test";
import { familyServices } from "../../src/lib/family-service-catalog";
test("public catalog returns published category details", async ({ request }) => {
  const response = await request.get("/api/categories");
  expect(response.status()).toBe(200);
  const categories = await response.json();
  expect(categories.length).toBeGreaterThanOrEqual(6);
  for (const category of categories) {
    expect(category.image_url).toBe(
      familyServices.find((service) => service.id === category.id)?.image_url,
    );
    expect(category.image_url).toBeTruthy();
    expect(category.types.length).toBeGreaterThan(0);
  }
});
test("retired inventory management API cannot read or modify inventory", async ({ request }) => {
  expect((await request.get("/api/admin/categories")).status()).toBe(410);
  expect(
    (await request.post("/api/admin/categories", { data: { id: "forbidden" } })).status(),
  ).toBe(405);
  expect(
    (
      await request.patch("/api/admin/categories", { data: { id: "toys", name: "Forbidden" } })
    ).status(),
  ).toBe(405);
});
