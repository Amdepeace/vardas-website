// Floating customer support: WhatsApp + Telegram always visible; tap the gold
// button for quick topics that open a prefilled chat, or email the inbox.
import { useState } from "react";
import { SITE } from "../data/site";
import { tgLink, waLink } from "../lib/contact";

const WA = <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"/></svg>;
const TG = <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden="true"><path fill="currentColor" d="M27.4 5.6 3.9 14.7c-1.6.6-1.6 1.5-.3 1.9l6 1.9 2.3 7.1c.3.8.2 1.1 1 1.1.6 0 .9-.3 1.2-.6l2.9-2.8 6 4.4c1.1.6 1.9.3 2.2-1l3.9-18.5c.4-1.6-.6-2.3-1.7-1.8ZM11.6 18l12.6-7.9c.6-.4 1.2-.2.7.2L14.4 19.8l-.4 4.7L11.6 18Z"/></svg>;

const TOPICS = [
  ["Book a VIP table", "Hi Vardas, I'd like to book a VIP table for "],
  ["Plan an event at Vardas Venue", "Hi Vardas Venue, I'm planning an event: date ___, guests ___, type ___."],
  ["What's on this week?", "Hi Vardas, what's on this week?"],
  ["Directions & parking", "Hi Vardas, how do I get to you and where can I park?"],
];

export function SupportDock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[90] flex flex-col items-end gap-3">
      <div className={`w-[300px] max-w-[calc(100vw-2rem)] bg-ink-2 border border-line-dark shadow-2xl origin-bottom-right transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`} role="dialog" aria-label="Contact Vardas" aria-hidden={!open}>
        <div className="px-5 py-4 border-b border-line-dark flex items-center gap-3">
          <img src="/brand/vardas-mark.png" alt="" className="w-9 h-9 object-contain" />
          <div><p className="text-paper text-sm font-medium">Vardas guest support</p><p className="text-xs text-grey-4">A real person replies — usually within minutes.</p></div>
        </div>
        <ul className="p-2">
          {TOPICS.map(([t, msg]) => (
            <li key={t} className="flex items-center gap-2 px-3 py-2.5 hover:bg-ink-3">
              <span className="flex-1 text-sm text-paper">{t}</span>
              <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" aria-label={`${t} on WhatsApp`} className="text-wa hover:scale-110 transition-transform">{WA}</a>
              <a href={tgLink()} target="_blank" rel="noopener noreferrer" aria-label={`${t} on Telegram`} className="text-tg hover:scale-110 transition-transform">{TG}</a>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-line-dark flex justify-between text-xs">
          <a href={`mailto:${SITE.email}`} className="text-red hover:text-red-soft">Email us</a>
          <a href={`tel:${SITE.phoneE164}`} className="text-grey-4 hover:text-paper">{SITE.phoneDisplay}</a>
        </div>
      </div>
      <a href={tgLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on Telegram" title="Telegram" className="vx-focus w-12 h-12 rounded-full bg-tg text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">{TG}</a>
      <a href={waLink("Hi Vardas, ")} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="WhatsApp" className="vx-focus w-12 h-12 rounded-full bg-wa text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">{WA}</a>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close support" : "Open support"} className="vx-focus w-14 h-14 rounded-full cta-fill text-ink flex items-center justify-center shadow-2xl hover:brightness-110">
        <span className="material-symbols-outlined">{open ? "close" : "support_agent"}</span>
      </button>
    </div>
  );
}
