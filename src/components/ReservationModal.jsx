import { Fragment, useEffect, useState } from "react";
import { CTA, Field, Kicker } from "./primitives";
import { backendReady, reserve } from "../lib/api";

const ZONES = [
  { id: "terrace", label: "Terrace · smoking area", service: ["lunch", "dinner", "club"] },
  { id: "lounge", label: "Lounge · smoke-free", service: ["lunch", "dinner", "club"] },
  { id: "club-floor", label: "Club floor · smoke-free", service: ["club"] },
  { id: "private-1", label: "Private room I · up to 24", service: ["dinner", "club"] },
];

export function ReservationModal({ open, onClose, prefill, onConfirm }) {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState({ service: "dinner", date: today, time: "20:00", party: 2, zone: "lounge", name: "", phone: "", ride: false, notes: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (open) { setErrors({}); setDone(null); setData((d) => ({ ...d, ...(prefill || {}) })); }
  }, [open, prefill]);
  if (!open) return null;

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const zones = ZONES.filter((z) => z.service.includes(data.service));

  async function submit(e) {
    e.preventDefault();
    const err = {};
    if (data.name.trim().length < 2) err.name = "Your name, please";
    if (!/^\+?[0-9 ]{9,16}$/.test(data.phone)) err.phone = "A phone number we can WhatsApp";
    if (!data.date || !data.time) err.date = "Pick a date and time";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    try {
      const starts_at = new Date(`${data.date}T${data.time}:00`).toISOString();
      let ref = "VRD-PREVIEW";
      if (backendReady) {
        const r = await reserve({ guest_name: data.name.trim(), phone: data.phone.trim(), party_size: Number(data.party), service: data.service, zone_id: data.zone, starts_at, ride_home_requested: data.ride, notes: data.notes || undefined });
        ref = r.reservation.ref;
      }
      setDone(ref);
      onConfirm?.(ref);
    } catch (ex) {
      setErrors({ form: ex.message });
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label="Reserve a table">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-xl bg-paper text-ink border border-line shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="px-6 md:px-8 py-5 border-b border-line flex items-start justify-between bg-ink text-paper">
          <div>
            <Kicker className="!text-red-soft">Reserve · 5th floor</Kicker>
            <h2 className="font-display text-2xl mt-2">A table on your terms</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-paper/70 hover:text-paper"><span className="material-symbols-outlined">close</span></button>
        </div>

        {done ? (
          <div className="px-6 md:px-8 py-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red">Reference {done}</p>
            <h3 className="font-display text-3xl mt-3 text-ink">See you on the fifth floor.</h3>
            <p className="mt-4 text-sm text-ink/75 leading-relaxed">
              {backendReady ? "We'll confirm on WhatsApp shortly." : "Preview mode — no reservation was sent. Connect Supabase to go live."}
              {" "}Remember: every price is published, water is free, and we're at 2,355 m — alcohol works harder here.
            </p>
            <CTA variant="solid" onClick={onClose} className="mt-8">Done</CTA>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Service">
              <select className="field-line" value={data.service} onChange={set("service")}>
                <option value="lunch">Business lunch · 12:00–15:00</option>
                <option value="dinner">Dinner · 18:00–23:00</option>
                <option value="club">Club · from 22:00</option>
              </select>
            </Field>
            <Field label="Zone" hint={zones.find((z) => z.id === data.zone)?.id === "terrace" ? "Hookah and smoking are on the terrace only." : "Smoke-free."}>
              <select className="field-line" value={data.zone} onChange={set("zone")}>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
              </select>
            </Field>
            <Field label="Date" error={errors.date}><input type="date" min={today} className="field-line" value={data.date} onChange={set("date")} /></Field>
            <Field label="Time"><input type="time" className="field-line" value={data.time} onChange={set("time")} /></Field>
            <Field label="Party size"><input type="number" min="1" max="40" className="field-line" value={data.party} onChange={set("party")} /></Field>
            <Field label="Name" error={errors.name}><input className="field-line" placeholder="Your name" value={data.name} onChange={set("name")} /></Field>
            <Field label="Phone (WhatsApp)" error={errors.phone}><input className="field-line" placeholder="+251 9…" value={data.phone} onChange={set("phone")} /></Field>
            <Field label="Notes"><input className="field-line" placeholder="Birthday, allergies, quiet table…" value={data.notes} onChange={set("notes")} /></Field>
            <label className="sm:col-span-2 flex items-start gap-3 text-sm text-ink/80 cursor-pointer">
              <input type="checkbox" checked={data.ride} onChange={set("ride")} className="mt-1 accent-[#C8A452]" />
              <span><b className="text-ink">Arrange a ride home.</b> A vetted driver or partner, booked by us — you confirm the time on the night.</span>
            </label>
            {errors.form && <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red">⚠ {errors.form}</p>}
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-[12px] text-grey-2 max-w-xs">No deposit. No minimum unless you choose a zone that shows one. Prices on the menu are the prices you pay.</p>
              <CTA type="submit" variant="brass" disabled={busy}>{busy ? "Sending…" : "Reserve →"}</CTA>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] toast-in">
      <div className="bg-ink text-paper px-5 py-3 flex items-center gap-3 shadow-2xl border border-red/40">
        <span className="material-symbols-outlined text-red ms-fill text-[18px]">check_circle</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{message}</span>
      </div>
    </div>
  );
}
