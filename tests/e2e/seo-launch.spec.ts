import { expect, test } from "@playwright/test";

const publicPages = [
  "/",
  "/sell/toys",
  "/sell/books",
  "/sell/clothing",
  "/sell/gear",
  "/sell/cycles",
  "/sell/electronics",
  "/pickup",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

test("every public page and its internal navigation resolve without a 404", async ({
  page,
  request,
}) => {
  const destinations = new Set<string>(publicPages);

  for (const path of publicPages) {
    const response = await page.goto(path);
    expect(response?.status(), `Expected ${path} to resolve`).toBeLessThan(400);

    for (const href of await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") || ""))) {
      if (href.startsWith("/") && !href.startsWith("//")) {
        destinations.add(href.split("#")[0].split("?")[0] || "/");
      }
    }
  }

  for (const path of destinations) {
    const response = await request.get(path);
    expect(response.status(), `Internal link ${path} returned ${response.status()}`).toBeLessThan(
      400,
    );
  }
});

test("launch SEO files, metadata and the 404 recovery page are available", async ({
  page,
  request,
}) => {
  const [robots, sitemap] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
  ]);
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap: https://www.zapiboo.com/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapXml = await sitemap.text();
  for (const path of publicPages) {
    expect(sitemapXml).toContain(`https://www.zapiboo.com${path === "/" ? "" : path}`);
  }

  await page.goto("/contact");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.zapiboo.com/contact",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
  await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute(
    "content",
    /max-image-preview:large/,
  );

  const missing = await page.goto("/this-page-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "We could not find that page." }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Helpful pages" }).getByRole("link"),
  ).toHaveCount(4);
});
