import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 375, height: 812 } });

test("contact form accepts enquiries with phone optional", async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await page.route("**/rest/v1/leads*", async (route) => {
    if (route.request().method() === "POST") payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: null });
  });
  await page.goto("/contact");
  await page.locator("#cname").fill("Leela Kumar");
  await page.locator("#cemail").fill("leela.kumar@example.com");
  await page.locator("#csubject").fill("Kids book collection");
  await page.locator("#cmsg").fill("I would like to sell a collection of picture books.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect.poll(() => payload?.lead_type).toBe("query");
  expect(payload?.phone).toBe("Not provided");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#cname")).toHaveValue("");
});

test("public pages show active phone and WhatsApp support without closed notices", async ({
  page,
}) => {
  for (const path of ["/", "/contact", "/sell/toys", "/areas/kalyan-nagar"]) {
    await page.goto(path);
    await expect(page.locator('a[href="tel:+919886579923"]').first()).toBeAttached();
    await expect(page.locator('a[href^="https://wa.me/919886579923"]').first()).toBeAttached();
    await expect(page.locator('a[href="#service-opening-soon"]')).toHaveCount(0);
    await expect(
      page.getByText(
        /Sorry, we.*not open|Pickup service is opening soon|Phone support opening soon/,
      ),
    ).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});

test("pickup still requires authentication before collecting address and schedule", async ({
  page,
}) => {
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
  await expect(page.getByRole("heading", { name: "Where in Bengaluru?", exact: true })).toHaveCount(
    0,
  );
  expect(writes).toBe(0);
});
