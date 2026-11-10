import { test, expect } from "@playwright/test";

test("booking asks only for condition, notes and an optional photo, and restores its draft", async ({
  page,
}) => {
  await page.goto("/pickup?category=toys");
  await expect(page.getByRole("heading", { name: "Condition & photo" })).toBeVisible();
  await expect(page.getByText(/What type of toys|Tell us about your items/)).toHaveCount(0);
  await expect(page.getByLabel(/Item name|Brand|Approximate age|Number of items/)).toHaveCount(0);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Condition & photo" })).toBeVisible();
  await page.getByLabel("Condition", { exact: false }).click();
  await page.getByRole("option", { name: "Good", exact: true }).click();
  await page.getByLabel("Anything else").fill("All pieces included.");
  await page.locator("input[type=file]").setInputFiles("public/sell-categories/toys.webp");
  await expect(page.getByRole("img", { name: "Your items" })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Anything else")).toHaveValue("All pieces included.");
  await expect(page.getByRole("img", { name: "Your items" })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Sign in", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Anything else")).toHaveValue("All pieces included.");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What are you selling?" })).toBeVisible();
});

test("all category pages and legacy redirects lead to kids selling content", async ({ page }) => {
  for (const category of ["toys", "books", "clothing", "gear", "cycles", "electronics"]) {
    const response = await page.goto(`/sell/${category}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("link", { name: "Start selling", exact: true })).toHaveAttribute(
      "href",
      `/pickup?category=${category}`,
    );
  }
  await page.goto("/sell-used-car-bangalore");
  await expect(page).toHaveURL(/\/sell\/toys$/);
  await page.goto("/materials");
  await expect(page).toHaveURL(/\/pickup$/);
});
