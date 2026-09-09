// Thin client for the Edge Functions. Both fall back gracefully when Supabase
// isn't configured, so the site runs as a static preview.
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

export function reserve(payload) {
  return call("reserve", payload);
}
export function askHost(messages) {
  return call("host", { messages });
}
