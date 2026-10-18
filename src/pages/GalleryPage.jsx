import { useEffect, useState } from "react";
import { PageHero, Section } from "../components/vx";
import { GALLERY } from "../data/site";

const FILTERS = [["all", "All"], ["vardas", "Vardas"], ["vardas-venue", "Vardas Venue"]];

export function GalleryPage() {
  const [f, setF] = useState("all");
  const [i, setI] = useState(-1);
  const items = GALLERY.filter((g) => f === "all" || g.venue === f);
  useEffect(() => {
    if (i < 0) return;
    const on = (e) => { if (e.key === "Escape") setI(-1); if (e.key === "ArrowRight") setI((x) => (x + 1) % items.length); if (e.key === "ArrowLeft") setI((x) => (x - 1 + items.length) % items.length); };
    window.addEventListener("keydown", on); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", on); document.body.style.overflow = ""; };
  }, [i, items.length]);
  return (
    <div>
      <PageHero image="/gallery/vardas-night-3.jpg" label="Gallery" title="After" gold="dark" intro="Nights at Vardas and events at Vardas Venue." />
      <Section>
        <div className="inline-flex border border-edge mb-10" role="tablist">
          {FILTERS.map(([id, l]) => <button key={id} role="tab" aria-selected={f === id} onClick={() => setF(id)} className={`vx-label !tracking-[0.2em] px-5 py-3 border-r border-edge last:border-r-0 ${f === id ? "gold-fill text-night" : "text-mute hover:text-cream"}`}>{l}</button>)}
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-[180px] sm:auto-rows-[240px]">
          {items.map((g, k) => (
            <li key={g.src} className={g.wide ? "col-span-2 row-span-2" : ""}>
              <button onClick={() => setI(k)} className="group relative w-full h-full overflow-hidden vx-focus" aria-label={`Open: ${g.alt}`}>
                <img src={g.src} alt={g.alt} loading="lazy" className={`absolute inset-0 w-full h-full ${g.fit === "contain" ? "object-contain bg-night" : "object-cover"} transition-transform duration-700 group-hover:scale-105`} />
                <span className="absolute inset-0 bg-night/0 group-hover:bg-night/30 transition-colors" />
              </button>
            </li>
          ))}
        </ul>
      </Section>
      {i >= 0 && (
        <div className="fixed inset-0 z-[130] bg-night/95 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={items[i].alt} onClick={() => setI(-1)}>
          <img src={items[i].src} alt={items[i].alt} className="max-w-full max-h-[85vh] object-contain border border-edge" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 inset-x-0 text-center text-sm text-mute">{items[i].alt}</p>
          <button className="absolute top-5 right-5 text-cream" aria-label="Close" onClick={() => setI(-1)}><span className="material-symbols-outlined">close</span></button>
          <button className="absolute left-3 top-1/2 -translate-y-1/2 text-cream text-3xl px-3" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setI((x) => (x - 1 + items.length) % items.length); }}>‹</button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cream text-3xl px-3" aria-label="Next" onClick={(e) => { e.stopPropagation(); setI((x) => (x + 1) % items.length); }}>›</button>
        </div>
      )}
    </div>
  );
}
