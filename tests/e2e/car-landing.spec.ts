import { test, expect } from "@playwright/test";
test("old car landing redirects permanently to the current kids category", async ({ request }) => {
  const r = await request.get("/sell-used-car-bangalore", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers().location).toBe("/sell/toys");
});
test("category landing has no automotive registration form", async ({ page }) => {
  await page.goto("/sell-used-car-bangalore");
  await expect(page).toHaveURL(/\/sell\/toys$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("toys & games");
  await expect(page.getByLabel(/registration number/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Start selling", exact: true })).toHaveAttribute(
    "href",
    "/pickup?category=toys",
  );
});
