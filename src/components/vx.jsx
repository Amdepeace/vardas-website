// Vardas Entertainment UI kit (dark + gold).
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Label({ children, className = "" }) {
  return <p className={`vx-label text-gold flex items-center gap-3 ${className}`}><span className="w-8 h-px bg-gold/70" />{children}</p>;
}

export function Heading({ label, title, gold, intro, center = false, className = "", as: H = "h2", size = "md" }) {
  const sz = size === "lg" ? "text-[2.2rem] sm:text-[3.2rem] md:text-[4rem]" : "text-[1.8rem] sm:text-[2.4rem] md:text-[3rem]";
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {label && <Label className={center ? "justify-center" : ""}>{label}</Label>}
      <H className={`vx-display ${sz} text-cream mt-4 text-balance`}>{title}{gold && <> <span className="gold-text">{gold}</span></>}</H>
      {intro && <p className={`mt-5 text-[0.95rem] leading-[1.85] text-mute max-w-xl ${center ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}

const BTN = {
  gold: "gold-fill text-night hover:brightness-110",
  outline: "border border-gold/70 text-gold hover:bg-gold hover:text-night",
  ghost: "border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-night",
  dark: "bg-night-3 text-cream border border-edge hover:border-gold",
};
export function Button({ to, href, onClick, children, variant = "gold", className = "", type = "button", disabled, target }) {
  const cls = `vx-focus inline-flex items-center justify-center gap-2 vx-label !tracking-[0.24em] px-7 py-[0.95rem] transition-all duration-200 disabled:opacity-50 ${BTN[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls} target={target} rel={target ? "noopener noreferrer" : undefined}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function Section({ children, className = "", id, tone = "night" }) {
  const bg = { night: "bg-night", raised: "bg-night-2" }[tone];
  return <section id={id} className={`${bg} px-5 sm:px-8 lg:px-14 py-20 md:py-28 ${className}`}><div className="max-w-[1320px] mx-auto">{children}</div></section>;
}

/** Full-bleed cinematic hero: video (poster first), dark gradient, centred or left content. */
export function VideoHero({ video = "/media/vardas-hero.mp4", videoMobile = "/media/vardas-hero-480.mp4", poster = "/media/vardas-hero-poster.jpg", image, children, height = "full", align = "center", label = "Hero" }) {
  const ref = useRef(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const el = ref.current; if (!el || mq.matches) return;
    el.play?.().catch(() => {});
  }, []);
  const h = height === "full" ? "min-h-[100svh]" : "min-h-[72svh]";
  return (
    <section aria-label={label} className={`relative ${h} overflow-hidden bg-night flex ${align === "center" ? "items-center justify-center text-center" : "items-end"} vx-grain`}>
      {image || reduced ? (
        <img src={image || poster} alt="" className="absolute inset-0 w-full h-full object-cover" fetchpriority="high" />
      ) : (
        <video ref={ref} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
          <source src={videoMobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={video} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/35 to-night" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,6,5,.75)_100%)]" />
      <div className={`relative z-10 w-full px-5 sm:px-8 lg:px-14 ${align === "center" ? "py-32" : "pb-16 md:pb-24 pt-40"}`}>
        <div className={`max-w-[1320px] mx-auto ${align === "center" ? "flex flex-col items-center" : ""}`}>{children}</div>
      </div>
    </section>
  );
}

export function Field({ label, children, hint, error }) {
  return (
    <label className="block">
      <span className="vx-label !text-[0.6rem] text-mute block mb-2">{label}</span>
      {children}
      {hint && !error && <span className="block text-[0.75rem] text-mute-2 mt-1.5">{hint}</span>}
      {error && <span className="block text-[0.75rem] text-gold mt-1.5">{error}</span>}
    </label>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => { if (!message) return; const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, [message, onDone]);
  if (!message) return null;
  return (
    <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] toast-in">
      <div className="bg-night-3 border border-gold/50 text-cream px-5 py-3 vx-label !tracking-[0.18em] shadow-2xl">{message}</div>
    </div>
  );
}

export function EventCard({ e, compact = false }) {
  const d = e.date;
  return (
    <Link to={`/vardas/events/${e.slug}`} className="group block vx-focus bg-night-2 border border-edge hover:border-gold/60 transition-colors">
      <div className={`relative overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
        <img src={e.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="absolute top-4 left-4 bg-night/80 backdrop-blur px-3 py-2 text-center border border-gold/40">
          <div className="vx-label !text-[0.55rem] text-gold">{d.toLocaleDateString("en-GB", { weekday: "short" })}</div>
          <div className="vx-display text-2xl text-cream leading-none mt-1">{d.getDate()}</div>
          <div className="vx-label !text-[0.55rem] text-mute mt-1">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
        </div>
      </div>
      <div className="p-5">
        <p className="vx-label !text-[0.58rem] text-gold">{e.kind} · {e.time}</p>
        <h3 className="vx-display text-xl text-cream mt-2 group-hover:text-gold-light transition-colors">{e.title}</h3>
        <p className="text-sm text-mute mt-2">{e.lineup.join(" · ")}</p>
        <p className="vx-label !text-[0.58rem] text-mute-2 mt-4">{e.cover === null ? "Cover announced weekly" : e.cover === 0 ? "No cover" : `Cover ETB ${e.cover}`}</p>
      </div>
    </Link>
  );
}

/** Instagram profile embed with a permanent, styled link card underneath (if the frame is blocked, the card still works). */
export function InstagramEmbed({ handle, url, title }) {
  return (
    <div className="bg-night-2 border border-edge">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-edge">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-full p-[2px] bg-[conic-gradient(#f0a818,#e2a93b,#a8622a,#f3cd76,#f0a818)] shrink-0"><img src="/brand/vardas-mark.png" alt="" className="w-full h-full rounded-full bg-night object-contain p-1" /></span>
          <div className="min-w-0"><p className="text-cream text-sm font-medium truncate">@{handle}</p><p className="text-mute-2 text-xs truncate">{title}</p></div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="vx-focus vx-label !text-[0.58rem] text-night gold-fill px-4 py-2 shrink-0">Follow</a>
      </div>
      <div className="relative h-[520px] bg-night-3">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8" aria-hidden="true">
          <img src="/brand/vardas-mark.png" alt="" className="w-20 opacity-80" />
          <p className="text-cream mt-6">@{handle}</p>
          <p className="text-sm text-mute mt-2 max-w-xs">Latest posts load here from Instagram.</p>
        </div>
        <iframe title={`Instagram — @${handle}`} src={`https://www.instagram.com/${handle}/embed/`} loading="lazy" className="relative w-full h-full" style={{ colorScheme: "normal" }} referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="vx-focus block text-center vx-label !text-[0.6rem] text-gold py-4 border-t border-edge hover:bg-night-3">Open @{handle} on Instagram →</a>
    </div>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-edge">
      {items.map(([q, a], i) => (
        <li key={q} className="border-b border-edge">
          <button className="vx-focus w-full flex items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="text-cream text-[1.02rem] font-medium">{q}</span>
            <span className={`text-gold text-2xl leading-none transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-mute leading-[1.85] max-w-2xl">{a}</p></div>
        </li>
      ))}
    </ul>
  );
}

export function PageHero({ label, title, gold, intro, image = "/media/vardas-hero-poster.jpg", children }) {
  return (
    <section className="relative min-h-[62svh] flex items-end overflow-hidden bg-night vx-grain">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/50 to-night" />
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-14 pb-14 md:pb-20 pt-40">
        <div className="max-w-[1320px] mx-auto">
          <Heading as="h1" size="lg" label={label} title={title} gold={gold} intro={intro} />
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function Tier({ tier }) {
  const map = { verified: "border-gold/60 text-gold", caution: "border-[#E5484D]/60 text-[#F08A8D]", unverified: "border-edge text-mute-2", closed: "border-edge text-mute-2 line-through", self: "border-gold text-gold" };
  return <span className={`inline-block vx-label !text-[0.55rem] !tracking-[0.16em] border px-2 py-1 ${map[tier] || map.unverified}`}>{tier}</span>;
}
