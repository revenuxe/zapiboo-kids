import { expect, test } from "@playwright/test";
import { familyServices } from "../../src/lib/family-service-catalog";
import { serviceLocalities } from "../../src/lib/bangalore-data";

test("all neighbourhood pages resolve with unique local titles and useful reference details", async ({
  request,
}) => {
  const titles = new Set<string>();
  for (const area of serviceLocalities) {
    const slug = area.name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const response = await request.get(`/areas/${slug}`);
    expect(response.status(), area.name).toBe(200);
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title, area.name).toContain(area.name);
    expect(titles.has(title!), area.name).toBe(false);
    titles.add(title!);
    expect(html).toContain(area.pincode);
    expect(html).toContain(`href="https://www.zapiboo.com/areas/${slug}"`);
  }
  expect((await request.get("/areas/not-a-real-neighbourhood")).status()).toBe(404);
});

test("homepage names the service intent and publishes matching visible FAQs", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Preschool, Daycare & Kids Activities in Bangalore | Zapiboo");
  await expect(page.locator("h1")).toContainText("Bangalore");
  const data = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemas = data.flatMap((text) => JSON.parse(text));
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  expect(faq.mainEntity).toHaveLength(4);
  for (const item of faq.mainEntity) {
    const details = page
      .locator("details")
      .filter({ has: page.locator("summary", { hasText: item.name }) });
    await expect(details).toHaveCount(1);
    expect(await details.locator("p").textContent()).toBe(item.acceptedAnswer.text);
  }
});

test("service pages have distinct metadata, canonical URLs and service-specific FAQs", async ({
  page,
}) => {
  const titles = new Set<string>();
  for (const service of familyServices) {
    await page.goto(`/services/${service.id}`);
    const title = await page.title();
    expect(title).toContain("Bangalore");
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.zapiboo.com/services/${service.id}`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Bangalore/);
    await expect(page.locator("details")).toHaveCount(3);
    await expect(
      page.getByRole("link", { name: "Enquire Service", exact: true }).first(),
    ).toBeVisible();
  }
});

test("area context survives service selection and the contact form", async ({ page }) => {
  await page.goto("/areas/whitefield");
  await expect(page.locator("h1")).toContainText("Whitefield");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.zapiboo.com/areas/whitefield",
  );
  await expect(page.getByRole("link", { name: "Enquire Service", exact: true })).toHaveAttribute(
    "href",
    "/contact?area=whitefield",
  );
  await page.locator('a[href="/services/preschool-daycare?area=whitefield"]').click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.zapiboo.com/services/preschool-daycare",
  );
  await page.getByRole("link", { name: "Enquire Service", exact: true }).first().click();
  await expect(page.getByLabel("Subject", { exact: true })).toHaveValue(
    "Enquiry: Preschool & Daycare in Whitefield",
  );
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(/Area: Whitefield\nChild/);
});

test("sitemap includes service images and area pages, with no retired inventory URLs", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const service of familyServices) {
    expect(xml).toContain(`https://www.zapiboo.com/services/${service.id}`);
    expect(xml).toContain(`https://www.zapiboo.com${service.image_url}`);
  }
  expect(xml).toContain("/areas/whitefield");
  expect(xml).not.toContain("/sell/");
  expect(xml).not.toContain("/sell-used-");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).not.toContain("Disallow: /services");
});
