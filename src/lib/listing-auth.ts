const key = "zapiboo-listing-auth-return";
const maxAge = 24 * 60 * 60 * 1000;

export function listingAuthReturn(): string | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!value || typeof value.created !== "number" || !Number.isFinite(value.created) ||
      value.created > Date.now() || Date.now() - value.created > maxAge || typeof value.path !== "string") return null;
    const url = new URL(value.path, window.location.origin);
    return url.origin === window.location.origin && url.pathname === "/marketplace/sell"
      ? url.pathname + url.search
      : null;
  } catch { return null; }
}

export function rememberListingAuth(category: string) {
  try {
    localStorage.setItem(key, JSON.stringify({
      path: "/marketplace/sell?category=" + encodeURIComponent(category),
      created: Date.now(),
    }));
  } catch { /* The explicit OAuth return URL still preserves navigation. */ }
}

export function clearListingAuth() {
  try { localStorage.removeItem(key); } catch {}
}
