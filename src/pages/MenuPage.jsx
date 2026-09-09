import { useEffect, useState } from "react";
import { CTA, Hero, Kicker, Price, SectionHead } from "../components/primitives";
import { etb } from "../lib/format";
import { backendReady } from "../lib/api";
import { supabase } from "../lib/supabase";

const SECTIONS = [
  { id: "kitchen", title: "Kitchen", note: "International and Ethiopian · seasonal" },
  { id: "grill", title: "Grill & fish" },
  { id: "lunch", title: "Business lunch", note: "Mon – Fri · 12:00 – 15:00" },
  { id: "hookah", title: "Hookah", note: "Terrace only · marked areas" },
  { id: "beer", title: "Beer" },
  { id: "spirits", title: "Spirits by the glass" },
  { id: "bottles", title: "Bottles", note: "On request only · zone minimum shown on the zone page" },
];

export function MenuPage({ onReserve }) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!backendReady) { setItems([]); return; }
    supabase.from("menu_items").select("id, section_id, name, description, price_etb, unit, is_bottle_service, seasonal").eq("available", true).gt("price_etb", 0).order("name")
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Menu · every price published" title="What it costs," em="before you sit down." label="Menu hero · kitchen pass"
        intro="Kitchen, grill, hookah, beer, spirits — and bottles, listed separately and only served on request. If a price isn't here, we don't charge it." />

      <section className="density-sect max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-[1fr,280px] gap-12">
          <div className="space-y-14">
            {SECTIONS.map((s) => {
              const rows = (items || []).filter((i) => i.section_id === s.id);
              return (
                <div key={s.id} id={s.id}>
                  <div className="flex items-baseline justify-between border-b border-night pb-3">
                    <h2 className="font-serif text-3xl text-night">{s.title}</h2>
                    {s.note && <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.note}</span>}
                  </div>
                  {items === null ? (
                    <p className="py-6 text-sm text-muted">Loading…</p>
                  ) : rows.length ? (
                    <ul className="divide-y divide-line">
                      {rows.map((i) => (
                        <li key={i.id} className="py-4 grid grid-cols-[1fr,auto] gap-6 items-baseline">
                          <div>
                            <p className="text-night">{i.name}{i.seasonal && <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.16em] text-terrace">seasonal</span>}</p>
                            {i.description && <p className="text-sm text-ink/60 mt-0.5">{i.description}</p>}
                          </div>
                          <Price>{etb(i.price_etb)}<span className="text-muted"> / {i.unit}</span></Price>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-6 text-sm text-muted">
                      {backendReady ? "Card being entered — nothing is listed until it has a price." : "The card is published from the admin console once each item has its price. Nothing appears here without one."}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="space-y-6 md:sticky md:top-8 self-start">
            <div className="border border-line bg-paper-2 p-6">
              <Kicker>You are at 2,355 m</Kicker>
              <p className="mt-3 text-sm text-ink/75 leading-relaxed">Alcohol works faster and harder at this altitude. Water is free, always — just ask.</p>
            </div>
            <div className="border border-line bg-paper-2 p-6">
              <Kicker>Bottles</Kicker>
              <p className="mt-3 text-sm text-ink/75 leading-relaxed">Bottle service is never suggested — only served when you ask. Its price is on this page and the zone minimum is on the zone page. Ask for a bill preview any time.</p>
            </div>
            <div className="border border-night bg-night text-paper p-6">
              <p className="font-serif text-2xl">A table, on your terms.</p>
              <CTA variant="brass" className="mt-5 w-full" onClick={() => onReserve()}>Reserve →</CTA>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
