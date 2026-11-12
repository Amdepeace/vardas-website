import { Link } from "react-router-dom";
import { Button, Heading, PageHero, Section } from "../components/vx";
import { Reveal } from "../components/Reveal";
import { VENUES } from "../data/site";

export function Tour360({ matterportId = null, image = "/gallery/vardas-night-13.jpg", to = "/contact" }) {
  if (matterportId) return <iframe title="360° tour" src={`https://my.matterport.com/show/?m=${matterportId}&play=1&qs=1`} className="w-full aspect-video" allow="xr-spatial-tracking; fullscreen" allowFullScreen />;
  return (
    <Link to={to} className="group relative block aspect-[16/7] min-h-[300px] overflow-hidden vx-focus">
      <img src={image} alt="" loading="lazy" className="vx-card-img absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[2.6rem] font-light tracking-[0.08em] leading-none">360</span><span className="block w-12 h-3 border-b-2 border-paper rounded-[50%] -mt-1" />
        <span className="vx-display text-[1.8rem] sm:text-[2.4rem] mt-4">360 Tour</span>
        <span className="vx-label mt-4">Coming soon — ask for a walk-through <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

const LEFT = ["Fifth-floor lounge, club floor and open-air terrace", "Stage for live bands and guest artists", "Laser and moving-light rig over the floor", "Private room for up to 24 guests"];
const RIGHT = ["Resident DJs four nights a week", "International and Ethiopian kitchen", "Hookah on the terrace · smoke-free inside", "Door team, valet help and vetted rides home"];

export function VardasPage() {
  const v = VENUES.vardas;
  return (
    <div>
      <PageHero title="The venue" image="/gallery/vardas-night-18.jpg" />
      <Section>
        <Reveal><Heading as="h2" size="lg" title="The definitive Addis nightlife experience" /></Reveal>
        <Reveal><div className="max-w-3xl mx-auto text-center text-[0.86rem] leading-[1.95] text-grey-4 mt-7 space-y-5">
          <p>Vardas sits on the fifth floor of the Getu Commercial Building on Africa Avenue, Bole. By evening it is a lounge and restaurant; by ten the lights drop, the lasers come on and the floor belongs to the DJs.</p>
          <p>The week runs from Aura Thursday through Afro Verse Friday and Frenzy Saturday to the live Sunday Jam — with guest artists announced on each poster. Early arrival and reservation are highly recommended.</p>
        </div></Reveal>
      </Section>
      <Tour360 />
      <Section>
        <Reveal><Heading title="Highlights" /></Reveal>
        <div className="grid md:grid-cols-2 max-w-4xl mx-auto mt-9 text-[0.84rem] text-grey-4">
          <ul className="md:text-right md:pr-8 md:border-r border-line-dark space-y-4">{LEFT.map((t) => <li key={t}>{t}</li>)}</ul>
          <ul className="md:pl-8 space-y-4 mt-4 md:mt-0">{RIGHT.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-line-dark border border-line-dark max-w-4xl mx-auto mt-14">
          {v.hours.map(([k, t]) => <div key={k} className="bg-ink-2 p-6 text-center"><p className="vx-label text-grey-4">{k}</p><p className="text-sm mt-2">{t}</p></div>)}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-12"><Button to="/vardas/tables">Reserve a table</Button><Button to="/vardas/events" variant="outline">Upcoming events</Button><Button to="/vardas/menu" variant="outline">Menu & prices</Button></div>
      </Section>
    </div>
  );
}
