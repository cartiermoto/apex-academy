import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Where the links in Supabase's emails land (confirm the account, reset the
 * password): trades the one-time code for a session.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/";
  // Only same-site paths: "/x" yes, "//evil.com" or "https://…" no.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  // Typically a link opened in another browser. The email is confirmed anyway,
  // so the login page says to sign in with the password.
  return NextResponse.redirect(new URL("/login?link=1", url.origin));
}
