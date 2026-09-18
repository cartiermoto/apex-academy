import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * The course itself is public. Only the owner's progress is protected: reading
 * or writing /api/progress needs a valid session (the course password), so a
 * visitor can use the course but can never see, change or reset that progress.
 */
export async function middleware(req: NextRequest) {
  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return NextResponse.next();
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/progress/:path*"],
};
