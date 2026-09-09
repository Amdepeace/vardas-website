import { Fragment, useEffect, useRef, useState } from "react";
import { askHost, backendReady } from "../lib/api";

const SUGGESTIONS = ["What's on tonight?", "How much is a night for four?", "Is the lounge smoke-free?", "Can you book me a ride home?"];
const OFFLINE = "I'm being set up — until then, message us on WhatsApp at +251 11 000 0000 and the floor manager will reply personally.";

export function HostWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Selam — I'm the host at Vardas. Ask me what's on, what things cost, or how to get here and home safely." }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy]);

  async function send(text) {
    const t = (text || "").trim();
    if (!t || busy) return;
    const next = [...msgs, { role: "user", content: t }];
    setMsgs(next); setDraft(""); setBusy(true);
    try {
      const reply = backendReady ? (await askHost(next.filter((m) => m.role !== "system"))).reply : OFFLINE;
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: OFFLINE }]);
    } finally { setBusy(false); }
  }

  return (
    <Fragment>
      <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close host" : "Ask the host"}
        className={`fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open ? "bg-ink text-paper rotate-90" : "bg-red text-ink hover:scale-105"}`}>
        <span className="material-symbols-outlined">{open ? "close" : "chat_bubble"}</span>
      </button>
      <div className={`fixed bottom-24 right-6 z-[69] w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-paper border border-line shadow-2xl flex flex-col origin-bottom-right transition-all duration-300 ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
        <div className="px-5 py-4 border-b border-line bg-ink text-paper flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red/20 flex items-center justify-center"><span className="font-display text-red-soft text-lg">S</span></div>
          <div className="flex-1">
            <p className="font-display text-base tracking-[0.18em]">HOST</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${backendReady ? "bg-ink animate-pulse" : "bg-grey-3"}`} /> {backendReady ? "Online · Selam" : "Preview · Selam"}
            </p>
          </div>
        </div>
        <div ref={scroller} className="flex-1 overflow-y-auto p-4 space-y-3 no-bar">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-ink text-paper rounded-2xl rounded-br-sm" : "bg-paper-2 border border-line text-ink rounded-2xl rounded-bl-sm"}`}>{m.content}</div>
            </div>
          ))}
          {busy && <div className="flex justify-start"><div className="bg-paper-2 border border-line rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">{[0, 150, 300].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-red animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>}
        </div>
        {msgs.length <= 1 && !busy && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="text-[11px] text-ink/80 bg-paper-2 border border-line rounded-full px-3 py-1.5 hover:border-red hover:text-red transition-colors">{s}</button>)}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); send(draft); }} className="border-t border-line p-3 flex items-center gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask the host…" disabled={busy} className="flex-1 bg-transparent text-sm focus:outline-none px-2 py-2 placeholder:text-grey-2" />
          <button type="submit" disabled={busy || !draft.trim()} className="w-9 h-9 rounded-full bg-red text-ink flex items-center justify-center disabled:opacity-40 hover:bg-ink hover:text-paper transition-colors" aria-label="Send">
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </form>
      </div>
    </Fragment>
  );
}
