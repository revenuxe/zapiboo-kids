import { expect, test } from "@playwright/test";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

function routes(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? routes(path) : entry.name === "route.ts" ? [path] : [];
  });
}

for (const route of routes("src/app").filter((path) => /sell-(used|commercial)/.test(path))) {
  const url =
    "/" +
    relative("src/app", route)
      .replaceAll("\\", "/")
      .replace(/\/route.ts$/, "");
  test(`${url} remains retired`, async ({ request }) => {
    const response = await request.get(url, { maxRedirects: 0 });
    expect(response.status()).toBe(410);
    expect(response.headers()["x-robots-tag"]).toBe("noindex");
  });
}
