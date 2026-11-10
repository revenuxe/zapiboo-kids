export function resolveSupabaseConfig(urlValue?: string, keyValue?: string) {
  const url = urlValue?.trim();
  const key = keyValue?.trim();
  if (!url || !key) return null;
  try {
    const endpoint = new URL(url);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname);
    if (endpoint.protocol !== "https:" && !(local && endpoint.protocol === "http:")) return null;
    if (
      endpoint.username ||
      endpoint.password ||
      endpoint.search ||
      endpoint.hash ||
      endpoint.pathname !== "/"
    )
      return null;
    if (!key.startsWith("sb_publishable_")) {
      // A legacy anon JWT is public. Service-role JWTs and secret keys must
      // never be accepted by a configuration shared with the browser.
      const payload = key.split(".")[1];
      if (!payload) return null;
      const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      if (claims.role !== "anon") return null;
    }
    return { url: endpoint.origin, key };
  } catch {
    return null;
  }
}

export function getSupabaseConfig() {
  return resolveSupabaseConfig(
    process.env.NEXT_SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_SUPABASE_PUBLISHABLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function supabaseConfig() {
  const config = getSupabaseConfig();
  if (!config)
    throw new Error(
      "Configure a valid Supabase URL and public publishable/anon key in .env.local using npm run supabase:connect, then restart Next.js. Never use a secret or service-role key here.",
    );
  return config;
}
