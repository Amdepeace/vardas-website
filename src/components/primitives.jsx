import { useEffect, useRef } from "react";

/** Vardas mark: a "V" set between two floor lines. */
export function Mark({ size = 28, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 7 L16 25 L26 7" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
      <line x1="4" y1="28" x2="28" y2="28" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
export const Crest = Mark;

export function Logo({ size = "md", inverse = false, className = "" }) {
  const sz = size === "lg" ? "text-base" : size === "sm" ? "text-[0.7rem]" : "text-[0.8rem]";
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${sz} tracking-[0.18em] uppercase ${inverse ? "text-paper" : "text-ink"} ${className}`}>
      <span className="red-dot" /> Vardas
    </span>
  );
}

/** Tiny red uppercase label with a short rule — the reference's section label. */
export function Kicker({ children, className = "", inverse = false }) {
  return (
    <span className={`label label-rule text-red ${inverse ? "on-dark" : ""} ${className}`}>{children}</span>
  );
}

/**
 * Section heading in the reference's voice: Inter 900 uppercase, optional
 * outlined word(s). `title` is solid; `outline` renders stroked; `red` renders in accent.
 */
export function SectionHead({ kicker, title, outline, red, intro, inverse = false, size = "md", className = "" }) {
  const sz = size === "lg" ? "text-[2.6rem] md:text-[3.5rem]" : "text-[2.2rem] md:text-[3rem]";
  return (
    <div className={`mb-10 ${className}`}>
      {kicker && <Kicker inverse={inverse}>{kicker}</Kicker>}
      <h2 className={`font-display ${sz} mt-4 ${inverse ? "text-paper" : "text-ink"}`}>
        {title}{outline && <> <span className="outline-text">{outline}</span></>}{red && <> <span className="text-red">{red}</span></>}
      </h2>
      {intro && <p className={`mt-5 max-w-xl text-[0.82rem] leading-[1.95] ${inverse ? "text-quote/80" : "text-grey-1"}`}>{intro}</p>}
    </div>
  );
}

export function CTA({ children, onClick, variant = "solid", className = "", as: Tag = "button", href, type, disabled }) {
  const base = "inline-flex items-center justify-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.15em] px-8 py-[0.85rem] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    solid: "bg-ink text-paper hover:bg-red",
    red: "bg-red text-paper hover:bg-ink",
    gold: "bg-ink text-paper hover:bg-red",
    brass: "bg-ink text-paper hover:bg-red",
    ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
    "ghost-light": "border-[1.5px] border-paper/60 text-paper hover:bg-paper hover:text-ink",
    link: "!px-0 !py-1 border-b border-ink text-ink hover:text-red hover:border-red",
  };
  return (
    <Tag type={type} href={href} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>{children}</Tag>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="label block mb-1 text-grey-3 !tracking-[0.2em]">{label}</label>
      {children}
      {hint && !error && <div className="text-[0.7rem] text-grey-3 mt-1.5">{hint}</div>}
      {error && <div className="label text-red mt-2 !tracking-[0.15em]">⚠ {error}</div>}
    </div>
  );
}

/** Price: Inter 500, tabular, never hidden. */
export function Price({ children, className = "" }) {
  return <span className={`font-medium tabular-nums text-[0.78rem] tracking-[0.03em] text-ink whitespace-nowrap ${className}`}>{children}</span>;
}

/** Safety tier for the circuit guide — mono + red system: verified = ink, caution = red, unverified = grey. */
export function Tier({ tier }) {
  const map = {
    verified: "bg-ink text-paper border-ink",
    caution: "bg-red text-paper border-red",
    unverified: "text-grey-3 border-line",
    closed: "text-grey-4 border-line line-through",
    self: "bg-red text-paper border-red",
  };
  return <span className={`inline-block label !tracking-[0.15em] border px-2 py-[3px] ${map[tier] || map.unverified}`}>{tier}</span>;
}

/** Stat cell for a .grid-hair row: big number, tiny label. */
export function Stat({ num, sup, label }) {
  return (
    <div className="p-7 text-center">
      <div className="font-display text-[2.4rem] text-ink !tracking-[-0.02em]">{num}{sup && <sup className="text-base align-super">{sup}</sup>}</div>
      <div className="label text-grey-3 mt-1 !tracking-[0.2em]">{label}</div>
    </div>
  );
}

/** Numbered row with arrow — the reference's service list (on dark). */
export function Row({ index, title, tag, onClick, inverse = true }) {
  return (
    <button onClick={onClick} className={`group w-full grid grid-cols-[2rem,1fr,auto] gap-6 items-center py-[1.4rem] text-left border-b transition-all duration-200 hover:pl-3 ${inverse ? "border-[#1e1e1e]" : "border-line"}`}>
      <span className={`text-[0.6rem] tracking-[0.15em] ${inverse ? "text-[#444]" : "text-grey-4"}`}>{String(index).padStart(2, "0")}</span>
      <span>
        <span className={`block text-[1.05rem] font-normal tracking-[0.06em] group-hover:text-red transition-colors ${inverse ? "text-paper" : "text-ink"}`}>{title}</span>
        {tag && <span className={`block label mt-1 !tracking-[0.15em] ${inverse ? "text-[#444]" : "text-grey-3"}`}>{tag}</span>}
      </span>
      <span className={`w-9 h-9 border flex items-center justify-center text-[0.9rem] transition-all group-hover:bg-red group-hover:text-paper group-hover:border-red ${inverse ? "border-[#2a2a2a] text-grey-1" : "border-line text-grey-2"}`}>→</span>
    </button>
  );
}

/** Image placeholder: grayscale at rest, colour on hover (group). */
export function Placeholder({ label, caption, aspect = "4/3", tone = "light", className = "", src, children, mono = true }) {
  const seed = (label || "vardas").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const finalSrc = src || `https://picsum.photos/seed/${seed || "vardas"}/${aspect === "auto" ? 1800 : 1600}/1200`;
  return (
    <div className={`relative w-full overflow-hidden group ${tone === "dark" ? "bg-ink" : "bg-surface"} ${className}`} style={aspect !== "auto" ? { aspectRatio: aspect } : undefined}>
      <img src={finalSrc} alt={label || ""} loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover ${mono ? "mono-img" : ""} ${tone === "dark" ? "opacity-75" : ""}`}
        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add(tone === "dark" ? "stripe-bg-dark" : "stripe-bg"); }} />
      {caption && <div className="absolute bottom-3 left-3 label text-paper/50 !tracking-[0.25em] !text-[0.55rem]">{caption}</div>}
      {children}
    </div>
  );
}

export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.disconnect(); } }), { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, [delay]);
  return <Tag ref={ref} className={`fade-up ${className}`}>{children}</Tag>;
}

/**
 * Split hero from the reference: left = est. label, 900 uppercase title (solid /
 * outline / red lines), short description, hairline "skill" rows, CTAs;
 * right = full-bleed grayscale image on ink with a tag and the red dot.
 */
export function Hero({ kicker, title, outline, em, intro, rows = [], label, caption, children, tall = false }) {
  return (
    <section data-screen-label={`${label || title} Hero`} className={`grid md:grid-cols-2 ${tall ? "md:min-h-[calc(100vh-70px)]" : "md:min-h-[70vh]"}`}>
      <div className="px-6 md:px-10 py-14 md:py-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-line">
        {kicker && <p className="label text-grey-3 !tracking-[0.25em] !text-[0.62rem] !font-normal mb-6">{kicker}</p>}
        <h1 className={`font-display text-ink ${tall ? "text-[3.4rem] md:text-[5.5rem]" : "text-[3rem] md:text-[4.2rem]"} mb-8`}>
          {title}{outline && <><br /><span className="outline-text">{outline}</span></>}{em && <><br /><span className="text-red">{em}</span></>}
        </h1>
        {intro && <p className="text-[0.78rem] leading-[1.9] text-[#666] max-w-[320px] mb-9">{intro}</p>}
        {rows.length > 0 && (
          <ul className="mb-9 max-w-md">
            {rows.map((r) => (
              <li key={r.k} className="flex justify-between items-center py-[0.65rem] border-b border-line-2 text-[0.72rem] tracking-[0.1em] uppercase text-ink transition-all hover:pl-2 hover:text-red">
                <span>{r.k}</span><span className="text-[0.6rem] text-grey-4 tracking-[0.05em] normal-case">{r.v}</span>
              </li>
            ))}
          </ul>
        )}
        {children && <div className="flex flex-wrap gap-4">{children}</div>}
      </div>
      <div className={`relative bg-ink overflow-hidden ${tall ? "min-h-[46vh] md:min-h-full" : "min-h-[36vh] md:min-h-full"}`}>
        <Placeholder tone="dark" aspect="auto" label={label} className="absolute inset-0" mono />
        {caption && <p className="absolute bottom-10 left-8 label text-paper/50 !tracking-[0.25em] !text-[0.55rem] !font-normal">{caption}</p>}
        <span className="absolute top-12 right-12 w-[18px] h-[18px] rounded-full bg-red" />
      </div>
    </section>
  );
}
