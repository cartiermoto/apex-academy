import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase in a route handler, acting as the signed-in user: Row Level Security
 * applies, so a query can only ever reach that user's rows. An expired session
 * is refreshed here, and the new cookies go back with the response.
 */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => store.set(name, value, options)),
      },
    },
  );
}

/** Accounts with admin mode (challenges open regardless of progress). */
export function isAdminEmail(email: string | undefined) {
  if (!email) return false;
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .includes(email.toLowerCase());
}
