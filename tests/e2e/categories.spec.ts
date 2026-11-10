import { test, expect } from "@playwright/test";
test("public catalog returns published category details", async ({ request }) => {
  const response = await request.get("/api/categories");
  expect(response.status()).toBe(200);
  const categories = await response.json();
  expect(categories.length).toBeGreaterThanOrEqual(6);
  for (const category of categories) {
    expect(category.is_active).toBe(true);
    expect(category.image_url).toBeTruthy();
    expect(category.types.length).toBeGreaterThan(0);
  }
});
test("category management API rejects unauthenticated reads and writes", async ({ request }) => {
  expect((await request.get("/api/admin/categories")).status()).toBe(403);
  expect(
    (await request.post("/api/admin/categories", { data: { id: "forbidden" } })).status(),
  ).toBe(403);
  expect(
    (
      await request.patch("/api/admin/categories", { data: { id: "toys", name: "Forbidden" } })
    ).status(),
  ).toBe(403);
});
