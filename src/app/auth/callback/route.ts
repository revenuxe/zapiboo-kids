import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { safeRedirect } from "@/lib/safe-redirect";

export async function GET(request: NextRequest) {
  // Keep the browser's authority: Next dev can normalize 127.0.0.1 to
  // localhost in request.url, which would switch origins and hide its draft.
  const origin = new URL(request.url);
  origin.host = request.headers.get("host") || origin.host;
  const code = request.nextUrl.searchParams.get("code");
  const next = safeRedirect(request.nextUrl.searchParams.get("next"));
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  if (next.startsWith("/marketplace/sell")) {
    const retry = new URL(next, origin);
    retry.searchParams.set("authError", "callback");
    return NextResponse.redirect(retry);
  }
  const retry = new URL("/auth", origin);
  retry.searchParams.set("error", "callback");
  retry.searchParams.set("redirectTo", next);
  return NextResponse.redirect(retry);
}
