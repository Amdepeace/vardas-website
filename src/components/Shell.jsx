import { Fragment, useState } from "react";
import { Mark, CTA } from "./primitives";

// Public navigation. `id` is used for active state; `path` is the route.
export const NAV_ITEMS = [
  { id: "home", path: "/", label: "Home", icon: "home" },
  { id: "menu", path: "/menu", label: "Menu", icon: "restaurant_menu" },
  { id: "club", path: "/club", label: "Club", icon: "nightlife" },
  { id: "events", path: "/events", label: "Events", icon: "event" },
  { id: "hire", path: "/hire", label: "Hire", icon: "celebration" },
  { id: "tours", path: "/tours", label: "360°", icon: "360" },
  { id: "getting-here", path: "/getting-here", label: "Getting here", icon: "near_me" },
  { id: "your-terms", path: "/your-terms", label: "Your terms", icon: "verified_user" },
  { id: "artists", path: "/artists", label: "Artists", icon: "graphic_eq" },
  { id: "careers", path: "/careers", label: "Careers", icon: "badge" },
  { id: "contact", path: "/contact", label: "Contact", icon: "mail" },
];

export function pathToId(pathname) {
  const seg = "/" + (pathname.split("/")[1] || "");
  return NAV_ITEMS.find((n) => n.path === seg)?.id || "home";
}

function Brand({ inverse = false, vertical = false }) {
  return (
    <span className={`font-serif ${inverse ? "text-paper" : "text-night"} ${vertical ? "text-[13px] v-rl" : "text-base"} tracking-[0.32em]`}>VARDAS</span>
  );
}

export function SideRail({ active, onNavigate, onReserve }) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-[88px] xl:w-[104px] border-r border-line bg-paper/75 backdrop-blur-md flex-col items-center py-6 gap-4">
      <button onClick={() => onNavigate("home")} className="flex flex-col items-center gap-2 group" aria-label="Vardas home">
        <Mark size={26} color="#0E0B10" />
        <Brand vertical />
      </button>
      <ul className="flex-1 flex flex-col items-center gap-3.5 overflow-y-auto no-bar w-full px-2">
        {NAV_ITEMS.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id} className="relative">
              <button
                onClick={() => onNavigate(it.id)}
                className={`group flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? "text-brass" : "text-ink/70 hover:text-night"}`}
                title={it.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : undefined}>
                  {it.icon}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-center leading-tight">{it.label}</span>
              </button>
              {isActive && <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-brass" />}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col items-center gap-3 pt-3 border-t border-line/60 w-full">
        <button onClick={onReserve} className="font-mono text-[10px] uppercase tracking-[0.3em] text-night hover:text-brass transition-colors v-rl py-2">
          Reserve →
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader({ active, onNavigate, onReserve }) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 px-5 bg-paper/90 backdrop-blur-md border-b border-line flex items-center justify-between">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <Mark size={22} color="#0E0B10" />
          <Brand />
        </button>
        <button onClick={() => setOpen(true)} aria-label="Menu" className="text-night">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-night text-paper flex flex-col">
          <div className="flex items-center justify-between px-5 h-14 border-b border-paper/10">
            <Brand inverse />
            <button onClick={() => setOpen(false)} className="text-paper" aria-label="Close menu">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <ul className="flex-1 flex flex-col items-start justify-center gap-4 px-8 overflow-y-auto">
            {NAV_ITEMS.map((it) => (
              <li key={it.id}>
                <button
                  onClick={() => { onNavigate(it.id); setOpen(false); }}
                  className={`font-serif text-3xl tracking-[-0.01em] ${active === it.id ? "text-brass" : "text-paper"}`}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 border-t border-paper/10">
            <CTA variant="brass" onClick={() => { setOpen(false); onReserve(); }} className="w-full">Reserve a table</CTA>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export function Footer({ onNavigate }) {
  const cols = [
    { title: "Visit", ids: ["menu", "club", "events", "hire"] },
    { title: "Know", ids: ["getting-here", "your-terms", "tours"] },
    { title: "Work with us", ids: ["artists", "careers", "contact"] },
  ];
  return (
    <footer className="bg-night text-paper/85 mt-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <Mark size={28} color="#C8A452" />
            <span className="font-serif text-paper text-2xl tracking-[0.32em]">VARDAS</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-paper/70">
            Bar, restaurant and club on the fifth floor above Africa Avenue. Every price published. A safe ride home.
          </p>
          <div className="mt-8 hairline" />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-brass-soft">
            Getu Commercial Building · 5th floor · Bole
          </p>
        </div>
        {cols.map((c, i) => (
          <div key={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-6" : ""}`}>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass mb-5">{c.title}</h4>
            <ul className="space-y-3 text-sm">
              {c.ids.map((id) => (
                <li key={id}>
                  <button onClick={() => onNavigate(id)} className="hover:text-brass transition-colors">
                    {NAV_ITEMS.find((n) => n.id === id).label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass mb-5">Reach us</h4>
          <address className="not-italic text-sm leading-relaxed text-paper/75">
            Africa Avenue, Bole<br />Addis Ababa, Ethiopia<br />
            <span className="font-mono text-[12px] mt-3 inline-block">+251 11 000 0000</span><br />
            <span className="font-mono text-[12px]">hello@vardas.et</span>
          </address>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row gap-4 justify-between items-center font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
          <span>© 2026 Vardas</span>
          <span className="flex items-center gap-6">
            <span>Police 991</span><span>Ambulance 907</span>
            <button onClick={() => onNavigate("your-terms")} className="hover:text-brass">Privacy</button>
          </span>
        </div>
      </div>
    </footer>
  );
}
