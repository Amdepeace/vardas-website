// Fixed-window rate limit keyed by IP or phone, backed by a small table.
// Phase 0 scaffold: swap for Upstash/pg_ratelimit in Phase 1 if volume needs it.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export async function rateLimit(
  db: SupabaseClient,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000).toISOString();
  const { data, error } = await db.rpc("bump_rate_limit", { p_key: key, p_window: windowStart });
  if (error) {
    console.error("rate limit rpc failed; failing open", error);
    return true;
  }
  return (data as number) <= limit;
}
