// POST /functions/v1/host — "Selam", the Vardas host. Grounded on the published
// menu, zones, policies and tonight's events; answers in the guest's language.
// Phase 0: single-turn Q&A with a cached system prompt. Phase 5 adds tools
// (reserve_table, request_ride, hire_enquiry, handoff_to_manager) and streaming.
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";
import { rateLimit } from "../_shared/ratelimit.ts";

const MODEL = "claude-opus-5";

async function grounding(db: ReturnType<typeof createClient>): Promise<string> {
  const [menu, zones, policies, events] = await Promise.all([
    db.from("menu_items").select("name, price_etb, unit, is_bottle_service, menu_sections(title)").eq("available", true),
    db.from("zones").select("id, title, smoking_allowed, capacity, min_spend_etb"),
    db.from("policies").select("slug, title, body_md").eq("published", true),
    db.from("events").select("title, kind, starts_at, lineup, cover_etb, dress_code").eq("published", true)
      .gte("starts_at", new Date().toISOString()).order("starts_at").limit(5),
  ]);
  // Deterministic order keeps the prompt prefix stable, so it caches.
  return [
    "MENU (ETB, published prices):",
    JSON.stringify(menu.data ?? []),
    "ZONES:", JSON.stringify(zones.data ?? []),
    "POLICIES:", JSON.stringify(policies.data ?? []),
    "UPCOMING EVENTS:", JSON.stringify(events.data ?? []),
  ].join("\n");
}

const PERSONA = `You are Selam, the host at Vardas — bar, restaurant and club on the 5th floor of the Getu Commercial Building, Africa Avenue, Bole, Addis Ababa.
Rules you never break:
- Quote prices only from the MENU data, in ETB. If an item is not listed, say you don't have its price rather than guessing.
- Never suggest bottle service unless the guest asks for it. If they ask, state the price and the zone minimum plainly.
- When alcohol comes up, mention once that Addis sits at 2,355 m and altitude strengthens its effect; water is free.
- Point to smoke-free zones when asked about smoking or hookah.
- For complaints, safety concerns, or anything medical or legal: apologise briefly and hand over to the floor manager on +251 11 000 0000.
- Reply in the language the guest writes in (English, Amharic, Chinese, Arabic). Keep answers short and warm; no upselling.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(db, `host:ip:${ip}`, 30, 3600))) return json({ error: "too many requests" }, 429);

  const body = await req.json().catch(() => null) as { messages?: { role: "user" | "assistant"; content: string }[] } | null;
  const messages = (body?.messages ?? []).slice(-12).filter((m) => m.content?.trim());
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "messages required" }, 400);

  const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 1024,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system: [
      { type: "text", text: PERSONA },
      { type: "text", text: await grounding(db), cache_control: { type: "ephemeral" } },
      { type: "text", text: `Now: ${new Date().toISOString()}` },
    ],
    messages,
  });

  if (res.stop_reason === "refusal") return json({ reply: "I can't help with that one — let me get the floor manager for you." });
  const reply = res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  return json({ reply });
});
