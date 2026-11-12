// Vardas Entertainment UI kit (dark + gold).
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Label({ children, className = "" }) {
  return <p className={`vx-label text-grey-4 ${className}`}>{children}</p>;
}

export function Heading({ label, title, accent, intro, center = true, className = "", as: H = "h2", size = "md" }) {
  const sz = size === "lg" ? "text-[1.9rem] sm:text-[2.6rem]" : "text-[1.5rem] sm:text-[2rem]";
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {label && <Label>{label}</Label>}
      <H className={`vx-display ${sz} text-paper ${label ? "mt-3" : ""} text-balance`}>{title}{accent && <> {accent}</>}</H>
      {intro && <p className={`mt-5 text-[0.86rem] leading-[1.9] text-grey-4 max-w-2xl ${center ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}

const BTN = {
  gold: "cta-fill",
  outline: "border border-paper text-paper hover:bg-paper hover:text-ink",
  ghost: "border border-white/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  dark: "bg-ink-3 text-paper border border-line-dark hover:border-paper",
};
export function Button({ to, href, onClick, children, variant = "gold", className = "", type = "button", disabled, target }) {
  const cls = `vx-focus inline-flex items-center justify-center gap-2 vx-label px-7 py-[0.85rem] transition-all duration-200 disabled:opacity-50 ${BTN[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls} target={target} rel={target ? "noopener noreferrer" : undefined}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function Section({ children, className = "", id, tone = "night" }) {
  return <section id={id} className={`${tone === "raised" ? "bg-ink-2" : "vx-bg"} px-5 sm:px-8 lg:px-10 py-16 md:py-24 ${className}`}><div className="max-w-[1320px] mx-auto">{children}</div></section>;
}

/** Full-width hero film directly under the nav, with a floating round CTA (top right) and optional content. */
export function VideoHero({ video = "/media/vardas-hero.mp4", videoMobile = "/media/vardas-hero-480.mp4", poster = "/media/vardas-hero-poster.jpg", image, children, orb = { to: "/vardas/tables", text: ["Tables &", "RSVP"] }, label = "Hero" }) {
  const ref = useRef(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); setReduced(mq.matches); if (!mq.matches) ref.current?.play?.().catch(() => {}); }, []);
  return (
    <section aria-label={label} className="relative mt-[72px] h-[calc(100svh-72px)] min-h-[420px] overflow-hidden bg-ink">
      {image || reduced ? <img src={image || poster} alt="" className="absolute inset-0 w-full h-full object-cover" fetchpriority="high" /> : (
        <video ref={ref} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
          <source src={videoMobile} type="video/mp4" media="(max-width: 767px)" /><source src={video} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
      {orb && <Link to={orb.to} className="vx-orb absolute top-6 right-6 sm:top-8 sm:right-10 z-10"><span>{orb.text[0]}<br />{orb.text[1]}</span></Link>}
      {children && <div className="absolute inset-x-0 bottom-0 z-10 px-6 lg:px-10 pb-10 sm:pb-14">{children}</div>}
    </section>
  );
}

export function Field({ label, children, hint, error }) {
  return (
    <label className="block">
      <span className="vx-label !text-[0.6rem] text-grey-4 block mb-2">{label}</span>
      {children}
      {hint && !error && <span className="block text-[0.75rem] text-grey-2 mt-1.5">{hint}</span>}
      {error && <span className="block text-[0.75rem] text-red mt-1.5">{error}</span>}
    </label>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => { if (!message) return; const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, [message, onDone]);
  if (!message) return null;
  return (
    <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] toast-in">
      <div className="bg-ink-3 border border-red/50 text-paper px-5 py-3 vx-label !tracking-[0.18em] shadow-2xl">{message}</div>
    </div>
  );
}

/** Poster card: the artwork is the card; date strip and title sit underneath. */
export function EventCard({ e }) {
  const d = e.date;
  return (
    <Link to={`/vardas/events/${e.slug}`} className="group block vx-focus">
      <div className="relative overflow-hidden aspect-[4/5] bg-ink-3">
        <img src={e.image} alt={`${e.title} poster`} loading="lazy" className="vx-card-img absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-paper text-ink text-center vx-label py-3">Tables & RSVP</div>
      </div>
      <p className="vx-label text-grey-4 mt-4">{d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
      <h3 className="vx-display text-lg text-paper mt-1">{e.title}</h3>
      <p className="text-[0.76rem] text-grey-4 mt-1 line-clamp-1">{e.lineup.join(" · ")}</p>
    </Link>
  );
}

/** Instagram profile embed with a permanent, styled link card underneath (if the frame is blocked, the card still works). */
export function InstagramEmbed({ handle, url, title }) {
  return (
    <div className="bg-ink-2 border border-line-dark">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-line-dark">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-full p-[2px] bg-red shrink-0"><img src="/brand/vardas-mark.png" alt="" className="w-full h-full rounded-full bg-ink object-contain p-1" /></span>
          <div className="min-w-0"><p className="text-paper text-sm font-medium truncate">@{handle}</p><p className="text-grey-2 text-xs truncate">{title}</p></div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="vx-focus vx-label !text-[0.58rem] text-ink cta-fill px-4 py-2 shrink-0">Follow</a>
      </div>
      <div className="relative h-[520px] bg-ink-3">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8" aria-hidden="true">
          <img src="/brand/vardas-mark.png" alt="" className="w-20 opacity-80" />
          <p className="text-paper mt-6">@{handle}</p>
          <p className="text-sm text-grey-4 mt-2 max-w-xs">Latest posts load here from Instagram.</p>
        </div>
        <iframe title={`Instagram — @${handle}`} src={`https://www.instagram.com/${handle}/embed/`} loading="lazy" className="relative w-full h-full" style={{ colorScheme: "normal" }} referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="vx-focus block text-center vx-label !text-[0.6rem] text-red py-4 border-t border-line-dark hover:bg-ink-3">Open @{handle} on Instagram →</a>
    </div>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-line-dark">
      {items.map(([q, a], i) => (
        <li key={q} className="border-b border-line-dark">
          <button className="vx-focus w-full flex items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="vx-label !text-[0.82rem]">{q}</span>
            <span className={`text-paper text-3xl font-light leading-none transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-grey-4 leading-[1.85] max-w-2xl">{a}</p></div>
        </li>
      ))}
    </ul>
  );
}

/** Page banner: a short image strip under the nav with the page title centred on it. */
export function PageHero({ label, title, accent, intro, image = "/media/vardas-hero-poster.jpg", children }) {
  return (
    <Fragment>
      <section className="relative mt-[72px] h-[150px] sm:h-[190px] flex items-center justify-center overflow-hidden bg-ink">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <h1 className="relative vx-display text-[1.7rem] sm:text-[2.4rem] text-paper text-center px-4">{title}{accent && <> {accent}</>}</h1>
      </section>
      {(intro || children) && (
        <div className="vx-bg px-6 pt-12 text-center">
          {label && <Label>{label}</Label>}
          {intro && <p className="max-w-2xl mx-auto text-[0.86rem] leading-[1.9] text-grey-4 mt-3">{intro}</p>}
          {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
      )}
    </Fragment>
  );
}

export function Tier({ tier }) {
  const map = { verified: "bg-paper text-ink border-paper", caution: "bg-red text-paper border-red", unverified: "border-line-dark text-grey-2", closed: "border-line-dark text-grey-2 line-through", self: "bg-red text-paper border-red" };
  return <span className={`inline-block vx-label !text-[0.55rem] !tracking-[0.16em] border px-2 py-1 ${map[tier] || map.unverified}`}>{tier}</span>;
}
