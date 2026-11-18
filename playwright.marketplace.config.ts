import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["marketplace.spec.ts", "chats.spec.ts"],
  workers: 2,
  timeout: 45000,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
