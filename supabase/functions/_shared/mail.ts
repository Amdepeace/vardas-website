// Email notifications to the Vardas inbox (default vardasvenue@gmail.com) via Resend.
// Secrets: RESEND_API_KEY (required to send), MAIL_TO (optional override),
// MAIL_FROM (a sender on a domain verified in Resend, e.g. "Vardas <bookings@vardasentertainment.com>").
// Never throws: a mail failure must not lose the guest's request, which is already stored.
export async function notify(subject: string, fields: Record<string, unknown>, replyTo?: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) { console.warn("RESEND_API_KEY not set — stored only, no email sent"); return false; }
  const to = Deno.env.get("MAIL_TO") ?? "vardasvenue@gmail.com";
  const from = Deno.env.get("MAIL_FROM") ?? "Vardas Website <onboarding@resend.dev>";
  const rows = Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== "");
  const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const html = `<div style="font-family:Arial,sans-serif;color:#111"><h2 style="margin:0 0 12px">${esc(subject)}</h2><table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#777;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table><p style="color:#999;font-size:12px;margin-top:16px">Sent from vardasentertainment.com</p></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) console.error("resend failed", res.status, await res.text());
    return res.ok;
  } catch (e) { console.error("resend error", e); return false; }
}
