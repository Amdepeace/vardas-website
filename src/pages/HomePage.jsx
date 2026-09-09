import { useState } from "react";
import { CTA, Hero, Kicker, Placeholder, Row, SectionHead, Stat } from "../components/primitives";
import { POLICIES, VENUE, ZONES } from "../data/venue";
import places from "../data/places.json";

const facts = places.vardas_facts;
const FILTERS = [["all", "All"], ["terrace", "Terrace"], ["lounge", "Lounge"], ["club-floor", "Club"], ["private-1", "Private"]];

export function HomePage({ onNavigate, onReserve }) {
  const [filter, setFilter] = useState("all");
  const zones = ZONES.filter((z) => filter === "all" || z.id === filter);
  return (
    <div className="page-enter page-enter-active">
      {/* HERO — split, like the reference */}
      <Hero tall kicker="Est. Bole · Africa Avenue · 5th floor" title="Fifth" outline="floor." em="Your terms."
        intro="Kitchen, terrace, hookah, live music and DJs above Africa Avenue — with every price published, smoke-free rooms, and a safe ride home."
        rows={[{ k: "Business lunch", v: "Mon – Fri · 12:00" }, { k: "Dinner & terrace", v: "Daily · 18:00" }, { k: "Club", v: "Thu – Sat · 22:00" }, { k: "Private hire", v: "4 zones · 24 – 200" }]}
        label="Home hero · terrace at dusk" caption="Getu Commercial Building · Bole">
        <CTA variant="solid" onClick={() => onReserve()}>Reserve a table →</CTA>
        <CTA variant="ghost" onClick={() => onNavigate("menu")}>See the menu &amp; prices</CTA>
      </Hero>

      {/* ABOUT + STATS */}
      <section id="about" className="density-sect px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <SectionHead kicker="About" title="One address." outline="Three nights." />
          <p className="text-[0.82rem] leading-[1.95] text-grey-1 mb-6">
            <strong>Vardas</strong> is a restaurant and lounge, a club, and a professional venue on the fifth floor of the Getu Commercial Building. International and Ethiopian kitchen, a terrace over Africa Avenue, live music and DJs from Thursday to Saturday.
          </p>
          <p className="text-[0.82rem] leading-[1.95] text-grey-1">
            Reviews praised the room, the music and the food — and criticised the pressure to buy bottles, the smoke, and the service. <strong>We wrote it down and changed it, in public.</strong>
          </p>
          <div className="grid-hair grid-cols-3 mt-8">
            <Stat num="5" sup="F" label="Floor · Africa Ave" />
            <Stat num={ZONES.length} label="Zones · 360° toured" />
            <Stat num="2,355" sup="m" label="Altitude · water free" />
          </div>
        </div>
        <div className="relative">
          <Placeholder label="Lounge interior" aspect="3/4" />
          <div className="absolute -bottom-px left-0 right-0 bg-ink px-5 py-4 flex justify-between items-center">
            <span className="label text-grey-2 !tracking-[0.2em] !font-normal">Every price published</span>
            <strong className="label text-paper !tracking-[0.15em] !text-[0.7rem]">Your night, your terms</strong>
          </div>
        </div>
      </section>

      {/* SERVICES — dark numbered rows */}
      <section id="faces" className="bg-ink text-paper density-sect px-6 md:px-10">
        <SectionHead inverse kicker="What we do" title="Three" outline="faces." />
        <div className="-mt-4 flex flex-col">
          <Row index={1} title="Restaurant & lounge" tag="Kitchen · terrace · hookah · business lunch" onClick={() => onNavigate("menu")} />
          <Row index={2} title="Club" tag="DJs & live music · Thu – Sat · smoke-free floor" onClick={() => onNavigate("club")} />
          <Row index={3} title="Events & private hire" tag="Launches · birthdays · corporate · 24 – 200 guests" onClick={() => onNavigate("hire")} />
          <Row index={4} title="Artists & promoters" tag="Play the fifth floor · co-hosted nights" onClick={() => onNavigate("artists")} />
        </div>
      </section>

      {/* WORK GRID — zones with filter */}
      <section id="zones" className="density-sect px-6 md:px-10 !pb-8">
        <SectionHead kicker="The rooms" title="Four" outline="zones." intro="Every zone has a 360° tour, a published capacity, and — where one applies — a published minimum. No surprises at the door." />
        <div className="inline-flex border border-line mb-8">
          {FILTERS.map(([id, l]) => (
            <button key={id} onClick={() => setFilter(id)} className={`px-[1.4rem] py-[0.65rem] text-[0.62rem] font-medium tracking-[0.1em] uppercase border-r border-line last:border-r-0 transition-colors ${filter === id ? "bg-ink text-paper" : "text-grey-2 hover:text-ink"}`}>{l}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[3px] bg-surface">
          {zones.map((z, i) => (
            <button key={z.id} onClick={() => onNavigate("tours")} className={`group text-left bg-paper ${filter === "all" && i === 0 ? "lg:col-span-2" : ""}`}>
              <Placeholder label={`${z.title} · 360°`} aspect={filter === "all" && i === 0 ? "16/9" : "4/3"} />
              <div className="p-4 border-t border-line-2">
                <p className="label text-red !tracking-[0.2em] !text-[0.55rem] mb-1">{z.smoking ? "Smoking · marked areas" : "Smoke-free"} · up to {z.capacity}</p>
                <p className="text-[0.88rem] font-medium text-ink tracking-[0.03em]">{z.title}</p>
                <p className="text-[0.65rem] text-grey-3 mt-1">{z.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL-STYLE — they said / we do */}
      <section id="terms" className="bg-ink density-sect px-6 md:px-10">
        <SectionHead inverse kicker="Your night, your terms" title="They said." red="We do." />
        <div className="grid md:grid-cols-2 gap-8">
          {POLICIES.filter((p) => p.answers).map((p) => (
            <div key={p.slug} className="bg-[#111] p-10 relative">
              <span className="block font-serif text-[5rem] leading-[0.8] text-red opacity-40 mb-4">"</span>
              <p className="font-serif italic text-[1.15rem] leading-[1.7] text-quote mb-6">{p.answers}</p>
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-red text-sm">✓</span>
                <div><p className="label text-paper !tracking-[0.1em] !text-[0.7rem]">{p.title}</p><p className="text-[0.6rem] text-grey-1 mt-1 tracking-[0.08em] max-w-sm">{p.body}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10"><CTA variant="ghost-light" onClick={() => onNavigate("your-terms")}>Read the full pledge →</CTA></div>
      </section>

      {/* TALK */}
      <section id="reserve" className="density-sect px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-[3rem] md:text-[4rem] text-ink">Let's <span className="outline-text">talk</span><br /><span className="text-red">tonight.</span></h2>
          <div className="red-line my-6" />
          <p className="text-[0.82rem] leading-[1.95] text-grey-1 max-w-sm">WhatsApp is fastest and a person answers. Or reserve here — no deposit, no minimum unless the zone shows one, and a ride home if you want it.</p>
          <div className="flex flex-col gap-2.5 mt-8">
            {[["WhatsApp", VENUE.whatsapp], ["Getting here", VENUE.address.split(",")[0] + ", Africa Avenue"], ["Spend", facts.spend_range_etb ? `ETB ${facts.spend_range_etb[0].toLocaleString()} – ${facts.spend_range_etb[1].toLocaleString()} · every price on the menu` : "Every price on the menu"]].map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-3 px-5 py-3 border-[1.5px] border-line text-[0.65rem] tracking-[0.12em] uppercase text-grey-1 max-w-fit hover:border-red hover:text-red transition-colors"><span className="w-2 h-2 rounded-full bg-red" />{k} · <span className="normal-case tracking-normal">{v}</span></span>
            ))}
          </div>
        </div>
        <div className="bg-paper-2 border border-line p-8">
          <Kicker>Reserve</Kicker>
          <p className="font-display text-2xl mt-3 text-ink">A table on your terms</p>
          <p className="text-[0.75rem] leading-[1.9] text-grey-1 mt-3">Lunch, dinner or the club. Pick a zone, tell us the party size, tick "ride home" if you'd like one.</p>
          <CTA variant="solid" className="mt-6 w-full" onClick={() => onReserve()}>Open the reservation form →</CTA>
        </div>
      </section>
    </div>
  );
}
