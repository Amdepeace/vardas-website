// Builds a copy of the site that opens by double-clicking index.html (no server).
// Output: dist-offline/
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";

const out = "dist-offline";
process.env.VITE_OFFLINE = "1";
// Swap Google Fonts for local copies so the offline site needs no internet.
const localFonts = {
  name: "local-fonts",
  transformIndexHtml: (html) =>
    html
      .replace(/\s*<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>/g, "")
      .replace("</head>", '    <link rel="stylesheet" href="./fonts/fonts.css" />\n  </head>'),
};

await build({
  base: "./",
  plugins: [localFonts],
  build: {
    outDir: out,
    emptyOutDir: true,
    rollupOptions: { output: { format: "iife", inlineDynamicImports: true } },
  },
});

// file:// pages cannot load ES modules, and root-relative paths point at the drive root.
const roots = ["media", "brand", "events", "gallery", "images", "fonts"];
const fix = (s) =>
  roots.reduce((t, r) => t.replace(new RegExp(`(["'(\`])/${r}/`, "g"), `$1./${r}/`), s);
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(out).filter((f) => /\.(js|css|html)$/.test(f))) {
  let s = fix(fs.readFileSync(f, "utf8"));
  if (f.endsWith("index.html"))
    s = s.replace(/<script type="module" crossorigin/g, "<script defer")
         .replace(/ crossorigin/g, "");
  fs.writeFileSync(f, s);
}
// Copy the font files next to the page.
const fontDir = path.join(out, "fonts");
fs.mkdirSync(fontDir, { recursive: true });
const ms = "node_modules/@fontsource/montserrat/files";
const faces = [[300, "normal"], [400, "normal"], [500, "normal"], [600, "normal"],
  [700, "normal"], [800, "normal"], [400, "italic"]];
let css = "";
for (const [w, st] of faces) {
  const file = `montserrat-latin-${w}-${st}.woff2`;
  fs.copyFileSync(path.join(ms, file), path.join(fontDir, file));
  css += `@font-face{font-family:"Montserrat";font-style:${st};font-weight:${w};font-display:swap;src:url("./${file}") format("woff2")}\n`;
}
const icons = "node_modules/material-symbols";
fs.copyFileSync(path.join(icons, "material-symbols-outlined.woff2"),
  path.join(fontDir, "material-symbols-outlined.woff2"));
css += fs.readFileSync(path.join(icons, "outlined.css"), "utf8");
fs.writeFileSync(path.join(fontDir, "fonts.css"), css);

fs.writeFileSync(path.join(out, "README.txt"),
  "Vardas website (offline preview)\n\nDouble-click index.html to open it in Chrome, Edge or Firefox.\nKeep all the folders next to index.html.\nEverything (fonts, icons, videos, posters) is included, so it works without internet.\nForms open your email app instead of sending directly (the live site sends them).\nThe Instagram feeds need internet; offline they show a Vardas placeholder.\n");
console.log("Offline build ready in", out);
