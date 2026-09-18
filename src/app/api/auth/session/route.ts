import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Public: tells the client whether cloud sync is on (never reveals anything else). */
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return NextResponse.json({ authenticated: await verifySessionToken(token) });
}
