import { Fragment, useEffect, useState } from "react";
import { CTA, Logo } from "./primitives";

// Public navigation. `id` drives active state; `path` is the route.
export const NAV_ITEMS = [
  { id: "home", path: "/", label: "Home" },
  { id: "menu", path: "/menu", label: "Menu" },
  { id: "club", path: "/club", label: "Club" },
  { id: "events", path: "/events", label: "Events" },
  { id: "hire", path: "/hire", label: "Hire" },
  { id: "tours", path: "/tours", label: "360°" },
  { id: "getting-here", path: "/getting-here", label: "Getting here" },
  { id: "your-terms", path: "/your-terms", label: "Your terms" },
  { id: "artists", path: "/artists", label: "Artists" },
  { id: "careers", path: "/careers", label: "Careers" },
  { id: "contact", path: "/contact", label: "Contact" },
];
const TOP = ["menu", "club", "events", "hire", "getting-here", "your-terms", "contact"];

export function pathToId(pathname) {
  const seg = "/" + (pathname.split("/")[1] || "");
  return NAV_ITEMS.find((n) => n.path === seg)?.id || "home";
}

/** Fixed top bar from the reference: brand · links · black CTA (hover red). */
export function TopNav({ active, onNavigate, onReserve }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return (
    <Fragment>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[70px] flex items-center justify-between px-5 md:px-10 bg-paper/[.92] backdrop-blur-md border-b border-line-2">
        <button onClick={() => onNavigate("home")} aria-label="Vardas home"><Logo /></button>
        <ul className="hidden lg:flex gap-8">
          {TOP.map((id) => { const it = NAV_ITEMS.find((n) => n.id === id); const on = active === id; return (
            <li key={id}><button onClick={() => onNavigate(id)} aria-current={on ? "page" : undefined}
              className={`text-[0.68rem] tracking-[0.12em] uppercase transition-colors ${on ? "text-ink font-medium" : "text-grey-1 hover:text-ink"}`}>{it.label}</button></li>
          ); })}
        </ul>
        <div className="flex items-center gap-3">
          <button onClick={onReserve} className="hidden sm:inline-block text-[0.65rem] font-medium tracking-[0.12em] uppercase px-[1.4rem] py-[0.55rem] bg-ink text-paper hover:bg-red transition-colors">Reserve</button>
          <button onClick={() => setOpen(true)} aria-label="Menu" className="lg:hidden text-ink"><span className="material-symbols-outlined">menu</span></button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[110] bg-ink text-paper flex flex-col">
          <div className="h-[70px] px-5 flex items-center justify-between border-b border-[#1e1e1e]">
            <Logo inverse />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-paper"><span className="material-symbols-outlined">close</span></button>
          </div>
          <ul className="flex-1 overflow-y-auto px-6 py-6">
            {NAV_ITEMS.map((it, i) => (
              <li key={it.id} className="border-b border-[#1e1e1e]">
                <button onClick={() => { onNavigate(it.id); setOpen(false); }} className={`w-full grid grid-cols-[2rem,1fr,auto] items-center gap-4 py-4 text-left ${active === it.id ? "text-red" : "text-paper"}`}>
                  <span className="text-[0.6rem] tracking-[0.15em] text-[#444]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl">{it.label}</span>
                  <span className="text-grey-1">→</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 border-t border-[#1e1e1e]"><CTA variant="red" className="w-full" onClick={() => { setOpen(false); onReserve(); }}>Reserve a table →</CTA></div>
        </div>
      )}
    </Fragment>
  );
}

/** Black footer bar: brand · copy · links. */
export function Footer({ onNavigate }) {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="px-6 md:px-10 py-14 grid md:grid-cols-12 gap-10 border-b border-[#1e1e1e]">
        <div className="md:col-span-5">
          <Logo inverse />
          <p className="mt-5 text-[0.78rem] leading-[1.9] text-grey-2 max-w-xs">Bar, restaurant and club on the fifth floor above Africa Avenue. Every price published. A safe ride home.</p>
          <p className="mt-6 label text-grey-1 !tracking-[0.2em] !font-normal">Getu Commercial Building · 5th floor · Bole · Addis Ababa</p>
        </div>
        {[["Visit", ["menu", "club", "events", "hire"]], ["Know", ["getting-here", "your-terms", "tours"]], ["Work with us", ["artists", "careers", "contact"]]].map(([t, ids]) => (
          <div key={t} className="md:col-span-2">
            <p className="label text-paper !tracking-[0.25em] mb-5 pb-3 border-b-2 border-paper/80 max-w-[140px]">{t}</p>
            <ul className="space-y-3">{ids.map((id) => <li key={id}><button onClick={() => onNavigate(id)} className="text-[0.68rem] tracking-[0.12em] uppercase text-grey-1 hover:text-red transition-colors">{NAV_ITEMS.find((n) => n.id === id).label}</button></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-[0.58rem] tracking-[0.1em] text-[#444]">© 2026 Vardas · +251 11 000 0000 · hello@vardas.et</span>
        <span className="flex gap-5 text-[0.6rem] tracking-[0.12em] uppercase text-grey-1"><span>Police 991</span><span>Ambulance 907</span><a href="#" className="hover:text-red">Instagram</a><a href="#" className="hover:text-red">TikTok</a></span>
      </div>
    </footer>
  );
}
