// POST /functions/v1/reserve — create a reservation on behalf of an anonymous guest.
// Guests never write to public.reservations directly (no anon insert policy);
// this function validates, rate-limits, then inserts with the service role.
// Phase 1 adds phone OTP before the insert and the WhatsApp confirmation.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { corsHeaders, json } from "../_shared/cors.ts";
import { rateLimit } from "../_shared/ratelimit.ts";

const Body = z.object({
  guest_name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+?[0-9 ]{9,16}$/),
  email: z.string().email().optional(),
  party_size: z.number().int().min(1).max(40),
  service: z.enum(["lunch", "dinner", "club"]),
  zone_id: z.string().max(40).optional(),
  starts_at: z.string().datetime(),
  ride_home_requested: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(db, `reserve:ip:${ip}`, 10, 3600))) return json({ error: "too many requests" }, 429);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid input", issues: parsed.error.issues }, 400);
  const b = parsed.data;
  if (!(await rateLimit(db, `reserve:phone:${b.phone}`, 5, 86400))) return json({ error: "too many requests" }, 429);

  const ref = `VRD-${Math.floor(10000 + Math.random() * 90000)}`;
  const { data, error } = await db
    .from("reservations")
    .insert({ ...b, ref, source: "web" })
    .select("ref, starts_at, service, party_size")
    .single();
  if (error) {
    console.error(error);
    return json({ error: "could not create reservation" }, 500);
  }
  return json({ ok: true, reservation: data });
});
