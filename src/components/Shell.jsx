import { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV, NAV_FLAT, SITE, VENUES } from "../data/site";
import { waLink, tgLink } from "../lib/contact";
import { submit } from "../lib/api";

function Dropdown({ group, active }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname, loc.search]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 vx-label !tracking-[0.26em] py-2 transition-colors ${active ? "text-gold" : "text-cream hover:text-gold"}`}>
        {group.label}<span className={`text-[0.6rem] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}>
        <ul className="min-w-[250px] bg-night/95 backdrop-blur-md border border-edge border-t-gold/60 py-2 shadow-2xl">
          {group.items.map(([label, to]) => (
            <li key={to}><Link to={to} className="block px-6 py-3 text-[0.82rem] tracking-[0.06em] text-mute hover:text-cream hover:bg-night-3 transition-colors">{label}</Link></li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function TopNav() {
  const loc = useLocation();
  const [solid, setSolid] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { const on = () => setSolid(window.scrollY > 40); on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on); }, []);
  useEffect(() => setDrawer(false), [loc.pathname, loc.search]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);
  const isActive = (base) => loc.pathname === base || loc.pathname.startsWith(base + "/");
  return (
    <Fragment>
      <header className={`vx-nav fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${solid || drawer ? "bg-night/92 backdrop-blur-md border-b border-edge" : "bg-gradient-to-b from-night/80 to-transparent"}`}>
        <div className="max-w-[1440px] mx-auto h-[76px] px-5 sm:px-8 lg:px-14 grid grid-cols-[1fr_auto_1fr] items-center">
          <ul className="hidden lg:flex items-center gap-9">{NAV.map((g) => <Dropdown key={g.label} group={g} active={isActive(g.base)} />)}</ul>
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden text-cream justify-self-start"><span className="material-symbols-outlined">menu</span></button>
          <Link to="/" aria-label="Vardas Entertainment home" className="justify-self-center"><img src="/brand/vardas-logo.png" alt="Vardas" className="h-10 sm:h-11 w-auto" /></Link>
          <div className="flex items-center gap-7 justify-self-end">
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_FLAT.map(([l, to]) => <li key={to}><NavLink to={to} className={({ isActive: a }) => `vx-label !tracking-[0.26em] ${a ? "text-gold" : "text-cream hover:text-gold"}`}>{l}</NavLink></li>)}
            </ul>
            <Link to="/vardas/tables" className="hidden sm:inline-flex vx-label !tracking-[0.22em] gold-fill text-night px-5 py-3 hover:brightness-110">Book a table</Link>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[110] bg-night flex flex-col">
          <div className="h-[76px] px-5 flex items-center justify-between border-b border-edge">
            <img src="/brand/vardas-logo.png" alt="Vardas" className="h-10" />
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="text-cream"><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
            {NAV.map((g) => (
              <div key={g.label}>
                <p className="vx-display text-2xl gold-text">{g.label}</p>
                <ul className="mt-4 border-t border-edge">{g.items.map(([l, to]) => <li key={to} className="border-b border-edge"><Link to={to} className="flex justify-between py-4 text-cream">{l}<span className="text-gold">→</span></Link></li>)}</ul>
              </div>
            ))}
            <ul className="border-t border-edge">{NAV_FLAT.map(([l, to]) => <li key={to} className="border-b border-edge"><Link to={to} className="flex justify-between py-4 text-cream">{l}<span className="text-gold">→</span></Link></li>)}</ul>
          </div>
          <div className="p-5 border-t border-edge grid grid-cols-2 gap-3">
            <a href={waLink("Hi Vardas, ")} className="vx-label text-center py-4 bg-wa text-night">WhatsApp</a>
            <a href={tgLink()} className="vx-label text-center py-4 bg-tg text-white">Telegram</a>
          </div>
        </div>
      )}
    </Fragment>
  );
}

function Newsletter({ onToast }) {
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true);
    try {
      const r = await submit({ fn: "enquire", payload: { kind: "newsletter", email }, subject: "Newsletter sign-up", fields: { Email: email } });
      onToast(r === "sent" ? "You're on the list" : "Opening your mail app to confirm"); setEmail("");
    } catch (ex) { onToast(ex.message); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={go} className="flex w-full max-w-md">
      <label htmlFor="nl" className="sr-only">Email address</label>
      <input id="nl" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="vx-field !border-r-0" />
      <button disabled={busy} className="vx-label gold-fill text-night px-6 shrink-0 disabled:opacity-60">{busy ? "…" : "Join"}</button>
    </form>
  );
}

export function Footer({ onToast }) {
  return (
    <footer className="bg-night border-t border-edge">
      <div className="gold-rule" />
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14 py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img src="/brand/vardas-logo.png" alt="Vardas" className="h-16 w-auto" />
          <p className="mt-6 text-sm leading-[1.9] text-mute max-w-xs">Vardas lounge &amp; club and Vardas Venue — nights, shows and celebrations in Addis Ababa.</p>
          <p className="vx-label !text-[0.6rem] text-cream mt-8">First to hear about nights &amp; shows</p>
          <div className="mt-3"><Newsletter onToast={onToast} /></div>
        </div>
        {[VENUES.vardas, VENUES.venue].map((v) => (
          <div key={v.id} className="lg:col-span-3">
            <p className="vx-display text-lg gold-text">{v.name}</p>
            <p className="text-xs text-mute-2 mt-1">{v.kind}</p>
            <p className="text-sm text-mute mt-4 leading-relaxed">{v.address}</p>
            <a href={v.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 vx-label !text-[0.6rem] text-gold hover:text-gold-light">Instagram @{v.instagram.handle} →</a>
          </div>
        ))}
        <div className="lg:col-span-2">
          <p className="vx-label !text-[0.6rem] text-cream mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-mute">
            <li><a className="hover:text-gold" href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a></li>
            <li><a className="hover:text-gold" href={waLink("Hi Vardas, ")} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a className="hover:text-gold" href={tgLink()} target="_blank" rel="noopener noreferrer">Telegram</a></li>
            <li><a className="hover:text-gold break-all" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><Link className="hover:text-gold" to="/work-with-us">Artists &amp; careers</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edge">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14 py-6 flex flex-wrap gap-4 justify-between text-[0.72rem] text-mute-2">
          <span>© {new Date().getFullYear()} Vardas Entertainment · {SITE.city}</span>
          <span className="flex gap-5"><Link to="/vardas/your-terms" className="hover:text-gold">Your terms</Link><Link to="/vardas/faq" className="hover:text-gold">FAQ</Link><span>Valid ID required</span></span>
        </div>
      </div>
    </footer>
  );
}
