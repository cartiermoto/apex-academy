import { createBrowserClient } from "@supabase/ssr";

/** Supabase in the browser: the session lives in cookies the server can read. */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
