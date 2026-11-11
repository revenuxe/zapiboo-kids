// These legacy pages have no replacement in the kids marketplace.
// Keep them crawlable so search engines can observe the permanent removal.
export function retiredPageResponse() {
  return new Response("This page has been permanently removed.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
