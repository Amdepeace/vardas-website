import { Button, Heading, InstagramEmbed, Label, Section } from "../components/vx";
import { VENUES } from "../data/site";

const TYPES = ["corporate", "private", "concert", "corporate", "wedding"];

/** 360° / Matterport slot — pass a Matterport model id to switch from the teaser to the live tour. */
export function Tour360({ matterportId = null }) {
  if (matterportId) return <iframe title="Vardas Venue 360° tour" src={`https://my.matterport.com/show/?m=${matterportId}&play=1&qs=1`} className="w-full aspect-video border border-edge" allow="xr-spatial-tracking; fullscreen" allowFullScreen />;
  return (
    <div className="relative aspect-video border border-edge overflow-hidden bg-night-2">
      <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline poster="/media/vardas-hero-poster.jpg"><source src="/media/vardas-hero-480.mp4" type="video/mp4" /></video>
      <div className="absolute inset-0 bg-night/50 flex flex-col items-center justify-center text-center p-6">
        <span className="vx-display text-4xl gold-text">360°</span>
        <p className="vx-label text-cream mt-4">Walk-through tour coming soon</p>
        <p className="text-sm text-mute mt-2 max-w-sm">Ask for a site visit in the meantime — we'll show you the room in person.</p>
      </div>
    </div>
  );
}

export function VenuePage() {
  const v = VENUES.venue;
  return (
    <div>
      <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-night vx-grain">
        <img src={v.image} alt="" className="absolute inset-0 w-full h-full object-cover object-left" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/50" /><div className="absolute inset-0 bg-gradient-to-r from-transparent via-night/30 to-night/80" />
        <div className="relative z-10 w-full px-5 sm:px-8 lg:px-14 pb-16 md:pb-24 pt-40">
          <div className="max-w-[1320px] mx-auto">
            <Label>{v.kind}</Label>
            <h1 className="vx-display text-[2.8rem] sm:text-[4.4rem] md:text-[5.6rem] text-cream mt-5">Vardas <span className="gold-text">Venue</span></h1>
            <p className="text-mute max-w-lg mt-5 leading-[1.9]">{v.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-9"><Button to="/venue/enquire">Plan your event</Button><Button href={v.instagram.url} target="_blank" variant="ghost">@{v.instagram.handle}</Button></div>
          </div>
        </div>
      </section>

      <Section>
        <Heading label="What we host" title="Five ways to" gold="fill the room" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-edge border border-edge mt-12">
          {v.offerings.map(([t, d], i) => (
            <a key={t} href={`/venue/enquire?type=${TYPES[i]}`} className="group bg-night p-7 flex flex-col min-h-[260px] hover:bg-night-2 transition-colors vx-focus">
              <span className="vx-label text-mute-2">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="vx-display text-lg text-cream mt-auto group-hover:text-gold-light transition-colors">{t}</h3>
              <p className="text-sm text-mute mt-3 leading-relaxed">{d}</p>
              <span className="text-gold mt-5">Enquire →</span>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Heading label="See the room" title="Production" gold="ready" intro="Stage, sound and light in-house; bar and floor staff who run large nights every week at Vardas. Bring your brief — we build the night around it." />
            <ul className="mt-8 space-y-3 text-sm text-mute">
              <li>· Full stage, DJ booth and laser rig</li><li>· Bar service and catering packages</li><li>· Security, door and guest-list management</li><li>· Site visits on request</li>
            </ul>
          </div>
          <div className="lg:col-span-7"><Tour360 /></div>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Heading label="Talk to the events team" title="Tell us the" gold="date" intro="Send the date, guest count and the kind of event. We reply with availability and a proposal." />
            <div className="mt-8"><Button to="/venue/enquire">Start an enquiry</Button></div>
          </div>
          <div className="lg:col-span-7"><InstagramEmbed handle={v.instagram.handle} url={v.instagram.url} title="Vardas Venue — events" /></div>
        </div>
      </Section>
    </div>
  );
}
