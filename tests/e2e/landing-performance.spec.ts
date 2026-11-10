import { test, expect } from "@playwright/test";
test("public category pages are cacheable and use self-hosted fonts", async ({ request }) => {
  for (const path of ["/", "/sell/toys", "/sell/books", "/areas", "/areas/kalyan-nagar"]) {
    const r = await request.get(path);
    expect(r.status()).toBe(200);
    expect(r.headers()["cache-control"]).toContain("s-maxage");
    expect(await r.text()).not.toContain("https://fonts.googleapis.com");
  }
});
test("mobile product imagery loads without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/sell/toys", "/areas/kalyan-nagar"]) {
    await page.goto(path);
    const image = page.locator(path === "/" ? ".home-display-toys img" : ".landing-art-card img");
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});
