# SEO work and measurement plan

Implemented locally on 10 November 2026. These changes must be deployed before they affect the public site. Traffic, ranking and indexing changes have not been measured or guaranteed.

## Content and navigation

- Six category landing pages now have distinct titles, descriptions, introductions, item checks, bundle examples, photo guidance and six seller questions each.
- Category H1s describe the actual service and Bangalore location. Area H1s identify selling pre-loved kids items in the relevant neighbourhood.
- All 43 area pages preserve the local reference pincode in selling CTAs and link to each detailed category guide. Reference pincodes are not exact-address guarantees.
- Visible breadcrumbs, category-to-area links and area-to-category links make navigation and discovery clearer.
- Two prominent CTAs per category/area page preserve booking context. Opening-soon status and review requirements stay visible.
- No invented local offices, reviews, payouts, pickup times, service availability or customer statistics were added. Area-specific facts are limited to the existing area dataset, reference pincode and nearby-place list. More local detail should come from actual operations, not generated claims.

## Technical changes

- Self-referencing canonical metadata remains in place; unique category search titles and descriptions replace generic copy.
- Category Service schema now names the relevant category; ItemList schema describes visible item examples and the area directory.
- The layout supplies one stable business identity and current logo. The duplicate home-page business entity was removed.
- The automotive social-preview image is replaced in metadata by a branded 1200 x 630 image generated at /opengraph-image. No rich-result appearance is promised.
- Sitemap contains canonical public pages and relevant category images, without fabricated modification dates or old vehicle URLs.
- Existing robots.txt advertises the sitemap; authentication, account, order, admin and API paths remain excluded. Private pages must continue to enforce authentication; robots.txt is not access control.

## After deployment

1. Verify ownership of https://www.zapiboo.com in Google Search Console. The app already accepts NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION when HTML-tag verification is used; DNS verification can be configured independently.
2. Submit https://www.zapiboo.com/sitemap.xml. Inspect the homepage, six category URLs and representative area URLs. Confirm Google can fetch the canonical content and image resources.
3. Establish a baseline in Search Console: clicks, impressions, click-through rate and position by page and query. Separate category queries from neighbourhood queries; do not treat indexed page count as traffic growth.
4. Review Page Indexing for exclusions and Google-selected canonicals. Check public redirects from the old vehicle site; redirect only to genuinely relevant replacement content. Reconsider unrelated legacy URLs rather than expanding misleading redirect chains.
5. Check real mobile Core Web Vitals after enough field data is available. Keep large imagery compressed and avoid adding scripts solely for decoration.
6. Review search performance over comparable 28-day periods after recrawling, allowing for seasonality and launch status. Improve pages with relevant impressions but weak click-through using accurate titles and clearer answers to actual queries.
7. Use real customer questions to develop genuinely useful seller guides. Publish original condition examples and item photos only with permission. Do not generate category-by-area combinations simply to increase URL count.
8. When pickup service launches, update the launch-status switch and confirm actual operational coverage, contact details and all availability wording together.

No Search Console account was connected during this work, and no sitemap submission or production deployment was performed.

## Primary references reviewed

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/essentials/spam-policies
