import { test, expect } from "@playwright/test";
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
])
  test.describe(`${viewport.width}px navigation`, () => {
    test.use({ viewport });
    test("footer navigation opens next page at top", async ({ page }) => {
      await page.goto("/terms");
      const link = page.locator('footer a[href="/privacy"]').first();
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await expect(page).toHaveURL(/\/privacy$/);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    });
    test("pickup steps reset scroll and preserve category selection", async ({ page }) => {
      await page.goto("/pickup");
      await page.getByRole("button", { name: "Toys & games", exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "Condition & photo", exact: true }),
      ).toBeVisible();
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await page.getByRole("button", { name: "Back", exact: true }).click();
      await expect(page.getByRole("button", { name: "Toys & games", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    });
  });
