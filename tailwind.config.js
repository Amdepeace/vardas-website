/** @type {import('tailwindcss').Config} */
// Vardas design tokens — ported from the reference portfolio (Swiss-editorial):
// off-white ground, near-black ink, one red accent, hairline greys, Inter
// throughout (300 body / 900 uppercase display), Cormorant Garamond italic for quotes.
const c = {
  paper: "#F8F8F6",
  "paper-2": "#FFFFFF",
  surface: "#F0F0EE",
  ink: "#0A0A0A",
  "ink-2": "#111111",
  "ink-3": "#1A1A1A",
  red: "#E84040",
  "red-soft": "#EF6B6B",
  logo: "#ED1C24",            // the reference logo mark red
  line: "#E0E0DC",
  "line-2": "#E8E8E4",
  "line-dark": "#2A2A2A",
  "grey-1": "#555555",
  "grey-2": "#888888",
  "grey-3": "#999999",
  "grey-4": "#BBBBBB",
  "quote": "#C8C8C0",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...c,
        // ----- admin console (MD3-flavoured tokens) -----
         primary: c.ink, "primary-container": c["ink-2"],
        "primary-fixed": "#FBE3E3", "primary-fixed-dim": "#EF6B6B", "on-primary": "#ffffff",
        "on-primary-container": c.red, "on-primary-fixed": c.ink, "on-primary-fixed-variant": "#444444",
         secondary: "#7a1f1f", "secondary-fixed": "#ffdada", "secondary-fixed-dim": "#f0a3a3",
        "on-secondary-fixed": "#2a0000", "on-secondary-fixed-variant": "#5a1010",
        "charcoal-text": "#333333", background: c.paper,
        "surface-container-lowest": "#ffffff", "surface-container-low": "#f3f3f1", "surface-container": c.surface,
        "surface-container-high": "#e8e8e4", "surface-container-highest": "#e0e0dc", "surface-variant": "#e0e0dc",
        outline: "#74777e", "outline-variant": "#c4c6ce", "on-surface": c.ink, "on-surface-variant": "#44474d",
        "on-background": c.ink, error: "#ba1a1a", "error-container": "#ffdad6", "on-error-container": "#93000a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Inter", "system-ui", "sans-serif"],           // labels are Inter in this system
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],   // quotes only
      },
      letterSpacing: { widest: "0.25em", ultra: "0.3em" },
    },
  },
  plugins: [],
};
