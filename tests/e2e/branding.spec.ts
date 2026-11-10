import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const icon = readFileSync("public/favicon.ico");
const version = createHash("sha256").update(icon).digest("hex").slice(0, 12);

test("all pages inherit the current versioned favicon and mobile icons", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/sell/toys", "/areas/kalyan-nagar", "/admin/login"]) {
    await page.goto(path);
    await expect(page.locator('link[rel="icon"][type="image/x-icon"]')).toHaveAttribute(
      "href",
      `/favicon.ico?v=${version}`,
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      "href",
      `/apple-touch-icon.png?v=${version}`,
    );
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      `/site.webmanifest?v=${version}`,
    );
  }
  const response = await request.get(`/favicon.ico?v=${version}`);
  expect(response.status()).toBe(200);
  expect(Buffer.compare(await response.body(), icon)).toBe(0);
  expect(icon.readUInt16LE(2)).toBe(1);
  expect(icon.readUInt16LE(4)).toBe(3);
});

test("mobile icon files have their declared sizes and manifest identifies Zapiboo", async ({
  request,
}) => {
  for (const [name, size] of [
    ["favicon-16x16.png", 16],
    ["favicon-32x32.png", 32],
    ["apple-touch-icon.png", 180],
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
  ] as const) {
    const response = await request.get(`/${name}?v=${version}`);
    expect(response.status()).toBe(200);
    const bytes = await response.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
  }
  const response = await request.get(`/site.webmanifest?v=${version}`);
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest.name).toBe("Zapiboo Kids");
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons).toHaveLength(2);
  expect(manifest.icons.every((item: { src: string }) => item.src.endsWith(`?v=${version}`))).toBe(
    true,
  );
});
