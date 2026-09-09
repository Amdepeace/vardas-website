/** @type {import('tailwindcss').Config} */
// Vardas design tokens. The legacy names (navy / gold / cream / charcoal) are
// kept as aliases of the Vardas palette so existing components keep working
// during the rebrand; new code should use the Vardas names.
const vardas = {
  night: "#0E0B10",
  "night-2": "#1A1520",
  "night-deep": "#060409",
  brass: "#C8A452",
  "brass-soft": "#E3C57A",
  smoke: "#8C8A94",
  paper: "#F5F1EA",
  "paper-2": "#FBF9F5",
  ink: "#1B171E",
  terrace: "#2F6B4F",
  ember: "#D3572E",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...vardas,
        // ----- Legacy aliases (public site) -----
        navy: vardas.night,
        "navy-deep": vardas["night-deep"],
        gold: vardas.brass,
        "gold-soft": vardas["brass-soft"],
        cream: vardas.paper,
        surface: vardas["paper-2"],
        charcoal: vardas.ink,
        muted: "#6E6975",
        line: "#E3DDD3",
        "line-dark": "#2C2533",

        // ----- Admin console (MD3-flavoured tokens) -----
        "deep-navy": vardas.night,
        primary: vardas.night,
        "primary-container": vardas["night-2"],
        "primary-fixed": "#F1E6C9",
        "primary-fixed-dim": "#E3C57A",
        "on-primary": "#ffffff",
        "on-primary-container": "#C8A452",
        "on-primary-fixed": "#1B171E",
        "on-primary-fixed-variant": "#4A4152",
        "warm-gold": vardas.brass,
        secondary: "#755b00",
        "secondary-fixed": "#ffdf91",
        "secondary-fixed-dim": "#e7c361",
        "on-secondary-fixed": "#241a00",
        "on-secondary-fixed-variant": "#594400",
        "charcoal-text": "#333333",
        background: "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-variant": "#e2e2e2",
        outline: "#74777e",
        "outline-variant": "#c4c6ce",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#44474d",
        "on-background": "#1a1c1c",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', "Didot", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "56px", fontWeight: "500" }],
        "headline-lg": ["36px", { lineHeight: "44px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "cta-label": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.15em", fontWeight: "600" }],
      },
      letterSpacing: { widest: "0.25em" },
    },
  },
  plugins: [],
};
