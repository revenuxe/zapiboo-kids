import { test, expect } from "@playwright/test";
const redirects = {
  "/sell-used-car": "toys",
  "/sell-used-car-bangalore": "toys",
  "/sell-used-bike-bangalore": "books",
  "/sell-used-scooter-bangalore": "clothing",
  "/sell-used-suv-bangalore": "gear",
  "/sell-commercial-vehicle-bangalore": "cycles",
};
for (const [path, category] of Object.entries(redirects))
  test(`${path}: permanent redirect uses current content`, async ({ request }) => {
    const r = await request.get(path, { maxRedirects: 0 });
    expect(r.status()).toBe(308);
    expect(r.headers().location).toBe("/sell/" + category);
  });
