// Generic request form: validates, sends via submit() (Edge Function → inbox, or mailto fallback),
// then shows a confirmation with WhatsApp / Telegram follow-ups.
import { useState } from "react";
import { Button, Field } from "./vx";
import { submit, backendReady } from "../lib/api";
import { tgLink, waLink } from "../lib/contact";
import { SITE } from "../data/site";

export function RequestForm({ fields, initial, build, cta = "Send request", doneTitle = "Request received", onToast }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function go(e) {
    e.preventDefault();
    const er = {};
    for (const fd of fields) {
      if (fd.required && !String(f[fd.name] ?? "").trim()) er[fd.name] = "Required";
      if (fd.name === "phone" && f.phone && !/^\+?[0-9 ]{9,16}$/.test(f.phone)) er.phone = "Use a number we can WhatsApp, e.g. +251 9…";
      if (fd.type === "date" && f[fd.name] && new Date(f[fd.name]) < new Date(new Date().toDateString())) er[fd.name] = "Pick a date from today";
    }
    setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const { fn, payload, subject, summary } = build(f);
      const how = await submit({ fn, payload, subject, fields: summary });
      setDone({ how, summary });
      if (how === "mailto") onToast?.("Your mail app is open — press send to reach us");
    } catch (ex) { setErr({ form: ex.message }); } finally { setBusy(false); }
  }

  if (done) {
    const text = `${doneTitle}\n` + Object.entries(done.summary).map(([k, v]) => `${k}: ${v}`).join("\n");
    return (
      <div className="bg-night-2 border border-gold/40 p-8 sm:p-10">
        <p className="vx-label text-gold">{done.how === "sent" ? "Sent to the Vardas team" : "Almost there"}</p>
        <h3 className="vx-display text-2xl text-cream mt-3">{done.how === "sent" ? doneTitle : "Press send in your mail app"}</h3>
        <p className="text-mute mt-4 max-w-lg leading-relaxed">{done.how === "sent" ? `A host will confirm by phone. Faster? Send the same details on WhatsApp or Telegram.` : `We've written the email to ${SITE.email} for you. Prefer chat? Send it on WhatsApp or Telegram instead.`}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Button href={waLink(text)} target="_blank" className="!bg-wa !bg-none !text-night">WhatsApp</Button>
          <Button href={tgLink()} target="_blank" variant="ghost">Telegram</Button>
          <Button onClick={() => setDone(null)} variant="dark">New request</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={go} noValidate className="grid sm:grid-cols-2 gap-5">
      {fields.map((fd) => (
        <div key={fd.name} className={fd.wide ? "sm:col-span-2" : ""}>
          {fd.type === "checkbox" ? (
            <label className="flex items-start gap-3 text-sm text-mute cursor-pointer pt-2"><input type="checkbox" checked={!!f[fd.name]} onChange={set(fd.name)} className="mt-1 accent-[#E2A93B]" /><span>{fd.label}</span></label>
          ) : (
            <Field label={fd.label + (fd.required ? " *" : "")} hint={fd.hint} error={err[fd.name]}>
              {fd.type === "select" ? (
                <select className="vx-field" value={f[fd.name]} onChange={set(fd.name)}>{fd.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              ) : fd.type === "textarea" ? (
                <textarea className="vx-field min-h-[120px]" value={f[fd.name]} onChange={set(fd.name)} placeholder={fd.placeholder} />
              ) : (
                <input className="vx-field" type={fd.type || "text"} min={fd.min} value={f[fd.name]} onChange={set(fd.name)} placeholder={fd.placeholder} />
              )}
            </Field>
          )}
        </div>
      ))}
      {err.form && <p className="sm:col-span-2 text-gold text-sm">{err.form}</p>}
      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-mute-2 max-w-sm">{backendReady ? `Goes straight to ${SITE.email} and the Vardas team.` : `Opens your mail app addressed to ${SITE.email}.`}</p>
        <Button type="submit" disabled={busy}>{busy ? "Sending…" : cta}</Button>
      </div>
    </form>
  );
}
