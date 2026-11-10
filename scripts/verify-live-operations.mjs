// Explicit integration check: creates temporary auth users and a pickup, then removes them.
// Privileged credentials stay in memory; screenshots contain only the named test request.
import { spawnSync } from "node:child_process";
import { readdirSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "@playwright/test";

if (!process.argv.includes("--run-live-check"))
  throw new Error("Pass --run-live-check to create and clean up temporary test records.");
const projectRef = "wizweflimtblfiiqspgh";
const origin = process.env.OPERATIONS_TEST_ORIGIN || "http://localhost:3000";
const cache = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
const cli =
  process.env.SUPABASE_CLI_PATH ||
  readdirSync(cache)
    .map((entry) => path.join(cache, entry, "node_modules", "supabase", "bin", "supabase.exe"))
    .find((candidate) => existsSync(candidate));
if (!cli) throw new Error("Set SUPABASE_CLI_PATH to the authenticated Supabase CLI executable.");
const result = spawnSync(
  cli,
  ["projects", "api-keys", "--project-ref", projectRef, "--output", "json"],
  { encoding: "utf8", windowsHide: true, timeout: 30000 },
);
if (result.status !== 0)
  throw new Error("Could not retrieve project credentials; no credentials were printed.");
const parsed = JSON.parse(result.stdout);
const keys = Array.isArray(parsed) ? parsed : parsed.api_keys || parsed.keys || parsed.data;
if (!Array.isArray(keys)) throw new Error("Unexpected project credential response.");
const secret =
  keys.find((key) => key.name === "service_role")?.api_key ||
  keys.find((key) => key.api_key?.startsWith("sb_secret_"))?.api_key;
const publicKey =
  keys.find((key) => key.name === "anon")?.api_key ||
  keys.find((key) => key.api_key?.startsWith("sb_publishable_"))?.api_key;
if (!secret || !publicKey) throw new Error("Required project credentials unavailable.");
const url = `https://${projectRef}.supabase.co`;
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const service = createClient(url, secret, options);
const users = [];
let leadId;
let photoPath;
let browser;
let managedCategoryId;
let managedImagePath;
let categoryAdminContext;
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const ok = (result, label) => {
  if (result.error) throw new Error(label + " failed: " + result.error.message);
  return result.data;
};
async function account(label) {
  const email = `ops-${label}-${randomUUID()}@example.invalid`;
  const password = randomUUID() + "aA1!";
  const { user } = ok(
    await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Operations verification" },
    }),
    "Create test user",
  );
  users.push(user.id);
  const client = createClient(url, publicKey, options);
  const { session } = ok(await client.auth.signInWithPassword({ email, password }), "Test sign in");
  return { id: user.id, client, session };
}
async function contextFor(session) {
  const context = await browser.newContext();
  const value = "base64-" + Buffer.from(JSON.stringify(session)).toString("base64url");
  const chunks = value.match(/.{1,3180}/g);
  await context.addCookies(
    chunks.map((value, index) => ({
      name: `sb-${projectRef}-auth-token${chunks.length > 1 ? "." + index : ""}`,
      value,
      url: origin,
      sameSite: "Lax",
      httpOnly: false,
    })),
  );
  return context;
}
try {
  const owner = await account("owner"),
    other = await account("other"),
    admin = await account("admin");
  ok(
    await service.from("user_roles").insert({ user_id: admin.id, role: "admin" }),
    "Test admin role",
  );
  ok(
    await owner.client.from("user_profiles").upsert({
      user_id: owner.id,
      full_name: "Operations Verification Seller",
      whatsapp: "9999999999",
      address: "Verification address only",
      pincode: "560043",
    }),
    "Seller profile",
  );
  const name = "Operations Verification " + randomUUID().slice(0, 8);
  const fixture = ok(
    await owner.client
      .from("leads")
      .insert({
        user_id: other.id,
        vehicle_type: "Toys & games",
        items: ["Toys & games", "Condition: Good"],
        name,
        phone: "9999999999",
        message: "Temporary integration verification only",
        notes: "Must not become an internal note",
        pincode: "560043",
        address: "Verification address only",
        status: "done",
      })
      .select("id,user_id,status,notes,pickup_id")
      .single(),
    "Create authenticated pickup",
  );
  leadId = fixture.id;
  check(
    fixture.user_id === owner.id && fixture.status === "new" && fixture.notes === null,
    "Insert ownership/status guard failed",
  );
  check(Boolean(fixture.pickup_id), "Pickup reference not generated");
  check(
    ok(await other.client.from("leads").select("id").eq("id", leadId), "Other seller isolation")
      .length === 0,
    "Another seller can read pickup",
  );
  ok(
    await admin.client.rpc("admin_update_lead", {
      p_lead_id: leadId,
      p_status: "scheduled",
      p_notes: "PRIVATE integration note",
    }),
    "Admin status and note transaction",
  );
  check(
    ok(
      await owner.client.from("admin_lead_notes").select("notes").eq("lead_id", leadId),
      "Notes isolation",
    ).length === 0,
    "Owner can read private notes",
  );
  check(
    ok(
      await owner.client.from("leads").select("notes,status").eq("id", leadId).single(),
      "Customer-facing request",
    ).notes === null,
    "Operational note leaked into request",
  );
  check(
    Boolean(
      (
        await owner.client.rpc("admin_update_lead", {
          p_lead_id: leadId,
          p_status: "done",
          p_notes: "not permitted",
        })
      ).error,
    ),
    "Customer called admin mutation",
  );
  check(
    Boolean(
      (
        await owner.client
          .from("leads")
          .update({ status: "cancelled", notes: "tampered" })
          .eq("id", leadId)
      ).error,
    ),
    "Customer changed fields during cancellation",
  );
  ok(
    await owner.client
      .from("leads")
      .update({ status: "cancelled" })
      .eq("id", leadId)
      .select("id")
      .single(),
    "Customer cancellation",
  );
  check(
    ok(
      await admin.client.from("user_profiles").select("user_id").eq("user_id", owner.id),
      "Admin profile access",
    ).length === 1,
    "Admin cannot read seller profile",
  );
  photoPath = `${owner.id}/${randomUUID()}.webp`;
  ok(
    await owner.client.storage
      .from("pickup-photos")
      .upload(photoPath, readFileSync("public/sell-categories/toys.webp"), {
        contentType: "image/webp",
      }),
    "Private photo upload",
  );
  const bucket = ok(await service.storage.getBucket("pickup-photos"), "Bucket privacy");
  check(bucket.public === false, "Pickup bucket is public");
  const publicResponse = await fetch(`${url}/storage/v1/object/public/pickup-photos/${photoPath}`);
  check(!publicResponse.ok, "Anonymous public photo URL is accessible");
  check(
    Boolean(
      (await other.client.storage.from("pickup-photos").createSignedUrl(photoPath, 60)).error,
    ),
    "Other seller signed photo",
  );
  const signed = ok(
    await admin.client.storage.from("pickup-photos").createSignedUrl(photoPath, 60),
    "Admin signed photo",
  );
  check((await fetch(signed.signedUrl)).ok, "Admin photo URL failed");
  ok(
    await admin.client
      .from("leads")
      .update({ has_photo: true, photo_url: `pickup-photos/${photoPath}` })
      .eq("id", leadId),
    "Attach private photo",
  );
  console.log(
    "PASS: authenticated pickup, reference, owner isolation, private notes, admin updates, cancellation guard, seller profiles and private photo access.",
  );
  browser = await chromium.launch({ headless: true });
  const adminContext = await contextFor(admin.session);
  categoryAdminContext = adminContext;
  const page = await adminContext.newPage();
  await page.goto(origin + "/admin/dashboard", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /Every request/ }).waitFor();
  await page
    .getByPlaceholder("Search seller, category, condition, area...")
    .count()
    .then(async (count) => {
      if (count)
        await page.getByPlaceholder("Search seller, category, condition, area...").fill(name);
      else await page.locator('input[placeholder^="Search seller"]').fill(name);
    });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)),
      "Admin mobile overflow",
    );
    mkdirSync(".validation", { recursive: true });
    await page.screenshot({ path: `.validation/admin-verified-${width}.png`, fullPage: true });
  }
  await page.getByRole("button", { name: `View ${name}'s booking` }).click();
  await page.getByRole("img", { name: "Uploaded item" }).waitFor();
  await page.getByRole("dialog").locator("textarea").fill("PRIVATE note saved through admin UI");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  check(
    ok(
      await admin.client.from("admin_lead_notes").select("notes").eq("lead_id", leadId).single(),
      "Saved admin note",
    ).notes === "PRIVATE note saved through admin UI",
    "Admin UI did not save private note",
  );
  const ownerContext = await contextFor(owner.session);
  const customer = await ownerContext.newPage();
  await customer.goto(origin + "/orders", { waitUntil: "networkidle" });
  await customer.getByText(fixture.pickup_id, { exact: true }).waitFor();
  check(
    !(await customer.getByText("PRIVATE note saved through admin UI", { exact: true }).count()),
    "Customer UI shows internal notes",
  );
  await customer.goto(origin + "/pickup?category=toys", { waitUntil: "networkidle" });
  await customer.getByLabel("Condition", { exact: false }).click();
  await customer.getByRole("option", { name: "Good", exact: true }).click();
  await customer.getByRole("button", { name: "Continue", exact: true }).click();
  await customer.getByRole("heading", { name: "Where in Bengaluru?", exact: true }).waitFor();
  await customer.locator("#pin").fill("560043");
  await customer.locator("#addr").fill("Integration verification address only");
  await customer.getByRole("button", { name: "Continue", exact: true }).click();
  await customer.getByRole("heading", { name: "When should we come?", exact: true }).waitFor();
  await customer
    .locator("#date")
    .fill(new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  await customer.getByRole("button", { name: /Morning/ }).click();
  const liveName = "Live Pickup Verification " + randomUUID().slice(0, 8);
  await customer.locator("#nm").fill(liveName);
  await customer.locator("#ph").fill("9999999999");
  await customer.getByRole("button", { name: "Confirm pickup", exact: true }).click();
  await customer.getByRole("heading", { name: /Thank you/ }).waitFor();
  const saved = ok(
    await owner.client
      .from("leads")
      .select("id,pickup_id,status,user_id")
      .eq("name", liveName)
      .single(),
    "Full UI pickup submission",
  );
  check(
    saved.status === "new" && saved.user_id === owner.id && Boolean(saved.pickup_id),
    "Submitted pickup has invalid ownership, status or reference",
  );
  check(
    (await customer.getByText("Pickup ID: " + saved.pickup_id, { exact: true }).count()) === 1,
    "Confirmation does not show saved reference",
  );
  const whatsapp = await customer.locator('main a[href^="https://wa.me/"]').getAttribute("href");
  check(
    whatsapp.startsWith("https://wa.me/919886579923?") &&
      decodeURIComponent(whatsapp).includes(saved.pickup_id),
    "WhatsApp confirmation link is incorrect",
  );
  check(
    (await customer.locator('main a[href="tel:+919886579923"]').count()) === 1,
    "Confirmation phone link is incorrect",
  );
  await customer.goto(origin + "/orders", { waitUntil: "networkidle" });
  await customer.getByText(saved.pickup_id, { exact: true }).waitFor();
  console.log("PASS: live pickup submission, confirmation reference and WhatsApp/call links.");
  const categoryName = "QA School Bags " + randomUUID().slice(0, 8);
  managedCategoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  check(
    (await ownerContext.request.get(origin + "/api/admin/categories")).status() === 403,
    "Customer can use admin catalog endpoint",
  );
  const denied = await owner.client
    .from("selling_categories")
    .insert({
      id: managedCategoryId + "-denied",
      name: "Denied test",
      description: "This must not be saved.",
      image_url: "/sell-categories/toys.webp",
      types: ["School bags"],
      preparation: "Clean and inspect the bag.",
    });
  check(Boolean(denied.error), "Customer can create catalog records");
  await page.getByRole("tab", { name: "Categories", exact: true }).click();
  await page.getByRole("button", { name: "Add category", exact: true }).click();
  const editor = page.getByRole("dialog");
  await editor.getByLabel("Category name", { exact: true }).fill(categoryName);
  await editor
    .getByLabel("Short description", { exact: true })
    .fill("Pre-loved school bags, lunch bags and kids backpacks for review.");
  await editor
    .getByLabel("Category image", { exact: true })
    .setInputFiles("public/sell-categories/toys.webp");
  await editor.getByRole("img", { name: "Category image preview" }).waitFor();
  await editor
    .getByLabel("Item examples (one per line)", { exact: true })
    .fill("School bags\nKids backpacks");
  await editor
    .getByLabel("Preparation instructions", { exact: true })
    .fill("Clean the bag and describe damaged zips, stains or missing straps.");
  await editor.getByLabel("Show category on website", { exact: true }).uncheck();
  await editor.getByRole("button", { name: "Save category", exact: true }).click();
  try { await editor.waitFor({state:'hidden',timeout:10000}); } catch(error) {
    console.error('Category editor validation:', await editor.locator('[role="alert"]').allTextContents());
    console.error('Invalid fields:',await editor.locator('input:invalid,textarea:invalid').evaluateAll(nodes=>nodes.map(node=>({id:node.id,error:node.validationMessage}))));
    await page.screenshot({path:'.validation/category-editor-error.png',fullPage:true});throw error;
  }
  const created = ok(
    await admin.client.from("selling_categories").select("*").eq("id", managedCategoryId).single(),
    "Saved category",
  );
  check(created.types.length === 2 && !created.is_active, "Category details not saved");
  managedImagePath = created.image_url.split("/category-images/")[1];
  check(
    Boolean(managedImagePath) && (await fetch(created.image_url)).ok,
    "Uploaded public category image is unavailable",
  );
  const publicCatalog = await (await fetch(origin + "/api/categories")).json();
  check(
    !publicCatalog.some((c) => c.id === managedCategoryId),
    "Hidden category leaked into public catalog",
  );
  const card = page.locator('[data-managed-category="' + managedCategoryId + '"]');
  await card.getByRole("button", { name: "Publish", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("alertdialog").waitFor({ state: "hidden" });
  const publicContext = await browser.newContext();
  const publicPage = await publicContext.newPage();
  await publicPage.goto(origin + "/", { waitUntil: "networkidle" });
  await publicPage
    .locator('.home-category-card[href="/pickup?category=' + managedCategoryId + '"]')
    .waitFor();
  await publicPage.goto(origin + "/sell/" + managedCategoryId, { waitUntil: "networkidle" });
  check((await publicPage.title()).includes(categoryName), "New category SEO page did not load");
  check(
    (await publicPage.locator(".seller-item-types a").count()) === 2,
    "New category examples are missing",
  );
  await publicPage.goto(origin + "/areas/kalyan-nagar", { waitUntil: "networkidle" });
  await publicPage
    .locator('.landing-categories a[href*="category=' + managedCategoryId + '"]')
    .waitFor();
  check(
    (await (await fetch(origin + "/sitemap.xml")).text()).includes("/sell/" + managedCategoryId),
    "New category is missing from sitemap",
  );
  await card.getByRole("button", { name: "Edit", exact: true }).click();
  await editor
    .getByLabel("Short description", { exact: true })
    .fill("Updated school bag collection details saved through the dashboard.");
  await editor.getByRole("button", { name: "Save category", exact: true }).click();
  await editor.waitFor({ state: "hidden" });
  await customer.goto(origin + "/pickup?category=" + managedCategoryId, {
    waitUntil: "networkidle",
  });
  await customer.getByLabel("Condition", { exact: false }).click();
  await customer.getByRole("option", { name: "Good", exact: true }).click();
  await customer.getByRole("button", { name: "Continue", exact: true }).click();
  await customer.getByRole("heading", { name: "Where in Bengaluru?", exact: true }).waitFor();
  await customer.locator("#pin").fill("560043");
  await customer.locator("#addr").fill("Temporary catalog verification address");
  await customer.getByRole("button", { name: "Continue", exact: true }).click();
  await customer
    .locator("#date")
    .fill(new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  await customer.getByRole("button", { name: /Morning/ }).click();
  const categoryPickupName = "Category Verification " + randomUUID().slice(0, 8);
  await customer.locator("#nm").fill(categoryPickupName);
  await customer.locator("#ph").fill("9999999999");
  await customer.getByRole("button", { name: "Confirm pickup", exact: true }).click();
  await customer.getByRole("heading", { name: /Thank you/ }).waitFor();
  const customPickup = ok(
    await owner.client
      .from("leads")
      .select("id,selling_category_id,lead_type,vehicle_type")
      .eq("name", categoryPickupName)
      .single(),
    "Custom-category pickup",
  );
  check(
    customPickup.selling_category_id === managedCategoryId &&
      customPickup.lead_type === "kids_pickup",
    "Pickup did not retain managed category identity",
  );
  await card.getByRole("button", { name: "Hide", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("alertdialog").waitFor({ state: "hidden" });
  check(
    !(await (await fetch(origin + "/api/categories")).json()).some(
      (c) => c.id === managedCategoryId,
    ),
    "Hidden category still appears publicly",
  );
  await publicPage
    .goto(origin + "/sell/" + managedCategoryId)
    .then((response) => check(response.status() === 404, "Hidden category page remains available"));
  await page.getByRole("tab", { name: "Pickups", exact: true }).click();
  await page.getByRole("button", { name: "Refresh dashboard", exact: true }).click();
  await page.locator('input[placeholder^="Search seller"]').fill(categoryPickupName);
  await page.getByRole("button", { name: `View ${categoryPickupName}'s booking` }).waitFor();
  console.log(
    "PASS: category creation, optimized image upload, edit, publish/hide, admin-only writes, homepage/area/SEO/sitemap propagation, custom-category booking and preserved hidden-category pickup history.",
  );
} finally {
  if (managedCategoryId && categoryAdminContext) {
    const existing = await service
      .from("selling_categories")
      .select("*")
      .eq("id", managedCategoryId)
      .maybeSingle();
    if (existing.data) {
      const result = await categoryAdminContext.request.patch(origin + "/api/admin/categories", {
        data: { ...existing.data, is_active: false },
      });
      if (!result.ok()) console.error("Temporary category cache cleanup failed.");
    }
  }
  if (browser) await browser.close();
  if (photoPath) {
    const r = await service.storage.from("pickup-photos").remove([photoPath]);
    if (r.error) console.error("Test photo cleanup failed.");
  }
  if (users.length) {
    const r = await service.from("leads").delete().in("user_id", users);
    if (r.error) console.error("Test request cleanup failed.");
  }
  if (managedCategoryId) {
    const r = await service.from("selling_categories").delete().eq("id", managedCategoryId);
    if (r.error) console.error("Temporary category cleanup failed.");
  }
  if (managedImagePath) {
    const r = await service.storage.from("category-images").remove([managedImagePath]);
    if (r.error) console.error("Temporary category image cleanup failed.");
  }
  for (const id of users) {
    const r = await service.auth.admin.deleteUser(id);
    if (r.error) console.error("Temporary user cleanup failed.");
  }
  console.log("Temporary test resources cleaned up.");
}
