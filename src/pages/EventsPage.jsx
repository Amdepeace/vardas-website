import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button, EventCard, PageHero, Section } from "../components/vx";
import { useEvents } from "../lib/events";
import { SITE } from "../data/site";
import { waLink } from "../lib/contact";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEK = [1, 2, 3, 4, 5, 6, 0];
const fmt = (d, o) => d.toLocaleDateString("en-GB", o);

function EventDetail({ e }) {
  return (
    <div>
      <PageHero title={e.title} image="/media/vardas-hero-poster.jpg" />
      <Section>
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="md:col-span-5"><img src={e.image} alt={`${e.title} poster`} className="w-full" /></div>
          <div className="md:col-span-7">
            <p className="vx-label text-grey-4">{fmt(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Doors {e.time}</p>
            <h2 className="vx-display text-[1.8rem] sm:text-[2.6rem] mt-2">{e.title}</h2>
            <p className="vx-label text-grey-4 mt-8">Line-up</p>
            <ul className="mt-3 flex flex-wrap gap-2">{e.lineup.map((a) => <li key={a} className="border border-white/25 px-3 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.06em]">{a}</li>)}</ul>
            <dl className="grid grid-cols-3 gap-px bg-line-dark border border-line-dark mt-9">
              {[["Where", "Bole · Getu Commercial · 5th floor"], ["Cover", e.cover === null ? "Announced on the night's poster" : e.cover === 0 ? "No cover" : `ETB ${e.cover}`], ["Dress", e.dress]].map(([k, v]) => <div key={k} className="bg-ink-2 p-5"><dt className="vx-label text-grey-4">{k}</dt><dd className="text-sm mt-2">{v}</dd></div>)}
            </dl>
            <p className="text-[0.8rem] text-grey-4 mt-5">Early arrival and reservation highly recommended.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button to={`/vardas/tables?event=${e.slug}`}>Reserve a table</Button>
              <Button href={waLink(`Hi Vardas, RSVP for ${e.title} on ${fmt(e.date, { weekday: "long", day: "numeric", month: "long" })}: `)} target="_blank" variant="outline">RSVP on WhatsApp</Button>
            </div>
            <p className="text-[0.78rem] text-grey-4 mt-6">RSVP by phone: {SITE.rsvp.map(([tel, d], i) => <span key={tel}>{i > 0 && " · "}<a className="underline hover:text-paper" href={`tel:${tel}`}>{d}</a></span>)}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function EventsPage() {
  const { slug } = useParams();
  const { events } = useEvents();
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
  const [artist, setArtist] = useState("all");
  const [day, setDay] = useState("all");
  const [view, setView] = useState("agenda");
  const artists = useMemo(() => [...new Set(events.flatMap((e) => e.lineup))].sort(), [events]);
  const shown = events.filter((e) => e.date >= new Date(from + "T00:00:00") && (artist === "all" || e.lineup.includes(artist)) && (day === "all" || e.date.getDay() === Number(day)));

  if (slug) { const e = events.find((x) => x.slug === slug); return e ? <EventDetail e={e} /> : <Navigate to="/vardas/events" replace />; }

  return (
    <div>
      <PageHero title="Upcoming events" image="/media/vardas-hero-poster.jpg" />
      <Section className="!pt-8">
        <div className="flex flex-wrap items-center gap-3 border-b border-line-dark pb-5 mb-8">
          <label className="sr-only" htmlFor="f-from">From date</label>
          <input id="f-from" type="date" className="vx-field !w-auto !py-2.5 !text-[0.72rem] font-semibold uppercase" value={from} onChange={(e) => setFrom(e.target.value)} />
          <label className="sr-only" htmlFor="f-artist">Artist</label>
          <select id="f-artist" className="vx-field !w-auto !py-2.5 !text-[0.72rem] font-semibold uppercase" value={artist} onChange={(e) => setArtist(e.target.value)}><option value="all">All artists</option>{artists.map((a) => <option key={a}>{a}</option>)}</select>
          <label className="sr-only" htmlFor="f-day">Day</label>
          <select id="f-day" className="vx-field !w-auto !py-2.5 !text-[0.72rem] font-semibold uppercase" value={day} onChange={(e) => setDay(e.target.value)}><option value="all">All days</option>{WEEK.map((d) => <option key={d} value={d}>{DAYS[d]}</option>)}</select>
          <div className="ml-auto flex gap-5" role="tablist" aria-label="View">
            {[["agenda", "Agenda"], ["calendar", "Calendar"], ["list", "List"]].map(([id, l]) => <button key={id} role="tab" aria-selected={view === id} onClick={() => setView(id)} className={`vx-label transition-colors ${view === id ? "text-paper" : "text-grey-2 hover:text-paper"}`}>{l}</button>)}
          </div>
        </div>

        {shown.length === 0 ? <p className="text-center text-grey-4 py-20">No events match those filters.</p> : view === "agenda" ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{shown.map((e) => <EventCard key={e.slug} e={e} />)}</div>
        ) : view === "calendar" ? (
          <div className="overflow-x-auto"><div className="grid grid-cols-7 gap-2 min-w-[840px]">
            {WEEK.map((d) => { const ev = shown.filter((e) => e.date.getDay() === d); return (
              <div key={d}>
                <p className="vx-label text-center text-grey-4 pb-3">{DAYS[d]}</p>
                {ev.length ? ev.map((e) => <Link key={e.slug} to={`/vardas/events/${e.slug}`} className="group block relative"><span className="absolute top-1 left-1 z-10 bg-ink/80 text-[0.6rem] font-bold px-1.5 py-0.5">{fmt(e.date, { month: "short", day: "numeric" })}</span><div className="overflow-hidden aspect-[4/5]"><img src={e.image} alt={e.title} className="vx-card-img w-full h-full object-cover object-top" /></div></Link>) : <div className="aspect-[4/5] border border-dashed border-line-dark" />}
              </div>); })}
          </div></div>
        ) : (
          <ul className="border-t border-line-dark">{shown.map((e) => (
            <li key={e.slug} className="border-b border-line-dark"><Link to={`/vardas/events/${e.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 hover:bg-white/5 px-2 transition-colors">
              <span className="w-16 text-center"><span className="block vx-label text-grey-4">{fmt(e.date, { weekday: "short" })}</span><span className="block vx-display text-2xl">{e.date.getDate()}</span><span className="block vx-label text-grey-4">{fmt(e.date, { month: "short" })}</span></span>
              <span><span className="block vx-display text-lg">{e.title}</span><span className="block text-[0.78rem] text-grey-4 mt-1">{e.lineup.join(" · ")}</span></span>
              <span className="vx-label hidden sm:block">Tables & RSVP <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
            </Link></li>))}
          </ul>
        )}
      </Section>
    </div>
  );
}
