import { Accordion, PageHero, Section } from "../components/vx";
import { FAQ, VENUES } from "../data/site";

const MAP = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Getu Commercial Building, Africa Avenue, Bole, Addis Ababa");

export function FaqPage() {
  return (
    <div>
      <PageHero title="FAQs" image="/gallery/vardas-night-3.jpg" />
      <Section><div className="max-w-3xl mx-auto"><Accordion items={FAQ} /></div></Section>
      <section className="relative h-[340px] bg-ink-3 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-60" aria-hidden="true"><defs><pattern id="g" width="90" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)"><path d="M0 0H90M0 0V70" stroke="#2a3447" strokeWidth="6" fill="none" /></pattern></defs><rect width="100%" height="100%" fill="url(#g)" /></svg>
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-8 bg-ink-2 border border-line-dark p-7 w-[300px]">
          <p className="vx-label">Vardas</p>
          <p className="text-sm text-grey-4 mt-3 leading-relaxed">{VENUES.vardas.address}</p>
          <a href={MAP} target="_blank" rel="noopener noreferrer" className="vx-link vx-label inline-block mt-5">Get directions</a>
        </div>
      </section>
    </div>
  );
}
