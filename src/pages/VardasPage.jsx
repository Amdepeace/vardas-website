import { Button, EventCard, Heading, InstagramEmbed, Label, Section, VideoHero } from "../components/vx";
import { POLICIES } from "../data/venue";
import { VENUES } from "../data/site";
import { useEvents } from "../lib/events";

export function VardasPage() {
  const v = VENUES.vardas;
  const { events } = useEvents();
  return (
    <div>
      <VideoHero height="tall" align="left" label="Vardas">
        <Label>Lounge &amp; club · Bole</Label>
        <h1 className="vx-display text-[3rem] sm:text-[4.6rem] md:text-[6rem] text-paper mt-5">Vardas</h1>
        <p className="text-grey-4 max-w-md mt-5 leading-[1.9]">{v.tagline} Fifth floor of the Getu Commercial Building, Africa Avenue.</p>
        <div className="flex flex-wrap gap-3 mt-9"><Button to="/vardas/tables">Book a VIP table</Button><Button to="/vardas/events" variant="ghost">What's on</Button></div>
      </VideoHero>

      <Section>
        <div className="grid md:grid-cols-3 gap-px bg-line-dark border border-line-dark">
          {v.hours.map(([k, t]) => <div key={k} className="bg-ink p-8"><p className="vx-label text-red">{k}</p><p className="vx-display text-xl text-paper mt-3">{t}</p></div>)}
        </div>
      </Section>

      <Section tone="raised" className="!pt-0 md:!pt-0 bg-ink">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading label="This week" title="On the" accent="fifth floor" />
          <Button to="/vardas/events" variant="outline">Full programme</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">{events.slice(0, 3).map((e) => <EventCard key={e.slug} e={e} />)}</div>
      </Section>

      <Section tone="raised">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <Heading label="Your night, your terms" title="Prices on the menu." accent="No pressure." intro="Every price is published. Bottle service is only ever on request. The lounge and club floor are smoke-free. A named floor manager is on every night — and we'll book your ride home." />
            <div className="flex flex-wrap gap-3 mt-9"><Button to="/vardas/menu" variant="outline">Menu &amp; prices</Button><Button to="/vardas/your-terms" variant="ghost">Read the pledge</Button></div>
          </div>
          <ul className="border-t border-line-dark">
            {POLICIES.slice(0, 4).map((p) => <li key={p.slug} className="border-b border-line-dark py-6"><p className="vx-display text-base text-paper">{p.title}</p><p className="text-sm text-grey-4 mt-2 leading-relaxed">{p.body}</p></li>)}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Heading label="Find us" title="Getu Commercial" accent="Building" intro={v.address} />
            <div className="flex flex-wrap gap-3 mt-8"><Button to="/vardas/getting-here" variant="outline">Getting here</Button><Button to="/vardas/faq" variant="ghost">FAQ</Button></div>
          </div>
          <div className="lg:col-span-7"><InstagramEmbed handle={v.instagram.handle} url={v.instagram.url} title="Vardas — lounge & club" /></div>
        </div>
      </Section>
    </div>
  );
}
