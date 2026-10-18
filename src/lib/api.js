// Edge Function client. When Supabase isn't configured the site still works:
// submit() falls back to the guest's mail app, addressed to the Vardas inbox.
import { mailtoLink } from "./contact";

const base = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const backendReady = Boolean(base && anon && !base.includes("YOUR_PROJECT_REF"));

async function call(fn, body) {
  const res = await fetch(`${base}/functions/v1/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anon, Authorization: `Bearer ${anon}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${fn} failed (${res.status})`);
  return data;
}

export const reserve = (payload) => call("reserve", payload);
export const enquire = (payload) => call("enquire", payload);
export const askHost = (messages) => call("host", { messages });

/**
 * Send a form. Live: Edge Function (stores it + emails vardasvenue@gmail.com).
 * Preview: opens the guest's mail app with everything filled in.
 * Returns "sent" | "mailto".
 */
export async function submit({ fn, payload, subject, fields }) {
  if (backendReady) { await call(fn, payload); return "sent"; }
  window.location.href = mailtoLink(subject, fields);
  return "mailto";
}
