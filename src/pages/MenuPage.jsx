import { useEffect, useState } from "react";
import { Button, Label, PageHero, Section } from "../components/vx";
import { etb } from "../lib/format";
import { backendReady } from "../lib/api";
import { supabase } from "../lib/supabase";

const SECTIONS = [
  ["kitchen", "Kitchen", "International and Ethiopian · seasonal"], ["grill", "Grill & fish", ""], ["lunch", "Business lunch", "Mon – Fri · 12:00 – 15:00"],
  ["hookah", "Hookah", "Terrace only"], ["beer", "Beer", ""], ["spirits", "Spirits by the glass", ""], ["bottles", "Bottles", "On request only"],
];

export function MenuPage() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!backendReady) { setItems([]); return; }
    supabase.from("menu_items").select("id, section_id, name, description, price_etb, unit, seasonal").eq("available", true).gt("price_etb", 0).order("name").then(({ data }) => setItems(data || []));
  }, []);
  return (
    <div>
      <PageHero image="/gallery/vardas-night-3.jpg" label="Vardas · menu" title="Every price," gold="published" intro="If a price isn't on this page, we don't charge it. Bottles are listed separately and only served when you ask." />
      <Section>
        <div className="grid lg:grid-cols-[1fr_300px] gap-14">
          <div className="space-y-14">
            {SECTIONS.map(([id, title, note]) => {
              const rows = (items || []).filter((i) => i.section_id === id);
              return (
                <div key={id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-gold/40 pb-3"><h2 className="vx-display text-2xl text-cream">{title}</h2>{note && <span className="vx-label !text-[0.58rem] text-mute-2">{note}</span>}</div>
                  {items === null ? <p className="py-6 text-sm text-mute-2">Loading…</p> : rows.length ? (
                    <ul className="divide-y divide-edge">{rows.map((i) => (
                      <li key={i.id} className="py-4 grid grid-cols-[1fr_auto] gap-6 items-baseline">
                        <div><p className="text-cream">{i.name}{i.seasonal && <span className="ml-2 vx-label !text-[0.55rem] text-gold">seasonal</span>}</p>{i.description && <p className="text-sm text-mute mt-0.5">{i.description}</p>}</div>
                        <span className="tabular-nums text-gold-light whitespace-nowrap">{etb(i.price_etb)}<span className="text-mute-2 text-xs"> / {i.unit}</span></span>
                      </li>))}</ul>
                  ) : <p className="py-6 text-sm text-mute-2">Being priced — nothing appears here without its price.</p>}
                </div>
              );
            })}
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 self-start">
            <div className="bg-night-2 border border-edge p-6"><Label>2,355 m</Label><p className="text-sm text-mute mt-3 leading-relaxed">Addis sits high — alcohol hits harder here. Water is free, always.</p></div>
            <div className="bg-night-2 border border-edge p-6"><Label>Bottles</Label><p className="text-sm text-mute mt-3 leading-relaxed">Never suggested, only served on request. Ask for a bill preview any time.</p></div>
            <Button to="/vardas/tables" className="w-full">Book a table</Button>
          </aside>
        </div>
      </Section>
    </div>
  );
}
