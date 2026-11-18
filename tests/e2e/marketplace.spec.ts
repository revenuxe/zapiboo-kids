import { test, expect } from "@playwright/test";
import path from "node:path";
import { listingSchema } from "../../src/lib/marketplace";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/marketplace", (r) =>
    r.request().method() === "GET"
      ? r.fulfill({ json: { listings: [], available: false } })
      : r.continue(),
  );
});

test("category cards lead to their marketplace and preserve seller category", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#sell-categories")
    .getByRole("link", { name: /Sell Used Bikes/ })
    .click();
  await expect(page).toHaveURL(/marketplace\?category=used-bikes/);
  await expect(page.locator(".mp-card")).toHaveCount(2);
  await expect(page.locator(".mp-results h2")).toContainText("Used Bikes");
  await page.getByRole("link", { name: "List your vehicle", exact: true }).click();
  await expect(page.locator(".mp-selected-category strong")).toContainText("Bikes");
  await expect(page.locator(".mp-form-categories")).toHaveCount(0);
});

test("search, price sorting, saved vehicles and persistence work", async ({ page }) => {
  await page.goto("/marketplace");
  await expect(page.locator(".mp-card")).toHaveCount(9);
  await page.getByRole("textbox", { name: "Search vehicles", exact: true }).fill("Swift");
  await expect(page.locator(".mp-card")).toHaveCount(2);
  await page.getByLabel("Sort vehicles").selectOption("price-low");
  await expect(page.locator(".mp-card h3").first()).toContainText("Swift ZXi");
  await page.getByRole("button", { name: "Save Maruti Suzuki Swift ZXi", exact: true }).click();
  await page.getByRole("tab", { name: /Saved/ }).click();
  await expect(page.locator(".mp-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".mp-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Unsave Maruti Suzuki Swift ZXi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your shortlist starts here." })).toBeVisible();
});

test("mobile filters are usable and have no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/marketplace");
  await expect(page.locator(".mp-card")).toHaveCount(9);
  await page.getByRole("button", { name: "Open filters", exact: true }).click();
  await page.getByLabel("Maximum price").fill("80000");
  await page.getByRole("button", { name: /Show 4 vehicles/ }).click();
  await expect(page.locator(".mp-card")).toHaveCount(4);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("seller can complete all steps, restore draft and reach sign-in without losing photos", async ({
  page,
}) => {
  await page.goto("/marketplace/sell?category=used-bikes");
  await page.getByLabel("Brand", { exact: false }).fill("Hero");
  await page.getByLabel("Model / variant", { exact: false }).fill("Splendor Plus");
  await page.getByLabel("Registration year", { exact: false }).fill("2022");
  await page.getByLabel("Kilometres driven", { exact: false }).fill("12000");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Give buyers the full picture." })).toBeVisible();
  await page
    .locator("input[type=file]")
    .setInputFiles(path.resolve("public/vehicles/used-bikes-cutout.webp"));
  await expect(page.getByAltText("Vehicle photo 1")).toBeVisible();
  await page
    .getByLabel("Listing title", { exact: false })
    .fill("2022 Hero Splendor Plus - single owner");
  await page
    .locator("textarea")
    .fill(
      "Single owner motorcycle with regular servicing. Available for inspection in Indiranagar. Minor scratches on the fuel tank.",
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Asking price", { exact: false }).fill("65000");
  await page.getByLabel("Bangalore neighbourhood", { exact: false }).fill("Indiranagar");
  await expect(page.getByLabel("Your name", { exact: false })).toHaveCount(0);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: /One quick sign-in/ })).toBeVisible();
  await expect(page.getByLabel("Email address", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Your name", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /One quick sign-in/ })).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Asking price", { exact: false })).toHaveValue("65000");
  await page.getByRole("button", { name: "Your vehicle", exact: true }).click();
  await expect(page.getByLabel("Brand", { exact: false })).toHaveValue("Hero");
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("zapiboo-vehicle-draft-v1")!).photos[0].startsWith(
        "data:image/webp",
      ),
    ),
  ).toBeTruthy();
});

test("listing details are transparent about examples and can be saved", async ({ page }) => {
  await page.goto("/marketplace/preview-1");
  await expect(
    page.getByRole("heading", { name: "Maruti Suzuki Swift VXi", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".mp-preview-notice")).toContainText("not offered for sale");
  await expect(page.locator(".mp-demo-contact")).toBeVisible();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("server validation rejects malformed listing fields", () => {
  const input = {
    id: crypto.randomUUID(),
    category: "used-bikes",
    title: "Hero Splendor Plus",
    description: "Well maintained motorcycle with full service history.",
    brand: "Hero",
    model: "Splendor",
    year: 2022,
    mileage: 12000,
    price: 65000,
    fuel: "Petrol",
    transmission: "Manual",
    owners: "1st owner",
    location: "Indiranagar",
    seller_name: "Seller",
    phone: "9886579923",
    negotiable: true,
    consent: true,
  };
  expect(listingSchema.safeParse(input).success).toBeTruthy();
  for (const invalid of [
    { price: -1 },
    { phone: "123" },
    { category: "invalid" },
    { consent: false },
    { mileage: -1 },
    { year: 1900 },
  ])
    expect(listingSchema.safeParse({ ...input, ...invalid }).success).toBeFalsy();
});

test("write endpoints reject cross-origin requests and require a signed-in seller", async ({
  request,
}) => {
  const cross = await request.post("/api/marketplace", {
    headers: { Origin: "https://unrelated.example" },
    data: {},
  });
  expect(cross.status()).toBe(403);
  const same = await request.post("/api/marketplace", {
    headers: { Origin: "http://127.0.0.1:3000" },
    data: {},
  });
  expect(same.status()).toBe(401);
});

test("failed listing sign-in retains the draft and stays before seller details", async ({
  page,
}) => {
  await page.goto("/marketplace/sell");
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "zapiboo-vehicle-draft-v1",
      JSON.stringify({ step: 3, price: "65000", location: "Indiranagar" }),
    ),
  );
  await page.reload();
  await page.route("**/auth/v1/token**", (r) =>
    r.fulfill({
      status: 400,
      json: {
        error: "invalid_grant",
        error_description: "Invalid login credentials",
        msg: "Invalid login credentials",
      },
    }),
  );
  await page.getByLabel("Email address", { exact: true }).fill("incorrect@example.com");
  await page.getByLabel("Password", { exact: true }).fill("invalid-password");
  await page.getByRole("button", { name: "Sign in & continue", exact: true }).click();
  await expect(page.locator(".mp-auth-error")).toContainText("Invalid login credentials");
  await expect(page.getByLabel("Your name", { exact: false })).toHaveCount(0);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("zapiboo-vehicle-draft-v1")!).price),
  ).toBe("65000");
});

test("restoring review while signed out requires authentication first", async ({ page }) => {
  await page.goto("/marketplace/sell");
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("zapiboo-vehicle-draft-v1", JSON.stringify({ step: 4, price: "65000" })),
  );
  await page.reload();
  await expect(page.getByRole("heading", { name: /One quick sign-in/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Publish my listing", exact: true })).toHaveCount(
    0,
  );
});

test("account creation waits for email confirmation and keeps the listing", async ({ page }) => {
  await page.goto("/marketplace/sell");
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "zapiboo-vehicle-draft-v1",
      JSON.stringify({ step: 3, price: "65000", location: "Indiranagar" }),
    ),
  );
  await page.reload();
  await page.route("**/auth/v1/signup**", (r) =>
    r.fulfill({
      status: 200,
      json: {
        id: "11111111-1111-4111-8111-111111111111",
        aud: "authenticated",
        role: "authenticated",
        email: "new@example.com",
        identities: [],
        app_metadata: { provider: "email", providers: ["email"] },
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    }),
  );
  await page.getByRole("tab", { name: "Create account", exact: true }).click();
  await page.getByLabel("Email address", { exact: true }).fill("new@example.com");
  await page.getByLabel("Password", { exact: true }).fill("secure-password");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.locator(".mp-auth-notice")).toContainText("Check your email");
  await expect(page.getByLabel("Your name", { exact: false })).toHaveCount(0);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("zapiboo-vehicle-draft-v1")!).price),
  ).toBe("65000");
});

test("failed OAuth callback returns to the saved listing with a recoverable error", async ({
  page,
}) => {
  await page.goto("/marketplace/sell");
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("zapiboo-vehicle-draft-v1", JSON.stringify({ step: 3, price: "65000" })),
  );
  await page.goto("/auth/callback?next=%2Fmarketplace%2Fsell");
  await expect(page).toHaveURL(/marketplace\/sell/);
  await expect(page.locator(".mp-auth-error")).toContainText("couldn't be completed");
});

test("category-specific listing is focused and can switch to the full list", async ({ page }) => {
  await page.goto("/marketplace/sell?category=used-cars");
  await expect(page.locator(".mp-selected-category strong")).toHaveText("Used Cars");
  await expect(page.locator(".mp-form-categories")).toHaveCount(0);
  await page.getByRole("button", { name: "Change vehicle type", exact: true }).click();
  await expect(page.locator(".mp-form-categories button")).toHaveCount(6);
  await page
    .locator(".mp-form-categories")
    .getByRole("button", { name: "Bikes", exact: true })
    .click();
  await expect(page.locator(".mp-selected-category strong")).toHaveText("Used Bikes");
  await expect(page).toHaveURL(/category=used-bikes/);
  await page.reload();
  await expect(page.locator(".mp-selected-category strong")).toHaveText("Used Bikes");
});

test("generic listing starts with all vehicle categories", async ({ page }) => {
  await page.goto("/marketplace/sell");
  await expect(page.locator(".mp-form-categories button")).toHaveCount(6);
});

test("Google button starts OAuth and preserves the selected category and draft", async ({
  page,
}) => {
  await page.goto("/marketplace/sell?category=used-cars");
  await expect(page.getByText("Draft saved on this device", { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "zapiboo-vehicle-draft-v1",
      JSON.stringify({ step: 3, category: "used-cars", price: "525000", location: "Indiranagar" }),
    ),
  );
  await page.reload();
  let callback = "";
  await page.route("**/auth/v1/authorize**", async (r) => {
    const url = new URL(r.request().url());
    expect(url.searchParams.get("provider")).toBe("google");
    callback = url.searchParams.get("redirect_to") ?? "";
    await r.fulfill({ contentType: "text/html", body: "<h1>Google authorization handoff</h1>" });
  });
  await page.getByRole("button", { name: "Continue with Google", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Google authorization handoff" })).toBeVisible();
  const next = new URL(callback).searchParams.get("next");
  expect(next).toBe("/marketplace/sell?category=used-cars");
  await page.goto("/marketplace/sell?category=used-cars");
  await expect(page.getByRole("heading", { name: /One quick sign-in/ })).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("zapiboo-vehicle-draft-v1")!).price),
  ).toBe("525000");
});
