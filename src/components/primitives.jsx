import { useEffect, useRef } from "react";

/** Vardas mark: a "V" set on a fifth-floor line. */
export function Mark({ size = 28, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 7 L16 25 L26 7" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <line x1="4" y1="28" x2="28" y2="28" stroke={color} strokeWidth="1" />
      <line x1="4" y1="4" x2="28" y2="4" stroke={color} strokeWidth="1" opacity=".45" />
    </svg>
  );
}
// Legacy name used by the admin console.
export const Crest = Mark;

export function Logo({ size = "md", inverse = false, className = "" }) {
  const colorMain = inverse ? "text-paper" : "text-night";
  const sz = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className={`inline-flex items-baseline gap-[3px] ${className}`}>
      <span className={`font-serif ${sz} ${colorMain} tracking-[0.22em]`}>VARDAS</span>
      <span className="font-mono text-[9px] text-brass uppercase tracking-[0.2em]">·5F</span>
    </div>
  );
}

export function Kicker({ children, className = "" }) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.25em] text-brass inline-flex items-center gap-2 ${className}`}>
      <span className="inline-block w-6 h-px bg-brass" />
      {children}
    </span>
  );
}

export function SectionHead({ kicker, title, intro, align = "left", inverse = false }) {
  const t = inverse ? "text-paper" : "text-night";
  const m = inverse ? "text-paper/70" : "text-ink/70";
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center mx-auto max-w-2xl" : ""} mb-10 md:mb-14`}>
      {kicker && (
        <div className={`font-mono text-[11px] uppercase tracking-[0.25em] text-brass mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          <span className="inline-block w-6 h-px bg-brass" />
          {kicker}
        </div>
      )}
      <h2 className={`font-serif text-3xl md:text-5xl leading-[1.05] tracking-[-0.01em] ${t} max-w-3xl ${centered ? "mx-auto" : ""}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 max-w-xl text-[15px] md:text-base leading-relaxed ${m} ${centered ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}

export function CTA({ children, onClick, variant = "solid", className = "", as: Tag = "button", href, type, disabled }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-7 py-4 transition-all duration-300 cursor-pointer cta-ripple disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    solid: "bg-night text-paper hover:bg-night-2",
    gold: "bg-brass text-night hover:bg-brass-soft",
    brass: "bg-brass text-night hover:bg-brass-soft",
    ghost: "border border-night text-night hover:bg-night hover:text-paper",
    "ghost-light": "border border-paper/40 text-paper hover:bg-paper hover:text-night",
    link: "!px-0 !py-2 border-b border-brass text-brass hover:text-night hover:border-night bg-transparent",
  };
  function onPointerMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--ry", `${e.clientY - r.top}px`);
  }
  return (
    <Tag type={type} href={href} onClick={onClick} disabled={disabled} onMouseMove={onPointerMove} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Tag>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70 block mb-1">{label}</label>
      {children}
      {hint && !error && <div className="text-[12px] text-muted mt-1.5">{hint}</div>}
      {error && <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember mt-2">⚠ {error}</div>}
    </div>
  );
}

/** Price, always mono, always visible. */
export function Price({ children, className = "" }) {
  return <span className={`font-mono tabular-nums text-[13px] text-night whitespace-nowrap ${className}`}>{children}</span>;
}

/** Safety-tier pill for the circuit guide. */
export function Tier({ tier }) {
  const map = {
    verified: "text-terrace border-terrace/50",
    caution: "text-ember border-ember/50",
    unverified: "text-smoke border-smoke/50",
    closed: "text-smoke border-smoke/50 line-through",
    self: "text-brass border-brass/50",
  };
  return (
    <span className={`inline-block font-mono text-[9px] uppercase tracking-[0.16em] border rounded-full px-2 py-0.5 ${map[tier] || map.unverified}`}>
      {tier}
    </span>
  );
}

export function Placeholder({ label, caption, aspect = "4/3", tone = "light", className = "", src, children }) {
  const seed = (label || "vardas").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const w = aspect === "auto" ? 1800 : 1600;
  const h = 1200;
  const finalSrc = src || `https://picsum.photos/seed/${seed || "vardas"}/${w}/${h}`;
  const stripeClass = tone === "dark" ? "bg-night" : "bg-paper";
  return (
    <div className={`relative w-full overflow-hidden group ${stripeClass} ${className}`} style={aspect !== "auto" ? { aspectRatio: aspect } : undefined}>
      <img
        src={finalSrc}
        alt={label || ""}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement.classList.add(tone === "dark" ? "stripe-bg-dark" : "stripe-bg");
        }}
      />
      {tone === "dark" && <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-night/10 to-transparent pointer-events-none" />}
      {(label || caption) && (
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/75 to-transparent pointer-events-none">
          {label && <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper mb-1">{label}</div>}
          {caption && <div className="font-mono text-[10px] text-paper/80 leading-snug">↳ {caption}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.disconnect(); } }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <Tag ref={ref} className={`fade-up ${className}`}>{children}</Tag>;
}

/** Page hero: night ground, Bodoni headline, brass italic second line. */
export function Hero({ kicker, title, em, intro, label, caption, children, tall = false }) {
  return (
    <section data-screen-label={`${label || title} Hero`} className={`relative w-full ${tall ? "min-h-[88vh] md:min-h-screen" : "min-h-[60vh] md:min-h-[70vh]"} overflow-hidden bg-night text-paper flex items-end`}>
      <div className="absolute inset-0">
        <div className="hero-zoom w-full h-full">
          <Placeholder tone="dark" aspect="auto" label={label} caption={caption} className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 pb-14 md:pb-20">
        <div className="max-w-3xl">
          {kicker && <Kicker className="!text-brass-soft mb-5">{kicker}</Kicker>}
          <h1 className="font-serif text-[42px] md:text-[80px] leading-[0.95] tracking-[-0.015em] text-paper">
            {title}
            {em && (<><br /><em className="italic font-normal text-brass-soft">{em}</em></>)}
          </h1>
          {intro && <p className="mt-7 max-w-lg text-paper/75 text-base leading-relaxed">{intro}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-3 items-center">{children}</div>}
        </div>
      </div>
    </section>
  );
}
