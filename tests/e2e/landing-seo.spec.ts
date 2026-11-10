import { expect, test } from "@playwright/test";

const categories = ["toys", "books", "clothing", "gear", "cycles", "electronics"];

test("category pages expose distinct search content, truthful service schema and working CTAs", async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const category of categories) {
    const path = `/sell/${category}`;
    expect((await page.goto(path))?.status()).toBe(200);
    const title = await page.title();
    expect(title).toContain("Bangalore");
    titles.add(title);
    descriptions.add(
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Bangalore");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.zapiboo.com${path}`,
    );
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.locator(".seller-item-types a")).toHaveCount(12);
    await expect(page.locator(".seller-faq details")).toHaveCount(6);
    for (const href of await page
      .locator(".seller-cta .home-grand-button")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))) {
      expect(href).toBe(`/pickup?category=${category}`);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes.flatMap((node) => {
        const value = JSON.parse(node.textContent || "{}");
        return Array.isArray(value) ? value : [value];
      }),
    );
    expect(schemas.find((schema) => schema["@type"] === "Service")?.url).toBe(
      `https://www.zapiboo.com${path}`,
    );
    expect(schemas.find((schema) => schema["@type"] === "ItemList")?.numberOfItems).toBe(12);
    expect(schemas.some((schema) => schema.aggregateRating || schema.review)).toBe(false);
  }
  expect(titles.size).toBe(6);
  expect(descriptions.size).toBe(6);
});

test("every area has a canonical guide, category links and pincode-preserving CTAs", async ({
  page,
}) => {
  await page.goto("/areas");
  const paths = await page
    .locator('nav[aria-label="All service areas"] a')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!));
  for (const path of paths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.zapiboo.com${path}`,
    );
    await expect(page.locator(".seller-guide-links a")).toHaveCount(6);
    const heroHref = await page.locator(".landing-hero .home-button").getAttribute("href");
    expect(heroHref).toMatch(/^\/pickup\?pincode=\d{6}$/);
    for (const href of await page
      .locator(".seller-cta .home-grand-button")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))))
      expect(href).toBe(heroHref);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});

test("search previews use current branding and sitemap contains canonical category and area pages", async ({
  request,
}) => {
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const sitemap = await request.get("/sitemap.xml");
  const xml = await sitemap.text();
  expect(xml).toContain("https://www.zapiboo.com/areas/kalyan-nagar");
  expect(xml).toContain("https://www.zapiboo.com/sell/toys");
  expect(xml).toContain("sell-categories/toys.webp");
  expect(xml).not.toContain("/sell-used-car");
  expect(xml).not.toContain("/admin");
});
