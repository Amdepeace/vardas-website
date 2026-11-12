import { Link } from "react-router-dom";
import { Button, Heading, InstagramEmbed, Section, VideoHero } from "../components/vx";
import { Reveal } from "../components/Reveal";
import { Tour360 } from "./VardasPage";
import { VENUES } from "../data/site";

const TYPES = ["corporate", "corporate", "private", "concert", "wedding"];

export function VenuePage() {
  const v = VENUES.venue;
  return (
    <div>
      <VideoHero label="Vardas Venue" video="/media/venue-hero.mp4" videoMobile="/media/venue-hero-480.mp4" poster="/media/venue-hero-poster.jpg" orb={{ to: "/venue/enquire", text: ["Plan your", "event"] }} />
      <Section>
        <Reveal><Heading as="h1" size="lg" label={v.kind} title="Vardas Venue" intro={`${v.tagline} A full-production room at ${v.address}, with stage, sound and light in-house and the team that runs Vardas every week.`} /></Reveal>
        <Reveal><div className="flex flex-wrap justify-center gap-3 mt-9"><Button to="/venue/enquire">Plan your event</Button><Button href={v.instagram.url} target="_blank" variant="outline">@{v.instagram.handle}</Button></div></Reveal>
      </Section>
      <Section tone="raised" className="!py-16">
        <Heading title="What we host" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line-dark border border-line-dark mt-10">
          {v.offerings.map(([t, d], i) => (
            <Link key={t} to={`/venue/enquire?type=${TYPES[i]}`} className="group bg-ink-2 hover:bg-ink-3 transition-colors p-7 min-h-[220px] flex flex-col vx-focus">
              <h3 className="vx-display text-[0.95rem]">{t}</h3>
              <p className="text-[0.8rem] text-grey-4 mt-3 leading-relaxed">{d}</p>
              <span className="vx-label mt-auto pt-5">Enquire <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
      </Section>
      <Tour360 image="/gallery/venue-room-2.jpg" to="/venue/enquire" />
      <Section>
        <Heading title="Highlights" />
        <div className="grid md:grid-cols-2 max-w-4xl mx-auto mt-9 text-[0.84rem] text-grey-4">
          <ul className="md:text-right md:pr-8 md:border-r border-line-dark space-y-4"><li>Open floor for concerts, galas and receptions</li><li>Truss, stage and LED-ready production</li><li>Line-array sound and moving lights</li></ul>
          <ul className="md:pl-8 space-y-4 mt-4 md:mt-0"><li>Bar service and catering packages</li><li>Security, door and guest-list management</li><li>Site visits on request</li></ul>
        </div>
        <div className="max-w-xl mx-auto mt-16"><InstagramEmbed handle={v.instagram.handle} url={v.instagram.url} title="Vardas Venue — events" /></div>
      </Section>
    </div>
  );
}
