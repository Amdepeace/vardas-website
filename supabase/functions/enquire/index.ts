// POST /functions/v1/enquire — public forms: Vardas Venue events, contact, newsletter, artist sign-up, careers / supplier.
// Every submission is stored, then emailed to the Vardas inbox (see _shared/mail.ts).
// Validated, rate-limited, inserted with the service role (anon has no insert policy).
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { corsHeaders, json } from "../_shared/cors.ts";
import { rateLimit } from "../_shared/ratelimit.ts";
import { notify } from "../_shared/mail.ts";

const phone = z.string().regex(/^\+?[0-9 ]{9,16}$/);
const Hire = z.object({ kind: z.literal("hire"), venue: z.enum(["vardas", "vardas-venue"]).default("vardas-venue"), company: z.string().max(120).optional(), contact_name: z.string().min(2).max(80), phone, email: z.string().email().optional(),
  event_kind: z.enum(["corporate", "launch", "birthday", "wedding", "other"]), preferred_date: z.string().optional(), guests: z.number().int().min(1).max(500).optional(),
  zone_id: z.string().max(40).optional(), budget_etb: z.number().optional(), brief: z.string().max(2000).optional() });
const Artist = z.object({ kind: z.literal("artist"), name: z.string().min(2).max(80), act_kind: z.enum(["dj", "band", "vocalist", "comedian", "promoter"]),
  genres: z.array(z.string().max(40)).max(10).default([]), links: z.record(z.string().max(300)).default({}), phone, requested_date: z.string().optional(), bio: z.string().max(1500).optional() });
const Application = z.object({ kind: z.literal("application"), applicant_kind: z.enum(["job", "supplier"]), name: z.string().min(2).max(80), phone, email: z.string().email().optional(),
  message: z.string().max(2000).optional(), job_id: z.string().uuid().optional() });
const Contact = z.object({ kind: z.literal("contact"), topic: z.string().max(40).default("general"), name: z.string().min(2).max(80), email: z.string().email(), phone: phone.optional(), message: z.string().min(2).max(4000) });
const Newsletter = z.object({ kind: z.literal("newsletter"), email: z.string().email() });
const Body = z.discriminatedUnion("kind", [Hire, Artist, Application, Contact, Newsletter]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(db, `enquire:ip:${ip}`, 10, 3600))) return json({ error: "too many requests" }, 429);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid input", issues: parsed.error.issues }, 400);
  const b = parsed.data;
  const who = "phone" in b && b.phone ? b.phone : "email" in b ? b.email : ip;
  if (!(await rateLimit(db, `enquire:who:${who}`, 5, 86400))) return json({ error: "too many requests" }, 429);

  let res;
  if (b.kind === "newsletter") {
    res = await db.from("subscribers").upsert({ email: b.email.toLowerCase() }, { onConflict: "email" }).select("id").single();
    if (!res.error) await notify("New newsletter sign-up", { Email: b.email });
    return res.error ? json({ error: "could not subscribe" }, 500) : json({ ok: true });
  }
  if (b.kind === "contact") {
    const { kind: _k, ...rest } = b;
    res = await db.from("contact_messages").insert(rest).select("id").single();
    if (!res.error) await notify(`Website message — ${b.topic}`, { Name: b.name, Email: b.email, Phone: b.phone, Message: b.message }, b.email);
  } else if (b.kind === "hire") {
    const { kind: _k, event_kind, ...rest } = b;
    res = await db.from("hire_enquiries").insert({ ...rest, kind: event_kind }).select("id").single();
    if (!res.error) await notify(`Vardas Venue enquiry — ${event_kind}${b.preferred_date ? ` · ${b.preferred_date}` : ""}`, { Name: b.contact_name, Company: b.company, Phone: b.phone, Email: b.email, Date: b.preferred_date, Guests: b.guests, "Budget (ETB)": b.budget_etb, Brief: b.brief }, b.email);
  } else if (b.kind === "artist") {
    const { kind: _k, act_kind, requested_date, phone: ph, ...rest } = b;
    res = await db.from("artists").insert({ ...rest, kind: act_kind, links: { ...rest.links, phone: ph } }).select("id").single();
    if (!res.error && requested_date) await db.from("artist_bookings").insert({ artist_id: res.data.id, requested_date });
    if (!res.error) await notify(`Artist intro — ${b.name}`, { Name: b.name, Kind: act_kind, Phone: ph, Genres: b.genres.join(", "), Links: JSON.stringify(b.links), Bio: b.bio, "Requested date": requested_date });
  } else {
    const { kind: _k, applicant_kind, ...rest } = b;
    res = await db.from("applications").insert({ ...rest, kind: applicant_kind }).select("id").single();
    if (!res.error) await notify(`${applicant_kind === "job" ? "Job application" : "Supplier"} — ${b.name}`, { Name: b.name, Phone: b.phone, Email: b.email, Message: b.message }, b.email);
  }
  if (res.error) { console.error(res.error); return json({ error: "could not save enquiry" }, 500); }
  return json({ ok: true, id: res.data.id });
});
