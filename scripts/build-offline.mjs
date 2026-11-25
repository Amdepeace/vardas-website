// Builds a copy of the site that opens by double-clicking index.html (no server).
// Output: dist-offline/
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";

const out = "dist-offline";
process.env.VITE_OFFLINE = "1";
await build({
  base: "./",
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
fs.writeFileSync(path.join(out, "README.txt"),
  "Vardas website (offline preview)\n\nDouble-click index.html to open it in Chrome, Edge or Firefox.\nKeep all the folders next to index.html.\nForms open your email app instead of sending directly (the live site sends them).\n");
console.log("Offline build ready in", out);
