import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS, SITE, SWITCHER, VENUES } from "../data/site";
import { waLink, tgLink } from "../lib/contact";
import { submit } from "../lib/api";

function useDropdown() {
  const [open, setOpen] = useState(false); const ref = useRef(null); const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname, loc.search]);
  useEffect(() => {
    if (!open) return;
    const d = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); }; const k = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", d); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return { open, setOpen, ref };
}
const panel = (open) => `absolute top-full pt-3 transition-all duration-200 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`;

function VenueSwitcher() {
  const { open, setOpen, ref } = useDropdown(); const { pathname } = useLocation();
  const current = pathname.startsWith("/venue") ? "Vardas Venue" : "Vardas";
  return (
    <div ref={ref} className="relative">
      <button aria-haspopup="true" aria-expanded={open} aria-label="Choose venue" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 text-[0.62rem] font-bold tracking-[0.1em] uppercase">
        {current}<span className={`text-[0.55rem] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <div className={`${panel(open)} left-0`}>
        <ul className="min-w-[230px] bg-ink-2 border border-line-dark shadow-2xl">
          {SWITCHER.map(([n, d, to]) => <li key={to}><Link to={to} className="block px-5 py-3.5 hover:bg-white/10"><span className="block text-[0.72rem] font-bold tracking-[0.1em] uppercase">{n}</span><span className="block text-[0.7rem] text-grey-4 mt-0.5">{d}</span></Link></li>)}
        </ul>
      </div>
    </div>
  );
}

function NavItem({ l }) {
  const { open, setOpen, ref } = useDropdown(); const { pathname } = useLocation();
  const active = pathname === l.to || (l.items && pathname.startsWith(l.to));
  const cls = `vx-link vx-label ${active ? "is-active" : ""}`;
  if (!l.items) return <li><Link to={l.to} className={cls}>{l.label}</Link></li>;
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={`${cls} flex items-center gap-1.5`}>{l.label}<span className="text-[0.55rem]">▾</span></button>
      <div className={`${panel(open)} left-1/2 -translate-x-1/2`}>
        <ul className="min-w-[220px] bg-ink-2 border border-line-dark py-2 shadow-2xl">
          {l.items.map(([t, to]) => <li key={to}><Link to={to} className="block px-5 py-2.5 text-[0.68rem] font-bold tracking-[0.1em] uppercase text-grey-4 hover:text-paper hover:bg-white/10">{t}</Link></li>)}
        </ul>
      </div>
    </li>
  );
}

export function TopNav() {
  const loc = useLocation(); const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [loc.pathname, loc.search]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);
  return (
    <Fragment>
      <header className="vx-nav fixed top-0 inset-x-0 z-[100] bg-ink/95 backdrop-blur-md border-b border-white/5">
        <div className="h-[72px] px-5 lg:px-10 flex items-center gap-6">
          <Link to="/" aria-label="Vardas home" className="shrink-0"><img src="/brand/vardas-logo.png" alt="Vardas" className="h-11 w-auto" /></Link>
          <VenueSwitcher />
          <ul className="hidden lg:flex flex-1 items-center justify-center gap-8 xl:gap-10">{NAV_LINKS.map((l) => <NavItem key={l.label} l={l} />)}</ul>
          <Link to="/contact" className="hidden lg:block vx-link vx-label">Contact</Link>
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden ml-auto"><span className="material-symbols-outlined">menu</span></button>
        </div>
      </header>
      {drawer && (
        <div className="fixed inset-0 z-[110] bg-ink flex flex-col">
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/10">
            <img src="/brand/vardas-logo.png" alt="Vardas" className="h-10" />
            <button onClick={() => setDrawer(false)} aria-label="Close menu"><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-2 mb-6">{SWITCHER.map(([n, d, to]) => <Link key={to} to={to} className="bg-white/10 p-4"><span className="block vx-label">{n}</span><span className="block text-[0.7rem] text-grey-4 mt-1">{d}</span></Link>)}</div>
            <ul>{[...NAV_LINKS, { label: "Contact", to: "/contact" }].map((l) => (
              <li key={l.label} className="border-b border-white/10">
                <Link to={l.to} className="block py-4 vx-display text-xl">{l.label}</Link>
                {l.items && <ul className="pb-3 pl-3 space-y-2">{l.items.slice(1).map(([t, to]) => <li key={to}><Link to={to} className="text-sm text-grey-4">{t}</Link></li>)}</ul>}
              </li>))}
            </ul>
          </div>
          <div className="p-5 border-t border-white/10 grid grid-cols-2 gap-3">
            <a href={waLink("Hi Vardas, ")} className="vx-label text-center py-4 bg-wa text-ink">WhatsApp</a>
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
    try { const r = await submit({ fn: "enquire", payload: { kind: "newsletter", email }, subject: "Newsletter sign-up", fields: { Email: email } }); onToast(r === "sent" ? "You're on the list" : "Opening your mail app to confirm"); setEmail(""); }
    catch (ex) { onToast(ex.message); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={go} className="mt-4 space-y-3">
      <label htmlFor="nl" className="sr-only">Email address</label>
      <input id="nl" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="vx-field" />
      <button disabled={busy} className="vx-label border border-paper px-7 py-3 hover:bg-paper hover:text-ink transition-colors disabled:opacity-60">{busy ? "…" : "Subscribe"}</button>
    </form>
  );
}

const Social = ({ href, label, children }) => <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-[0.6rem] font-bold hover:bg-paper hover:text-ink transition-colors">{children}</a>;

export function Footer({ onToast }) {
  const cols = [
    ["Book", [["Upcoming events", "/vardas/events"], ["Reserve a table", "/vardas/tables"], ["Corporate & private", "/venue/enquire"]]],
    ["Explore", [["FAQs", "/vardas/faq"], ["Gallery", "/gallery"], ["Menu & prices", "/vardas/menu"], ["Getting here", "/vardas/getting-here"]]],
    ["Learn more", [["Vardas", "/vardas"], ["Vardas Venue", "/venue"], ["Your terms", "/vardas/your-terms"], ["Work with us", "/work-with-us"], ["Contact", "/contact"]]],
  ];
  return (
    <footer className="bg-ink border-t border-white/5">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <img src="/brand/vardas-logo.png" alt="Vardas" className="h-20 w-auto" />
          <div className="flex gap-3 mt-7">
            <Social href={VENUES.vardas.instagram.url} label="Vardas on Instagram">IG</Social>
            <Social href={VENUES.venue.instagram.url} label="Vardas Venue on Instagram">IG·V</Social>
            <Social href={waLink("Hi Vardas, ")} label="WhatsApp">WA</Social>
            <Social href={tgLink()} label="Telegram">TG</Social>
          </div>
        </div>
        {cols.map(([t, links]) => (
          <div key={t} className="md:col-span-2">
            <p className="vx-label mb-5">{t}</p>
            <ul className="space-y-3">{links.map(([l, to]) => <li key={to}><Link to={to} className="text-[0.66rem] font-semibold tracking-[0.1em] uppercase text-grey-4 hover:text-paper transition-colors">{l}</Link></li>)}</ul>
          </div>
        ))}
        <div className="md:col-span-3">
          <p className="vx-label">Subscribe</p>
          <p className="text-[0.78rem] text-grey-4 mt-4 leading-relaxed">Stay ahead of the night — line-ups and table releases first.</p>
          <Newsletter onToast={onToast} />
        </div>
      </div>
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-3 justify-between text-[0.66rem] tracking-[0.06em] text-grey-2">
        <span>© {new Date().getFullYear()} Vardas — All rights reserved.</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2 uppercase font-semibold">
          {SITE.rsvp.map(([tel, d]) => <a key={tel} href={`tel:${tel}`} className="hover:text-paper">RSVP {d}</a>)}
          <a href={`mailto:${SITE.email}`} className="hover:text-paper normal-case">{SITE.email}</a>
        </span>
      </div>
    </footer>
  );
}
