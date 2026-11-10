import { test, expect } from "@playwright/test";

const pages = [
  ["/", /Outgrown\.Still so loved\./],
  ["/sell/toys", /Sell used toys & games in Bangalore/],
  ["/pickup", /SELL YOUR KIDS ITEMS/],
  ["/contact", /connect/],
  ["/privacy", /Privacy policy/],
  ["/terms", /Terms of service/],
  ["/auth", /Welcome back/],
  ["/admin/login", /./],
] as const;
for (const [path, heading] of pages) {
  test(`server HTML and current metadata: ${path}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    expect((await page.goto(path))?.status()).toBe(200);
    if (path === "/pickup")
      await expect(
        page
          .locator("noscript p")
          .filter({ hasText: "Enable JavaScript to use the selling form.", visible: true }),
      ).toBeVisible();
    else if (path !== "/auth") await expect(page.locator("h1").first()).toContainText(heading);
    await expect(page.locator("head title")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(
      new URL(`https://www.zapiboo.com${path}`).href,
    );
    if (path.startsWith("/auth") || path.startsWith("/admin"))
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    for (const schema of await page.locator('script[type="application/ld+json"]').allTextContents())
      expect(() => JSON.parse(schema)).not.toThrow();
    await context.close();
  });
}
test("private routes redirect before returning protected content", async ({ request }) => {
  for (const [path, destination] of [
    ["/account", "/auth"],
    ["/orders", "/auth"],
    ["/admin/dashboard", "/admin/login"],
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain(destination);
  }
});
test("mobile menu navigates to contact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
