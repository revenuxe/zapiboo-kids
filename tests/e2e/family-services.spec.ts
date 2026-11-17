import { expect, test } from "@playwright/test";
import { familyServices } from "../../src/lib/family-service-catalog";

test("service illustrations load on desktop and mobile without horizontal overflow", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".home-category-card")).toHaveCount(6);
    for (const image of await page.locator('img[src*="services"]').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((element) => {
            const image = element as HTMLImageElement;
            return image.complete && image.naturalWidth > 0;
          }),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/family-services-${viewport.width}.png`,
      fullPage: true,
    });
  }
});

test("every service page leads to a correctly prefilled enquiry", async ({ page }) => {
  for (const service of familyServices) {
    const response = await page.goto(`/services/${service.id}`);
    expect(response?.status()).toBe(200);
    await page.getByRole("link", { name: "Enquire Service", exact: true }).first().click();
    await expect(page.getByLabel("Subject", { exact: true })).toHaveValue(
      `Enquiry: ${service.name}`,
    );
  }
});
