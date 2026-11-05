import { NextResponse } from "next/server";
import { isAdminEmail, supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Tells the client who is signed in, and whether that account has admin mode. */
export async function GET() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return NextResponse.json({
    authenticated: Boolean(user),
    admin: isAdminEmail(user?.email),
    email: user?.email ?? null,
  });
}
