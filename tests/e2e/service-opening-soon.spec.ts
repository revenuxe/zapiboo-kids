import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 375, height: 812 } });
test("paused contact form opens notice without collecting input", async ({ page }) => {
  await page.goto("/contact");
  await page.locator("#cname").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#cname")).toHaveValue("");
  await page.getByRole("button", { name: "Got it, thank you" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("support links open paused-service notice", async ({ page }) => {
  await page.goto("/contact");
  await page.getByText("Phone support opening soon").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/contact$/);
});
test("pickup reaches sign-in after condition without creating a request", async ({ page }) => {
  let writes = 0;
  await page.route("**/rest/v1/leads*", async (route) => {
    if (route.request().method() === "POST") writes++;
    await route.fulfill({ json: [] });
  });
  await page.goto("/pickup?category=toys");
  await page.getByLabel("Condition", { exact: false }).click();
  await page.getByRole("option", { name: "Good", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Sign in", exact: true })).toBeVisible();
  expect(writes).toBe(0);
});
