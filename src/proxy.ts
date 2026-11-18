import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/integrations/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = getSupabaseConfig();
  if (request.nextUrl.pathname === "/chats") {
    if (!config) {
      const returnPath =
        "/chats" + (request.nextUrl.search ? request.nextUrl.search : "");
      return NextResponse.redirect(
        new URL("/auth?redirectTo=" + encodeURIComponent(returnPath), request.url),
      );
    }
  }
  if (!config) return response;
  const { url, key } = config;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // Validate with the auth service; never trust a decoded cookie session.
  const { data } = await supabase.auth.getUser();
  if (request.nextUrl.pathname === "/chats" && !data.user) {
    const returnPath =
      "/chats" + (request.nextUrl.search ? request.nextUrl.search : "");
    return NextResponse.redirect(
      new URL("/auth?redirectTo=" + encodeURIComponent(returnPath), request.url),
    );
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!$|about(?:/|$)|contact(?:/|$)|areas(?:/|$)|services(?:/|$)|sell(?:/|$)|materials(?:/|$)|pickup(?:/|$)|privacy(?:/|$)|sell-used-(?:car|bike|scooter)(?:/|$)|sell-used-(?:car|bike|scooter|suv)-bangalore(?:/|$)|sell-commercial-vehicle-bangalore(?:/|$)|terms(?:/|$)|_next/static|_next/image|favicon\\.(?:png|ico)|robots\\.txt|sitemap\\.xml|api/keepalive|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
