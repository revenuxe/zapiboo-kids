import { test, expect } from '@playwright/test';
const listing = {
  id: 'gallery-test', category: 'used-cars', title: '2021 Maruti Suzuki Swift', brand: 'Maruti Suzuki', model: 'Swift',
  year: 2021, mileage: 35000, price: 525000, fuel: 'Petrol', transmission: 'Manual', owners: '1st owner',
  location: 'Indiranagar', seller_name: 'Arjun Kumar', negotiable: true,
  description: 'A well maintained city car with a full service history. Single owner, used for daily commutes. Available for an inspection in Indiranagar.',
  photos: ['/vehicles/used-cars-cutout.webp', '/vehicles/used-suvs-cutout.webp', '/vehicles/used-bikes-cutout.webp'],
  user_id: 'seller-test', status: 'active', buyer_call_enabled: true, created_at: '2026-11-18T00:00:00Z',
};
test.beforeEach(async ({ page }) => {
  await page.route('**/api/marketplace/gallery-test', r => r.fulfill({ json: { listing } }));
});
test('gallery supports thumbnails, fullscreen, keyboard, zoom and focus restoration', async ({ page }) => {
  await page.goto('/marketplace/gallery-test');
  await expect(page.getByRole('heading', { name: listing.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next photo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show photo 2' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Open photo fullscreen' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByAltText(`${listing.title}, photo 3`)).toBeVisible();
  await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.mp-lightbox-viewport')).toHaveClass(/is-zoomed/);
  await dialog.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await expect(page.locator('.mp-lightbox-viewport')).not.toHaveClass(/is-zoomed/);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByAltText(`${listing.title}, photo 1`)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open photo fullscreen' })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'test-results/detail-modern-desktop.png', fullPage: true });
});
test('seller actions stay on the listing page and send signed-out buyers to login', async ({ page }) => {
  await page.goto('/marketplace/gallery-test');
  const chat = page.getByRole('link', { name: 'Chat Now with the seller' });
  const call = page.getByRole('link', { name: 'Sign in to call the seller' });
  await expect(chat).toHaveAttribute('href', '/auth?redirectTo=%2Fchats%3Flisting%3Dgallery-test');
  await expect(call).toHaveAttribute('href', '/auth?redirectTo=%2Fmarketplace%2Fgallery-test');
  await expect(page.getByRole('heading', { name: 'Meet the seller.' })).toBeVisible();
  await expect(page.locator('.mp-seller-profile + .mp-report')).toHaveAttribute(
    'href',
    '/contact?subject=Report%20listing%20gallery-test',
  );
  await expect(page.locator('.mp-detail-sidebar .mp-report')).toHaveCount(0);
  await expect(page.locator('.mp-price-card')).not.toContainText(listing.seller_name);
  expect(
    await page.evaluate(() => {
      const story = Array.from(document.querySelectorAll('h2')).find(
        element => element.textContent === 'About this vehicle.',
      );
      const profile = document.querySelector('.mp-seller-profile h2');
      return !!story && !!profile &&
        Boolean(story.compareDocumentPosition(profile) & Node.DOCUMENT_POSITION_FOLLOWING);
    }),
  ).toBeTruthy();
  await page.goto('/marketplace');
  await expect(page.locator('.floating-contact-actions')).toHaveCount(0);
});
test('mobile detail and cards fit the viewport with readable images and text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/marketplace/gallery-test');
  await expect(page.getByRole('button', { name: 'Open photo fullscreen' })).toBeVisible();
  await expect.poll(() => page.locator('.mp-gallery img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'test-results/detail-modern-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open photo fullscreen' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next fullscreen photo' }).click();
  await expect(page.getByRole('dialog').getByAltText(`${listing.title}, photo 2`)).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.route('**/api/marketplace', r => r.fulfill({ json: { listings: [listing], available: true } }));
  await page.goto('/marketplace?category=used-cars');
  await expect(page.locator('.mp-card').first()).toBeVisible();
  const photo = page.locator('.mp-card-photo img').first();
  await expect(photo).toHaveCSS('object-fit', 'contain');
  const width = await page.locator('.mp-card').first().evaluate(el => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(150);
  expect(width).toBeLessThan(190);
  await expect(page.locator('.mp-listing-grid').first()).toHaveCSS('grid-template-columns', /[\d.]+px [\d.]+px/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'test-results/cards-modern-mobile.png', fullPage: true });
});
