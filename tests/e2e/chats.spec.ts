import { test, expect } from "@playwright/test";
import { containsContactDetails } from "../../src/lib/chat";
import { listingSchema } from "../../src/lib/marketplace";

test("Chats is visible in the mobile header and opens the private inbox entry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/marketplace");
  const chats = page.locator("header").getByRole("link", { name: "Chats", exact: true });
  await expect(chats).toBeVisible();
  await chats.click();
  await expect(page).toHaveURL(/\/chats$/);
  await expect(
    page.getByRole("heading", { name: "A new conversation starts here." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in to open Chats" })).toHaveAttribute(
    "href",
    "/auth?redirectTo=%2Fchats",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("starting a chat while signed out keeps its vehicle through sign-in", async ({ page }) => {
  const id = "11111111-1111-4111-8111-111111111111";
  await page.goto("/chats?listing=" + id);
  await page.getByRole("link", { name: "Sign in to open Chats" }).click();
  await expect(page).toHaveURL(/redirectTo=%2Fchats%3Flisting%3D11111111/);
});

test("private chat APIs require login and the phone-number endpoint is closed", async ({
  request,
}) => {
  const id = "11111111-1111-4111-8111-111111111111";
  expect((await request.get("/api/chats")).status()).toBe(401);
  expect((await request.get("/api/chats/" + id)).status()).toBe(401);
  const cross = await request.post("/api/chats", {
    headers: { Origin: "https://unrelated.example" },
    data: { listingId: id },
  });
  expect(cross.status()).toBe(403);
  expect((await request.post("/api/chats", { data: { listingId: id } })).status()).toBe(401);
  const closed = await request.get("/api/marketplace/" + id + "/contact");
  expect(closed.status()).toBe(410);
  expect(await closed.json()).not.toHaveProperty("phone");
});

test("contact guard catches common phone and off-platform sharing without blocking vehicle details", () => {
  for (const body of [
    "9886579923",
    "9 eight 8 six 5 seven 9 nine 2 three",
    "Call me +91 (98865) 79923",
    "９８８６５７９９２３",
    "९८८६५७९९२३",
    "৯৮৮৬৫৭৯৯২৩",
    "9\u200b8\u200b8\u200b6\u200b5\u200b7\u200b9\u200b9\u200b2\u200b3",
    "nine eight eight six five seven nine nine two three",
    "user@example.com",
    "Visit https://example.com",
    "Message on WhatsApp",
    "Message me on Signal",
    "myname on telegram",
    "wa.me/919886579923",
  ])
    expect(containsContactDetails(body), body).toBeTruthy();
  for (const body of [
    "Is this still available?",
    "Does the turn signal work?",
    "2021 model with 42500 km",
    "My offer is ₹5,25,000.",
    "Could we meet at 4 pm on Saturday?",
    "The vehicle has 2 keys and a service history.",
  ])
    expect(containsContactDetails(body), body).toBeFalsy();
});

test("seller public text cannot bypass private chat with a phone number", () => {
  const input = {
    id: crypto.randomUUID(),
    category: "used-cars",
    title: "2021 Swift VXi single owner",
    description: "Well maintained hatchback with a full service record. Available for viewing.",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2021,
    mileage: 42500,
    price: 525000,
    fuel: "Petrol",
    transmission: "Manual",
    owners: "1st owner",
    location: "Indiranagar",
    seller_name: "Seller",
    phone: "9886579923",
    negotiable: true,
    consent: true,
  };
  expect(listingSchema.safeParse(input).success).toBeTruthy();
  for (const changed of [
    { seller_name: "Call 9886579923" },
    { description: "Please contact me on WhatsApp for more details about my vehicle." },
    { title: "Call 9886579923 about this car" },
  ])
    expect(listingSchema.safeParse({ ...input, ...changed }).success).toBeFalsy();
});
